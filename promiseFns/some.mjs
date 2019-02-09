import define from "../define";

const impl = (promises, count, Bluebird) => {
  if (!promises.length) {
    throw new RangeError("The promises array does not have a length");
  }
  let i = 0;
  const results = [];
  const err = new Bluebird.AggregateError("Not enough promises resolved");
  let resolve, reject;
  const success = v => i >= count ? resolve(results) : results[i++] = v;
  const failure = e => {
    if (err.push(e) > promises.length - count) {
      reject(err);
    }
  };
  return new Bluebird((...args) => {
    [resolve, reject] = args;
    for (const promise of promises) {
      promise.then(success, failure);
    }
  });
};

export default function(Bluebird) {
  define(Bluebird, {
    some: (v, count) => Bluebird.resolve(v).some(count)
  });
  define(Bluebird.prototype, {
    some(amount) {
      return this.then(results => impl(results, amount, Bluebird));
    }
  });
}
