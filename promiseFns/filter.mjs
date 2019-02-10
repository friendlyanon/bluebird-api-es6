import define from "../define";

const filterFunc = function(_, i) { return !!this[i]; };
const impl = async (that,  predicate, opts) => {
  const values = await that.all();
  const predicateResults = await that.map(predicate, opts);
  return values.filter(filterFunc, predicateResults);
};

export default function(Bluebird) {
  define(Bluebird, {
    filter: (v, predicate, opts) => Bluebird.resolve(v).filter(predicate, opts)
  });
  define(Bluebird.prototype, {
    filter(predicate, opts) {
      return Bluebird.resolve(impl(this, predicate, opts));
    }
  });
}
