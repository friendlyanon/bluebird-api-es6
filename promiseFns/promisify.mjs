import define from "../define";
const nodePromisify = typeof process !== "undefined" &&
  typeof require === "function" ? require("util").promisify : null;
const {
  getOwnPropertyNames,
  getPrototypeOf,
  getOwnPropertyDescriptor,
  setPrototypeOf,
} = Object;
const { max } = Math;

const useThis = setPrototypeOf({}, null);
const identifierRegex = /^[a-z$_][a-z$_0-9]*$/i;
const thisAssignment = /this\s*\.\s*\S+\s*=/;

function promisifyFunction(fn, { context = useThis, multiArgs: m = false }) {
  const { Bluebird, promisifiedMap } = this;
  const resolver = m ? (r, a) => r(Bluebird.all(a)) : (r, a) => r(a[0]);
  function promisified(...args) {
    return new Bluebird((resolve, reject) => {
      try {
        fn.call(
          context === useThis ? this : context, ...args,
          (err, ...args) => { err ? reject(err) : resolver(resolve, args); }
        );
      }
      catch (error) {
        reject(error);
      }
    });
  }
  define(promisified, "length", max(fn.length - 1, 0));
  define(promisified, "name", fn.name);
  promisifiedMap.set(fn, promisified);
  promisifiedMap.set(promisified, promisified);
  return promisified;
}

const forbiddenPrototypes = [
  Object.prototype,
  Array.prototype,
  Function.prototype,
];

function getKeys(obj) {
  const visited = new Set().add("constructor");
  const result = [];
  for (
    let current = obj;
    obj && !forbiddenPrototypes.includes(current);
    current = getPrototypeOf(current)
  ) {
    for (const key of getOwnPropertyNames(current)) {
      if (visited.has(key)) continue;
      visited.add(key);
      const desc = getOwnPropertyDescriptor(current, key);
      if (desc.get != null || desc.set != null) continue;
      result.push(key);
    }
  }
  return result;
}

// TODO: this isn't really that good
function isClass(fn) {
  try {
    if (typeof fn !== "function") return false;
    const keys = getOwnPropertyNames(fn.prototype);
    if (
      keys.length > 1 ||
      keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor") ||
      thisAssignment.test(String(fn)) && getOwnPropertyNames(fn).length > 0
    ) {
      return true;
    }
  }
  catch (_) {}
  return false;
}

function defaultFilter(key) {
  return typeof key !== "string" ||
    !identifierRegex.test(key) ||
    key.charCodeAt(0) === 95 ||
    key === "constructor";
}

function internalPromisifyAll(obj, suffix, filter, promisifier, multiArgs) {
  const { promisifiedMap } = this;
  for (const key of getKeys(obj)) {
    const fn = obj[key];
    if (
      (
        typeof fn !== "function" ||
        promisifiedMap.has(fn) || promisifiedMap.has(obj[key + suffix])
      ) ||
      typeof filter === "function" ?
        !filter(key, fn, obj, !defaultFilter(key)) :
        defaultFilter(key)
    ) continue;
    obj[key + suffix] = typeof promisifier === "function" ?
      promisifier(fn, () => promisifyFunction.call(this, fn, { multiArgs })) :
      promisifyFunction.call(this, fn, { multiArgs });
  }
  return obj;
}

// exports

const promisify = nodePromisify ?
  function promisify(fn, { context = useThis, multiArgs = false } = {}) {
    const { Bluebird, promisifiedMap } = this;
    if (promisifiedMap.has(fn)) return promisifiedMap.get(fn);
    if (context === useThis && !multiArgs) {
      const wrapped = Bluebird.method(nodePromisify(fn));
      promisifiedMap.set(fn, wrapped);
      return wrapped;
    }
    return promisifyFunction.call(this, { fn, context, multiArgs });
  } :
  function promisify(fn, opts = {}) {
    const { promisifiedMap } = this;
    if (promisifiedMap.has(fn)) return promisifiedMap.get(fn);
    return promisifyFunction.call(this, fn, opts);
  };

function promisifyAll(obj, opts = {}) {
  const { promisifiedMap } = this;
  if (promisifiedMap.has(obj)) return promisifiedMap.get(obj);
  const {
    multiArgs = false,
    suffix = "Async",
    filter = null,
    promisifier = null,
  } = opts;
  if (typeof suffix !== "string" || !identifierRegex.test(suffix)) {
    throw new Error("The suffix is not a valid identifier");
  }
  const args = [suffix, filter, promisifier, multiArgs];
  for (const key of getKeys(obj)) {
    const fn = obj[key];
    if (isClass(fn)) {
      internalPromisifyAll.call(this, fn.prototype, ...args);
      internalPromisifyAll.call(this, fn, ...args);
    }
  }
  return internalPromisifyAll.call(this, obj, ...args);
}

function fromCallback(fn, { context = null, multiArgs: m = false } = {}) {
  const { Bluebird } = this;
  const resolver = m ? (r, a) => r(Bluebird.all(a)) : (r, a) => r(a[0]);
  return new Bluebird((res, rej) => {
    try {
      const cb = (err, ...args) => { err ? rej(err) : resolver(res, args); };
      fn.call(context, cb);
    }
    catch (error) {
      reject(error);
    }
  });
}

const exports = [promisify, promisifyAll, fromCallback];

export default function(Bluebird) {
  const that = { Bluebird, promisifiedMap: new WeakMap };
  for (const fn of exports) {
    define(Bluebird, fn.name, fn.bind(that));
  }
}
