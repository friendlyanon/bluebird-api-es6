import define from "../define";

const impl = async (that, reducer, initialValue) => {
  const values = await that.all();
  const length = values.length;
  if (!length) return await initialValue;

  let i = 0;
  let result = initialValue == null ?
    await values[i++] :
    await initialValue;
  for (; i < length; ++i) {
    result = await reducer(result, values[i], i, length);
  }
  return result;
};

export default function(Bluebird) {
  define(Bluebird, {
    reduce: (v, reducer, initialValue) =>
      Bluebird.resolve(v).reduce(reducer, initialValue)
  });
  define(Bluebird.prototype, {
    reduce(reducer, initialValue) {
      return Bluebird.resolve(impl(this, reducer, initialValue));
    }
  });
}
