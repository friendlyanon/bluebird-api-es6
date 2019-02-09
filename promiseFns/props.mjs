import define from "../define";

const propsObject = async (obj) => {
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = await obj[key];
  }
  return result;
};
const propsMap = async (map) => {
  const result = new Map;
  for (const { 0: key, 1: value } of map) {
    result.set(key, await value);
  }
  return result;
};

const impl = value => {
  if (typeof value !== "object" || value == null) {
    throw new TypeError(`Expected an object passed to '.props', got ${
      typeof value} instead`);
  }
  return value instanceof Map ?
    propsMap(value) :
    propsObject(value);
};

export default function(Bluebird) {
  define(Bluebird, {
    props: v => Bluebird.resolve(v).props()
  });
  define(Bluebird.prototype, {
    props() { return this.then(impl); }
  });
}
