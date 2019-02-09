import define from "../define";

export default function(Bluebird) {
  define(Bluebird, {
    onPossiblyUnhandledRejection(fn) {
      if (typeof process !== "undefined" && typeof process.on === "function") {
        process.on("unhandledRejection", (reason, promise) => {
          if (promise instanceof Bluebird) {
            return fn(reason, promise);
          }
          if (process.listenerCount("unhandledRejection") > 1) {
            return false;
          }
          // default to throwing per Node's policy
          throw reason;
        });
      }
      else if (
        typeof window !== "undefined" &&
        typeof window.addEventListener === "function"
      ) {
        window.addEventListener("unhandledrejection",  event => {
          if (event.promise instanceof Bluebird) {
            return fn(event.reason, event.promise);
          }
          throw event.reason;
        });
      }
      else {
        throw new Error("Not supported by the environment");
      }
    },
    onUnhandledRejectionHandled() {
      throw new Error("Not implemented");
    }
  });
}
