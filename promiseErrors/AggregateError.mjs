import define from "../define";
import OperationalError from "./OperationalError";

let level = 0;
const beginRegex = /^/gm;
class AggregateError extends OperationalError {
  constructor(message) {
    super(message);
    this.length = 0;
  }
  toString() {
    let message = `${" ".repeat(4 * level)}AggregateError of:\n`;
    const indent = " ".repeat(4 * ++level);
    for (const error of this) {
      try {
        message += `${
          error === this ?
            `${indent}[Circular AggregateError]` :
            String(error).replace(beginRegex, indent)
        }\n`;
      }
      catch (e) { message += `${String(e).replace(beginRegex, indent)}\n`; }
    }
    --level;
    return message;
  }
  static get [Symbol.species]() { return Array; }
}

const [source, target] = [Array.prototype, AggregateError.prototype];

for (const key of Reflect.ownKeys(source)) {
  switch (key) {
    case "length": case "constructor": case "toString": case "toLocaleString":
      continue;
  }
  define(target, key, source[key]);
}

export default function(Bluebird) {
  define(Bluebird, { AggregateError });
}
