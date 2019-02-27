import define from "../define";
// TODO: investigate stack overflow potential
// import escape from "./utils/nextTick";
import Queue from "./utils/queue";
const { ceil } = Math;
const noop = () => {};

// ([mapper, ctx, length], [x, i, resolve, reject], gen)
async function invoke(args, step, gen) {
  try {
    ++gen.count;
    step[2](await args[0].call(args[1], await step[0], step[1], args[2]));
    --gen.count;
    gen.next();
  }
  catch (e) {
    step[3](e);
    if (gen.next !== noop) gen.next = noop;
  }
}

class Throttler {
  constructor(x, ...args) {
    this.args = args;
    this.limit = x;
    this.count = 0;
    this.queue = new Queue;
  }
  push(step) {
    if (this.count >= this.limit) this.queue.enqueue(step);
    else void invoke(this.args, step, this);
  }
  next() {
    if (this.count >= this.limit || !this.queue.size()) return;
    void invoke(this.args, this.queue.dequeue(), this);
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
