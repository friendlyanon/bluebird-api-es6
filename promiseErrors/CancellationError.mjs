import define from "../define";

// cancellation is not supported, exporting the error type for compatibility
class CancellationError extends Error {}

export default function(Bluebird) {
  define(Bluebird, { CancellationError });
}
