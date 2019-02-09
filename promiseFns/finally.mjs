import define from "../define";

const impl = async (that, fn) => {
  try { return await that; }
  finally { await fn(); }
};

export default function(Bluebird) {
  const props = { finally(fn) { return Bluebird.resolve(impl(this, fn)); } };
  props.lastly = props.finally;
  define(Bluebird.prototype, props);
}
