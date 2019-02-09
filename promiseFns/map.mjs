import define from "../define";
import { throttle } from "./util";

const impl = (values, mapper, concurrency, Bluebird) => {
  if (!concurrency) return Bluebird.all(values.map(mapper));
  const throttled = throttle(mapper, concurrency >>> 0, Bluebird);
  return Bluebird.all(values.map(throttled));
};

export default function(Bluebird) {
  define(Bluebird, {
    map: (v, mapper, opts) => Bluebird.resolve(v).map(mapper, opts)
  });
  define(Bluebird.prototype, {
    map(mapper, { concurrency } = {}) {
      return this.all().then(v => impl(v, mapper, concurrency, Bluebird));
    }
  });
}
