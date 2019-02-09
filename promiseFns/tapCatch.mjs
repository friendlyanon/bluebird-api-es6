import define from "../define";
import { default as last } from "./utils/lastItem";

const impl = (that, a) => {
  return a.length > 1 ?
    that.catch(...a.slice(0, -1), async (e) => { await last(a)(e); throw e; }) :
    that.catch(...a);
};

export default function(Bluebird) {
  define(Bluebird, {
    tapCatch: (v, ...args) => Bluebird.resolve(impl(v, args))
  });
  define(Bluebird.prototype, {
    tapCatch(...args) { return Bluebird.resolve(impl(this, args)); }
  });
}
