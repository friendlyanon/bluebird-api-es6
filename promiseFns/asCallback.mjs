import define from "../define";
import { default as escape } from "./utils/nextTick";

export default function(Bluebird) {
  define(Bluebird.prototype, {
    asCallback(cb, opts) {
      const more = opts && opts.spread;
      // opt out of unhandledRejection detection
      this.catch(() => {});
      this.then(
        v => escape(() => { more ? cb(null, ...v) : cb(null, v); }),
        e => escape(() => cb(e))
      );
    }
  });
}
