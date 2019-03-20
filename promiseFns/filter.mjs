import define from "../define";

function filter(predicate, opts) {
  return this.map(
    function(x, ...r) { return predicate.call(this, x, ...r) ? [x] : []; },
    opts
  ).then(xs => xs.flat());
}

export default function(Bluebird) {
  define(Bluebird, {
    filter: (v, predicate, opts) => Bluebird.resolve(v).filter(predicate, opts)
  });
  define(Bluebird.prototype, "filter", filter);
}
