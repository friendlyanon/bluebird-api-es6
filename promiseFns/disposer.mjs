import define from "../define";

const msg = "A disposer is not a promise. Use it with `Promise.using`.";
function then(_, reject) {
  const up = new Error(msg);
  if (typeof reject === "function") reject(up);
  throw up;
}

export default function(Bluebird) {
  define(Bluebird.prototype, {
    disposer(fn) { return { _use: this, _cleanup: fn, then }; }
  });
}
