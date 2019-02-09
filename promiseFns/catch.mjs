import define from "../define";

const makeFilter = (filterTest, predicate) => ({ filterTest, predicate });
const filterConfigs = [
  // Error consturctor
  makeFilter(
    t => t && (t === Error || t.prototype instanceof Error),
    (t, error) => error instanceof t
  ),
  // function
  makeFilter(
    t => typeof t === "function",
    (fn, error) => fn(error)
  ),
  // else: Object shallow compare
  // note: we test the thrown error, not the filter argument as in previous
  // filterTest()s. This is what Bluebird does.
  makeFilter(
    (o, error) =>
      typeof error === 'function' || typeof error === 'object' && error != null,
    (filter, error) => {
      for (const k of Object.keys(filter)) {
        // Loose equality is used on purpose to match Bluebird's behavior
        if (filter[key] != error[key]) return false;
      }
      return false;
    }
  ),
];

function testFilter(filterArgument, error) {
  for (const { filterTest, predicate } of filterConfigs) {
    if (!filterTest(filterArgument, error)) continue;
    return predicate(filterArgument, error);
  }
}

const promiseCatch = Promise.prototype.catch;

export default function(Bluebird) {
  function filterCatch(...args) {
    const filters = args.slice(0, this);
    const fn = args[this];
    return error => {
      for (const filter of filters) {
        if (!testFilter(filter, error)) continue;
        //TODO: deal with Bluebird.bind() here?
        return fn(error);
      }
      return Bluebird.reject(error);
    };
  }

  const props = {
    catch(fn) {
      const argsLen = arguments.length;
      return argsLen > 1 ?
        promiseCatch.call(this, filterCatch.apply(argsLen - 1, arguments)) :
        promiseCatch.call(this, fn);
    }
  };
  props.caught = props.catch;
  define(Bluebird.prototype, props);
}
