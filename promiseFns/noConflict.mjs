import define from "../define";

const error = `Do not call noConflict with bluebird-api-es6
See getNewLibraryCopy for copying bluebird-api-es6`;

export default function(Bluebird) {
  define(Bluebird, {
    noConflict: () => console.error(error)
  });
}
