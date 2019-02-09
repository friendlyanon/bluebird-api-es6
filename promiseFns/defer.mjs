import define from "../define";

export default function(Bluebird) {
  function defer() {
    let resolve, reject, promise = new Bluebird(
      (...args) => [resolve, reject] = args
    );
    return { fulfill: resolve, resolve, reject, promise };
  }
  define(Bluebird, "defer", defer);
}
