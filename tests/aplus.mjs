import promisesAplusTests from "promises-aplus-tests";
import Promise from "../promise";

// needed for aplus
process.on("unhandledRejection", (e, v) => {});

describe("Promises/A+ Tests", function () {
  promisesAplusTests.mocha({
    resolved(v) { return Promise.resolve(v); },
    rejected(e) { return Promise.reject(e); },
    deferred() {
      let resolve, reject;
      let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return {
        promise,
        resolve,
        reject
      };
    }
  });
});