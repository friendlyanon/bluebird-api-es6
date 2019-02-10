import define from "../define";

// TODO: is this good enough?
const impl = async (that) => {
  const _true = () => true;
  const _false = () => false;
  try {
    const value = await that;
    return {
      isPending: _false,
      reason() {},
      value: () => value,
      isFulfilled: _true,
      isCancelled: _false,
      isRejected: _false,
    };
  }
  catch (e) {
    return {
      isPending: _false,
      reason: () => e,
      value() {},
      isFulfilled: _false,
      isCancelled: _false,
      isRejected: _true,
    };
  }
};

export default function(Bluebird) {
  define(Bluebird.prototype, {
    reflect() { return Bluebird.resolve(impl(this)); }
  });
}
