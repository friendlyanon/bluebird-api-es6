import define from "../define";

export default function(Bluebird) {
  define(Bluebird, "delay", (ms, v) => Bluebird.resolve(v).delay(ms));
  define(Bluebird.prototype, {
    delay(ms) {
      return this.then(
        v => new Bluebird(_ => setTimeout(_, ms >>> 0, v))
      );
    }
  });
}
