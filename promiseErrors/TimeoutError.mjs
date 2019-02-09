import define from "../define";
import OperationalError from "./OperationalError";

class TimeoutError extends OperationalError {
  constructor(message) {
    super(message || "timeout error");
  }
}

export default function(Bluebird) {
  define(Bluebird, { TimeoutError });
}
