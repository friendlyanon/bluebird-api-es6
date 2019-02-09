import define from "../define";

export default function(Bluebird) {
  define(Bluebird.prototype, {
    spread(fn) { return this.all().then(results => fn(...results)); }
  });
}
