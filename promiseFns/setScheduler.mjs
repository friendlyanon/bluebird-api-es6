import define from "../define";

export default function(Bluebird) {
  const { prototype: proto } = Bluebird;
  const { then } = proto;
  const setScheduler = define(function setScheduler(scheduler) {
    if (typeof scheduler !== "function") {
      throw new TypeError("Passed non function to setScheduler");
    }
    define(proto, {
      then(onFulfill, onReject) {
        return then.call(
          then.call(
            this,
            _ => new Bluebird(scheduler),
            _ => new Bluebird((_, r) => scheduler(r))
          ),
          onFulfill, onReject
        );
      }
    });
  }, {
    disable() { define(proto, { then }); }
  });
  define(Bluebird, { setScheduler });
}
