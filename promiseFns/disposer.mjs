import define from "../define";

const msg = "A disposer is not a promise. Use it with `Promise.using`.";
function then(_, reject) {
  if (typeof reject === "function") reject(new TypeError(msg));
}

export default function(Bluebird) {
  define(Bluebird.prototype, {
    disposer(fn) { return { _use: this, _cleanup: fn, then }; }
  });
}
