import define from "../define";

export default function(Bluebird) {
  define(Bluebird, {
    try(fn) {
      if (typeof fn === "function") {
        return Bluebird.resolve().then(fn);
      }
      return Bluebird.reject(new TypeError("Argument must be a function"));
    }
  });
}
