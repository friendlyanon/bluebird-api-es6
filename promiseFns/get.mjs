import define from "../define";
const { max } = Math;

const impl = (value, prop) => {
  if (typeof prop !== "number" || (prop | 0) !== prop)  return value[prop];
  return prop < 0 ? value[max(prop + value.length, 0)] : value[prop];
};

export default function(Bluebird) {
  define(Bluebird, {
    get: (v, prop) => Bluebird.resolve(v).get(prop)
  });
  define(Bluebird.prototype, {
    get(prop) { return this.then(v => impl(v, prop)); }
  });
}
