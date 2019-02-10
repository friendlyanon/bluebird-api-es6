import define from "../define";

const impl = async (that, mapper, context) => {
  const values = await that;
  const length = values.length;
  const result = Array(length);
  for (let i = 0; i < length; ++i) {
    result[i] = await mapper.call(context, await values[i], i, length);
  }
  return result;
};

export default function(Bluebird) {
  define(Bluebird, {
    mapSeries: (v, mapper, opts) => Bluebird.resolve(v).mapSeries(mapper, opts)
  });
  define(Bluebird.prototype, {
    mapSeries(mapper, { context = null } = {}) {
      return Bluebird.resolve(impl(this, mapper, context));
    }
  });
}
