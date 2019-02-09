import define from "../define";
import lastItem from "./utils/lastItem";

export default function(Bluebird) {
  define(Bluebird, {
    join(...args) {
      const last = lastItem(args);
      return typeof last === "function" ?
        Bluebird.all(args.slice(0, -1)).spread(last) :
        Bluebird.all(args);
    }
  });
}
