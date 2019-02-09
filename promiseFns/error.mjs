import define from "../define";

export default function(Bluebird) {
  function isOperationalError(e) {
    if (e == null) return false;
    return e instanceof Bluebird.OperationalError || e.isOperational === true;
  }
  define(Bluebird.prototype, {
    error(handler) { return this.catch(isOperationalError, handler); }
  });
}
