import define from "../define";

export default function(Bluebird) {
  define(Bluebird.prototype, {
    throw(value) { return this.then(() => { throw value; }); }
  });
}
