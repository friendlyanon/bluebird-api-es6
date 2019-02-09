import define from "../define";

export default function(Bluebird) {
  define(Bluebird, "case", Promise.resolve);
}
