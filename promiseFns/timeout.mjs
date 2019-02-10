import define from "../define";

const impl = async (that, ms, message = "operation timed out", Bluebird) => {
  const sentinel = {};
  const value = await Bluebird.race([that, Bluebird.delay(ms, sentinel)]);
  if (value === sentinel) {
    throw message instanceof Error ?
      message :
      new Bluebird.TimeoutError(message);
  }
  return value;
};

export default function(Bluebird) {
  define(Bluebird, {
    timeout: (v, ms, message) => Bluebird.resolve(v).timeout(ms, message)
  });
  define(Bluebird.prototype, {
    timeout(ms, message) {
      return Bluebird.resolve(impl(this, ms, message, Bluebird));
    }
  });
}
