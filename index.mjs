import Bluebird from "./promise";
import define from "./define";

if (typeof window !== "undefined") {
  define(window, { Bluebird });
}

export default Bluebird;
