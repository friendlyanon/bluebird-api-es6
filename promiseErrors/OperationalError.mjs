import define from "../define";

class OperationalError extends Error {
  constructor(message) {
    super(message);
  }
  get isOperational() {
    return true;
  }
  static fromError({ message, stack }) {
    return Object.assign(new OperationalError(message), { stack });
  }
}

export default function(Bluebird) {
  define(Bluebird, { OperationalError });
}
