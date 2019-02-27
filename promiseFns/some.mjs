import define from "../define";

const impl = (xs, amount, Bluebird) => {
  const len = xs.length;
  if (!len) {
    throw new RangeError("The promises array does not have a length");
  }
  let i = 0, j = 0;
  const results = [];
  const err = new Bluebird.AggregateError("Not enough promises resolved");
  let resolve, reject;
  const success = v => i >= amount ? resolve(results) : results[i++] = v;
  const failure = e => err.push(e) > len - amount && reject(err);
  const check = () => ++j >= len && i < amount && reject(err);
  return new Bluebird((...args) => {
    [resolve, reject] = args;
    for (const x of xs) Bluebird.resolve(x).then(success, failure).then(check);
  });
};

export default function(Bluebird) {
  define(Bluebird, {
    some: (v, amount) => Bluebird.resolve(v).some(amount)
  });
  define(Bluebird.prototype, {
    some(amount) {
      return this.then(xs => impl(xs, amount, Bluebird));
    }
  });
}
