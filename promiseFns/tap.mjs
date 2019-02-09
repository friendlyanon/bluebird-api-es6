import define from "../define";

const impl = async (that, fn) => {
  const value = await that;
  await fn(value);
  return value;
};

export default function(Bluebird) {
  define(Bluebird, {
    tap: (v, onFulfilled) => Bluebird.resolve(impl(v, onFulfilled))
  });
  define(Bluebird.prototype, {
    tap(onFulfilled) { return Bluebird.resolve(impl(this, onFulfilled)); }
  });
}
