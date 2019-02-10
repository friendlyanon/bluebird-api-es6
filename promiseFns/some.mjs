import define from "../define";

// TODO: potential deadlock
const impl = (promises, amount, Bluebird) => {
  const len = promises.length;
  if (!len) {
    throw new RangeError("The promises array does not have a length");
  }
  let i = 0;
  const results = [];
  const err = new Bluebird.AggregateError("Not enough promises resolved");
  let resolve, reject;
  const success = v => i >= amount ? resolve(results) : results[i++] = v;
  const failure = e => err.push(e) > len - amount && reject(err);
  return new Bluebird((...args) => {
    [resolve, reject] = args;
    for (const promise of promises) {
      promise.then(success, failure);
    }
  });
};

export default function(Bluebird) {
  define(Bluebird, {
    some: (v, amount) => Bluebird.resolve(v).some(amount)
  });
  define(Bluebird.prototype, {
    some(amount) {
      return this.then(results => impl(results, amount, Bluebird));
    }
  });
}
