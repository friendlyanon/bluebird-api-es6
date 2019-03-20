import define from "../define";
import escape from "./utils/nextTick";

export default function(Bluebird) {
  define(Bluebird.prototype, {
    asCallback(cb, { spread } = {}) {
      this.then(
        v => { escape(() => spread ? cb(null, ...v) : cb(null, v)); },
        e => { escape(() => cb(e)); }
      );
    }
  });
}
