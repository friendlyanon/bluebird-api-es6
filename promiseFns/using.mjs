import define from "../define";

const impl = async function(resolve, reject) {
  const { 0: Bluebird, 1: args } = this;
  const len = args.length;
  if (len < 2) {
    return reject(new RangeError("Invalid number of arguments"));
  }
  const fn = args.pop();
  if (typeof fn !== "function") {
    return reject(new TypeError("Handler is not a function"));
  }
  const disposers = Array(len - 1).fill(null);
  try {
    const values = len === 2 && Array.isArray(args[0]) ? args[0] : args;
    const resources = await Bluebird.all(values.map((disposer, i) => {
      switch (typeof disposer) {
        case "function": break;
        case "object": if (disposer != null) break;
        default: return null;
      }
      if (disposer._use) return (disposers[i] = disposer), disposer._use;
      else if (disposer.then) return Bluebird.resolve(disposer);
      return null;
    }));
    resolve(await fn(...resources));
  }
  catch (e) {
    reject(e);
  }
  finally {
    try {
      await Bluebird.all(disposers.map(v => v && v._cleanup()));
    }
    catch (e) {
      // no chance of recovery, just dump the error and kill the process if we
      // are in Node, otherwise rethrow and cause an uncaught exception error
      console.error(e);
      if (typeof process === "undefined" || typeof process.exit !== "function")
        throw e;
      process.exit(1);
    }
  }
};

export default function(Bluebird) {
  define(Bluebird, {
    using(...args) { return new Bluebird(impl.bind([Bluebird, args])); }
  });
}
