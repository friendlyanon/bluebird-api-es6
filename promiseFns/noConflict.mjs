import define from "../define";

const error = `Do not call noConflict with bluebird-api
See getNewLibraryCopy for copying bluebird-api`;

export default function(Bluebird) {
  define(Bluebird, {
    noConflict: () => console.error(error)
  });
}
