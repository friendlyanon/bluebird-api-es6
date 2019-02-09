import define from "../define";

const impl = async (that, iterator) => {
  const values = await that.all();
  const length = values.length;
  for (let i = 0; i < length; ++i) {
    await iterator(values[i], i, length);
  }
  return values;
};

export default function(Bluebird) {
  define(Bluebird, {
    each: (promise, iterator) => Bluebird.resolve(promise).each(iterator)
  });
  define(Bluebird.prototype, {
    each(iterator) { return Bluebird.resolve(impl(this, iterator)); }
  });
}
