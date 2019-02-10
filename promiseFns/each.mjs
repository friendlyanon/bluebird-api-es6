import define from "../define";

const impl = async (that, iterator, context) => {
  const values = await that;
  const length = values.length;
  for (let i = 0; i < length; ++i) {
    await iterator.call(context, await values[i], i, length);
  }
  return values;
};

export default function(Bluebird) {
  define(Bluebird, {
    each: (v, iterator, opts) => Bluebird.resolve(v).each(iterator, opts)
  });
  define(Bluebird.prototype, {
    each(iterator, { context = null } = {}) {
      return Bluebird.resolve(impl(this, iterator, context));
    }
  });
}
