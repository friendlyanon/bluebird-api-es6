import define from "../define";
const nodePromisify = typeof process !== "undefined" &&
  typeof require === "function" ? require("util").promisify : null;

const useThis = Symbol();
const identifierRegex = /^[a-z$_][a-z$_0-9]*$/i;

function promisifyFunction({ fn, context, multiArgs: multi }) {
  const { Bluebird, promisifiedMap } = this;
  const promisified = new Proxy(fn, {
    apply(target, that, args) {
      return new Bluebird((resolve, reject) => {
        try {
          return fn.call(
            context === useThis ? that : context, ...args,
            (error, ...args) => {
              if (error) return void reject(error);
              return multi ? resolve(Bluebird.all(args)) : resolve(args[0]);
            }
          );
        }
        catch (error) {
          reject(error);
        }
      });
    }
  });
  promisifiedMap.set(fn, promisified);
  return promisified;
}

function promisify(fn, { context = useThis, multiArgs = false } = {}) {
  const { Bluebird, promisifiedMap } = this;
  if (promisifiedMap.has(fn)) return fn;
  if (nodePromisify && context === useThis && !multiArgs) {
    const promisified = nodePromisify(fn);
    const wrapped = function(...args) {
      return Bluebird.resolve(promisified.call(this, ...args));
    };
    promisifiedMap.set(fn, wrapped);
    return wrapped;
  }
  return promisifyFunction.call(this, { fn, context, multiArgs });
}

function promisifyAll(obj, {
  context = null,
  multiArgs = false,
  suffix = "Async",
  filter = null,
  promisifier = null
} = {}) {
  if (typeof suffix !== "string" || !identifierRegex.test(suffix)) {
    throw new Error("The suffix is not a valid identifier");
  }
  const { Bluebird, promisifiedMap } = this;
}

function fromCallback(fn, { context = null, multiArgs = false } = {}) {
  return new Bluebird((resolve, reject) => {
    let resolver = createResolver({ resolve, reject, multiArgs });

    return fn.apply(context, [resolver]);
  });
}

export default function(Bluebird) {
  const thisArg = { Bluebird, promisifiedMap: new WeakMap };
  define(Bluebird, "promisify", promisify.bind(thisArg));
  define(Bluebird, "promisifyAll", promisifyAll.bind(thisArg));
  define(Bluebird, "fromCallback", fromCallback.bind(thisArg));
}
