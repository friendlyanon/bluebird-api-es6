import define from "../define";
import escape from "./utils/nextTick";

const thrower = e => escape(() => { throw e; });

export default function(Bluebird) {
  define(Bluebird.prototype, {
    done() { this.catch(thrower); }
  });
}
