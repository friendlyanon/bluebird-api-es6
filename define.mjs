const { defineProperty: def } = Object;

function wrap(value) {
  return { value, writable: true, configurable: true };
}

export default function define(obj, ...rest) {
  if (rest.length !== 1) {
    const { 0: key, 1: value } = rest;
    if (typeof key !== "object") def(obj, key, wrap(value));
    else for (const k of key) def(obj, k, wrap(value));
    return obj;
  }
  const { 0: props } = rest;
  for (const key in props) {
    def(obj, key, wrap(props[key]));
  }
  return obj;
}
