import define from "../define";

const impl = (result, methodName, args) => {
  const method = result && result[methodName];
  if (method) return method.apply(result, args);
  const up = new Error(`Method ${methodName} doesn't exist`);
  up.object = result;
  throw up;
};

export default function(Bluebird) {
  define(Bluebird, {
    call: (obj, ...args) => Bluebird.resolve(obj).call(...args)
  });
  define(Bluebird.prototype, {
    call(methodName, ...args) {
      return this.then(v => impl(v, methodName, args));
    }
  });
}
