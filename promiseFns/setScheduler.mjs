import define from "../define";

export default function(Bluebird) {
  const { prototype: proto } = Bluebird;
  const orig = proto.then;
  const setScheduler = define(function setScheduler(scheduler) {
    if (typeof scheduler !== "function") {
      throw new TypeError("Passed non function to setScheduler");
    }
    define(proto, {
      then(onFulfill, onReject) {
        return orig.call(
          orig.call(
            this,
            _ => new Promise(scheduler),
            _ => new Promise((_, r) => scheduler(r))
          ),
          onFulfill, onReject
        );
      }
    });
  }, {
    disable() { define(proto, { then: orig }); }
  });
  define(Bluebird, { setScheduler });
}
