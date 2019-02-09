import define from "../define";

function method(fn) {
  if (typeof fn !== "function") {
    throw new TypeError("Non function passed to .method");
  }
  const proxy = async function() {
    return fn.apply(this, arguments);
  };
  const Bluebird = this;
  const name = fn.name;
  // this way the function name is preserved if it's not a symbol
  return { [name]() {
    return Bluebird.resolve(proxy.apply(this, arguments));
  } }[name];
}

export default function(Bluebird) {
  define(Bluebird, "method", method.bind(Bluebird));
}
