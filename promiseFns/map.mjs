import define from "../define";
import Queue from "./utils/queue";
const { ceil } = Math;

class Throttler {
  constructor(x, ...args) {
    this.args = args;
    this.limit = x;
    this.count = 0;
    this.queue = new Queue;
    this.rejectCount = 0;
  }
  push(step) {
    if (this.count >= this.limit) this.queue.enqueue(step);
    else void this.iterator(step);
  }
  async iterator(step) {
    const { queue, args: { 0: fn, 1: ctx, 2: length } } = this;
    for (++this.count; this.rejectCount === 0; step = queue.dequeue()) {
      try {
        step[2].call(null, await fn.call(ctx, await step[0], step[1], length));
      }
      catch (e) {
        ++this.rejectCount;
        step[3].call(null, e);
        break;
      }
      if (queue.size() === 0) break;
    }
  }
}

const impl = (xs, mapper, concurrency, ctx) => {
  const t = new Throttler(concurrency, mapper, ctx, xs.length);
  function then(r, e) { t.push([...this.xs, r, e]); this.xs = null; }
  return xs.map((x, i) => ({ xs: [x, i], then }));
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
