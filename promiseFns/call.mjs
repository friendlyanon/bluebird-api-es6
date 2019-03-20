import define from "../define";

const impl = (result, methodName, args) => {
  const method = result != null && result[methodName];
  if (typeof method === "function") return method.apply(result, args);
  throw new Error(`Method ${methodName} doesn't exist`);
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
