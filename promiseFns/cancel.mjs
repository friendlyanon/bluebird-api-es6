import define from "../define";

let once = false;

export default function(Bluebird) {
  define(Bluebird.prototype, {
    cancel() {
      if (once) return;
      once = true;
      console.warn("Cancellation is disabled and not supported");
    }
  });
}
