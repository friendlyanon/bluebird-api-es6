import define from "../define";

const impl = async (that, iterator) => {
  const values = await that.all();
  const result = [];
  const length = values.length;
  for (let i = 0; i < length; ++i) {
    result[i] = await iterator(values[i], i, length);
  }
  return result;
};

export default function(Bluebird) {
  define(Bluebird, {
    mapSeries: (v, iterator) => Bluebird.resolve(v).mapSeries(iterator)
  });
  define(Bluebird.prototype, {
    mapSeries(iterator) { return Bluebird.resolve(impl(this, iterator)); }
  });
}
