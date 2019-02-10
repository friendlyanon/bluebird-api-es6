export default typeof process !== "undefined" &&
  typeof process.nextTick === "function" ?
    process.nextTick :
    typeof setImmediate === "function" ?
      setImmediate : (fn, ...args) => setTimeout(fn, 0, ...args);
