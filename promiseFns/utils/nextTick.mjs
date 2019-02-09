export default typeof process !== "undefined" &&
  typeof process.nextTick === "function" ?
    process.nextTick :
    typeof setImmediate === "function" ?
      setImmediate : setTimeout;
