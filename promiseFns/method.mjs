import define from "../define";

function impl(fn) {
  if (typeof fn !== "function") {
    throw new TypeError("Non function passed to .method");
  }
  const Bluebird = this;
  return define(function() {
    try { return Bluebird.resolve(fn.apply(this, arguments)); }
    catch (e) { return Bluebird.reject(e); }
  }, "name", fn.name);
}

export default function(Bluebird) {
  define(Bluebird, "method", impl.bind(Bluebird));
}
