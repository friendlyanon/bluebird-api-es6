import define from "../define";

const filterFunc = function(_, i) { return !!this[i]; };
const impl = async (that,  predicate, concurrency) => {
  const values = await that.all();
  const predicateResults = await that.map(predicate, { concurrency });
  return values.filter(filterFunc, predicateResults);
};

export default function(Bluebird) {
  define(Bluebird, {
    filter: (v, predicate, opts) => Bluebird.resolve(v).filter(predicate, opts)
  });
  define(Bluebird.prototype, {
    filter(predicate, { concurrency } = {}) {
      return Bluebird.resolve(impl(this, predicate, concurrency));
    }
  });
}
