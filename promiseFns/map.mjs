import define from "../define";
// TODO: investigate stack overflow potential
// import escape from "./utils/nextTick";
import Queue from "./utils/queue";
const { ceil } = Math;

async function step(fn, ctx, [[x, i], resolve, reject], len, counter, gen) {
  try {
    resolve(await fn.call(ctx, await x, i, len));
    --counter.count;
    gen.next();
  }
  catch (e) {
    reject(e);
    gen.return();
  }
}

function* throttle(fn, concurrency, ctx, _self, len) {
  const { self } = _self;
  const counter = { count: 0 };
  const queue = new Queue;
  const call = x => (++counter.count, step(fn, ctx, x, len, counter, self));
  for (;;) {
    const next = yield;
    if (counter.count >= concurrency) {
      if (next) queue.enqueue(next);
      continue;
    }
    if (next) {
      call(next);
      continue;
    }
    if (!queue.size()) continue;
    call(queue.dequeue());
  }
}

const impl = (xs, mapper, concurrency, ctx) => {
  const self = {}, gen = throttle(mapper, concurrency, ctx, self, xs.length);
  (self.self = gen).next();
  function then(...args) { gen.next([this.data, ...args]); }
  return xs.map((x, i) => ({ data: [x, i], then }));
};

export default function(Bluebird) {
  define(Bluebird, {
    map: (v, mapper, opts) => Bluebird.resolve(v).map(mapper, opts)
  });
  define(Bluebird.prototype, {
    map(mapper, { concurrency: c = 20, context: ctx = null } = {}) {
      return !(c > 1) ? this.mapSeries(mapper, { context: ctx }) :
        this.all().then(xs => Bluebird.all(impl(xs, mapper, ceil(c), ctx)));
    }
  });
}
