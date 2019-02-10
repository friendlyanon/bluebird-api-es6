import define from "../define";

export default function(Bluebird) {
  define(Bluebird.prototype, {
    suppressUnhandledRejections() { return this.catch(() => {}); }
  });
}
