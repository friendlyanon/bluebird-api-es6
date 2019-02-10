import define from "../define";

export default function(Bluebird) {
  define(Bluebird, "any", promise => Bluebird.resolve(promise).any());
  define(Bluebird.prototype, {
    any() { return this.some(1).get(0); }
  });
}
