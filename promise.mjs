import * as promiseErrors from "./promiseErrors/index";
import * as promiseFns from "./promiseFns/index";
import then from "./promiseFns/then";
import setScheduler from "./promiseFns/setScheduler";
import define from "./define";

function factory() {
  class Bluebird extends Promise {}
  // Bluebird.TypeError is used in tests
  define(Bluebird, "TypeError", TypeError);

  const extensions = [
    ...Object.values(promiseErrors),
    ...Object.values(promiseFns)
  ];

  for (const extension of extensions) {
    extension(Bluebird);
  }

  // const logger = { log: console.warn, active: true };
  // const warningThen = then(Bluebird, logger);

  setScheduler(Bluebird);
  define(Bluebird, {
    config(obj) { /* logger.active = !!obj.warnings; */ },
    longStackTraces() {},
    hasLongStackTraces() { return false; },
  });

  // converted from async to traditional .then() since native async/await return
  // native promises.
  define(Bluebird.prototype, "all", function all() {
    return this.then(r => Bluebird.all(r));
  });

  return Bluebird;
}
const copy = define(factory(), "getNewLibraryCopy", () => {
  const newCopy = factory();
  newCopy.getNewLibraryCopy = copy.getNewLibraryCopy;
  return newCopy;
});

export default copy;
