import * as errors from "./promiseErrors/index";
import * as fns from "./promiseFns/index";
import then from "./promiseFns/then";
import setScheduler from "./promiseFns/setScheduler";
import define from "./define";

const extensions = [errors, fns].flatMap(x => Object.values(x));
const configs = {
  config(obj) { /* logger.active = !!obj.warnings; */ },
  longStackTraces() {},
  hasLongStackTraces() { return false; },
};

function factory() {
  class Bluebird extends Promise {}
  // Bluebird.TypeError is used in tests
  define(Bluebird, "TypeError", TypeError);

  for (const extension of extensions) {
    extension(Bluebird);
  }

  // const logger = { log: console.warn, active: true };
  // const warningThen = then(Bluebird, logger);

  setScheduler(Bluebird);
  define(Bluebird, configs);

  // converted from async to traditional .then() since native async/await return
  // native promises.
  define(Bluebird.prototype, "all", function all() {
    return this.then(r => Bluebird.all(r));
  });

  return Bluebird;
}

const getNewProp = {
  getNewLibraryCopy() {
    const newCopy = factory();
    define(newCopy, getNewProp);
    return newCopy;
  }
};

const copy = define(factory(), getNewProp);

export default copy;
