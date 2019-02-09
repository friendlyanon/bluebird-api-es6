import define from "../define";
import nextTick from "./utils/nextTick";

const thrower = e => nextTick(() => { throw e; });

export default function(Bluebird) {
  define(Bluebird.prototype, {
    done() { this.catch(thrower); }
  });
}
