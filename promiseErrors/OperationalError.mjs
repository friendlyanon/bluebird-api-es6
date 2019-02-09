import define from "../define";

class OperationalError extends Error {
  get isOperational() {
    return true;
  }
  static fromError(error) {
    return Object.assign(new OperationalError(error.message), {
      stack: error.stack
    });
  }
}

export default function(Bluebird) {
  define(Bluebird, { OperationalError });
}
