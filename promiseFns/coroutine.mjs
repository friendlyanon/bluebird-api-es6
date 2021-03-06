import define from "../define";

const isPromise = obj => obj != null && typeof obj.then === "function";

const handlers = [
  value => ({ value, errorMode: false }),
  error => ({ error, errorMode: true })
];

async function runGenerator(generator, args, yieldHandlers, thisContext) {
  const it = generator.apply(thisContext, args);

  for (let value, done, errorMode = false, error;;) {
    ({ value, done } = errorMode ? it.throw(error) : it.next(value));
    if (done) return value;
    const promise = processValue(value, yieldHandlers).then(...handlers);
    ({ value, error, errorMode } = await promise);
  }
}

function* handlerResults(value, yieldHandlers) {
  for (const fn of yieldHandlers) {
    const result = fn(value);
    if (result) yield result;
  }
}

async function processValue(value, yieldHandlers) {
  const [result] = handlerResults(value, yieldHandlers);
  if (isPromise(result)) return await result;
  throw new TypeError("Not a promise");
}

export default function(Bluebird) {
  const yieldHandlers = [];
  define(Bluebird, "coroutine", define(
    function coroutine(generator, { yieldHandler = null } = {}) {
      return function(...args) {
        const allYieldHandlers = yieldHandler ?
          [yieldHandler, ...yieldHandlers] :
          yieldHandlers;
        const result = runGenerator(generator, args, allYieldHandlers, this);
        return Bluebird.resolve(result);
      };
    },
    "addYieldHandler",
    handler => {
      if (typeof handler !== "function") {
        throw new TypeError("Handler must be a function");
      }
      yieldHandlers.push(handler);
    }
  ));
}
