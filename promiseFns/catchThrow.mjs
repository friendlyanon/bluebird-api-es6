import define from "../define";
import argumentsSlice from "./utils/argumentsSlice";

export default function(Bluebird) {
  define(Bluebird.prototype, {
    catchThrow(value) {
      const fn = () => { throw value };
      return arguments.length > 1 ?
        this.catch(...argumentsSlice.apply([0, -1], arguments), fn) :
        this.catch(fn);
    }
  });
}
