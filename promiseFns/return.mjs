import define from "../define";

export default function(Bluebird) {
  const props = {
    return(value) { return this.then(() => value); }
  };
  props.thenReturn = props.return;
  define(Bluebird.prototype, props);
}
