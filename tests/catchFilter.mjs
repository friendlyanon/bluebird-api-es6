import assert from "assert";
import Promise from "../promise";
import testUtils from "./helpers/util";

testUtils.addDeferred(Promise);

class CustomError extends Error {
  constructor(errorHappens) {
    super(errorHappens);
  }
}

function BadError(msg) {
  this.message = msg;
  return this;
}

const predicateFilter = e => e.message.includes("invalid");
const predicateIsUndefined = e => e === void 0;
const predicateIsPrimitiveString = e => e === "asd";

const token = {};
const returnToken = () => token;
const assertToken = val => { assert.strictEqual(token, val); };

describe("A promise handler that throws a TypeError must be caught", () => {
  specify("in a middle.caught filter", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { a.b.c.d(); })
      .then(assert.fail)
      .caught(SyntaxError, () => { assert.fail(); })
      .caught(Promise.TypeError, returnToken)
      .then(assertToken);
  });
  specify("in a generic.caught filter that comes first", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { a.b.c.d(); })
      .then(assert.fail, returnToken)
      .caught(SyntaxError, () => { assert.fail(); })
      .caught(Promise.TypeError, () => { assert.fail(); })
      .then(assertToken);
  });
  specify("in an explicitly generic.caught filter that comes first", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { a.b.c.d(); })
      .then(assert.fail)
      .caught(Error, returnToken)
      .caught(SyntaxError, assert.fail)
      .caught(Promise.TypeError, assert.fail)
      .then(assertToken);
  });
  specify("in a specific handler after thrown in generic", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { a.b.c.d(); })
      .then(assert.fail, e => { throw e; })
      .caught(SyntaxError, assert.fail)
      .then(assert.fail)
      .caught(Promise.TypeError, returnToken)
      .then(assertToken);
  });
  specify("in a multi-filter handler",  () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { a.b.c.d(); })
      .then(assert.fail)
      .caught(SyntaxError, TypeError, returnToken)
      .then(assertToken);
  });
  specify("in a specific handler after non-matching multi.caught handler", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { a.b.c.d(); })
      .then(assert.fail)
      .caught(SyntaxError, CustomError, assert.fail)
      .caught(Promise.TypeError, returnToken)
      .then(assertToken)
  });
});

describe("A promise handler that throws a custom error", () => {
  specify("Is filtered if inheritance was done even remotely properly", () => {
    const a = Promise.defer();
    const b = new CustomError;
    a.fulfill(3);
    return a.promise
      .then(() => { throw b; })
      .then(assert.fail)
      .caught(SyntaxError, assert.fail)
      .caught(Promise.TypeError, assert.fail)
      .caught(CustomError, e => (assert.equal(e, b), token))
      .then(assertToken);
  });
  specify("Is filtered along with built-in errors", () => {
    const a = Promise.defer();
    const b = new CustomError;
    a.fulfill(3);
    return a.promise
      .then(() => { throw b; })
      .then(assert.fail)
      .caught(Promise.TypeError, SyntaxError, CustomError, returnToken)
      .caught(assert.fail)
      .then(assertToken)
  });
  specify("Throws after matched type handler throws", () => {
    const err = new Promise.TypeError;
    const err2 = new Error;
    return Promise
      .reject(err)
      .caught(Promise.TypeError, () => { throw err2; })
      .then(assert.fail, e => { assert.strictEqual(err2, e); });
  });
});

describe("A promise handler that throws a CustomError must be caught", () => {
  specify("in a middle.caught filter", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError; })
      .caught(SyntaxError, assert.fail)
      .caught(CustomError, returnToken)
      .then(assertToken);
  });
  specify("in a generic.caught filter that comes first", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError; })
      .then(assert.fail, returnToken)
      .caught(SyntaxError, assert.fail)
      .caught(CustomError, assert.fail)
      .then(assertToken);
  });
  specify("in an explicitly generic.caught filter that comes first", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError; })
      .caught(Error, returnToken)
      .caught(SyntaxError, assert.fail)
      .caught(CustomError, assert.fail)
      .then(assertToken);
  });
  specify("in a specific handler after thrown in generic", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError; })
      .then(assert.fail, e => { throw e; })
      .caught(SyntaxError, assert.fail)
      .caught(CustomError, returnToken)
      .then(assertToken);
  });
  specify("in a multi-filter handler", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError; })
      .caught(SyntaxError, CustomError, returnToken)
      .then(assertToken)
  });
  specify("in a specific handler after non-matching multi.caught handler", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError; })
      .caught(SyntaxError, TypeError, assert.fail)
      .caught(CustomError, returnToken)
      .then(assertToken);
  });
});

describe("A promise handler that is caught in a filter", () => {
  specify("is continued normally after returning a promise in filter", () => {
    const a = Promise.defer();
    const c = Promise.defer();
    const b = new CustomError;
    a.fulfill(3);
    setTimeout(c.fulfill, 1, 3);
    return a.promise
      .then(() => { throw b; })
      .caught(SyntaxError, assert.fail)
      .caught(Promise.TypeError, assert.fail)
      .caught(CustomError, e => (assert.equal(e, b), c.promise.thenReturn(token)))
      .then(assertToken, assert.fail, assert.fail);
  });
  specify("is continued normally after returning a promise in original handler", () => {
    const a = Promise.defer();
    const c = Promise.defer();
    a.fulfill(3);
    setTimeout(c.fulfill, 1, 3);
    return a.promise
      .then(() => c.promise)
      .caught(SyntaxError, assert.fail)
      .caught(Promise.TypeError, assert.fail)
      .caught(CustomError, assert.fail);
  });
});

describe("A promise handler with a predicate filter", () => {
  specify("will catch a thrown thing matching the filter", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new Error("horrible invalid error string"); })
      .caught(predicateFilter, returnToken)
      .then(assertToken);
  });
  specify("will NOT catch a thrown thing not matching the filter", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new Error("horrible valid error string"); })
      .caught(predicateFilter, assert.fail)
      .then(assert.fail, testUtils.noop);
  });
  specify("will assert.fail when a predicate is a bad error class", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new Error("horrible custom error"); })
      .caught(BadError, assert.fail)
      .then(assert.fail, returnToken)
      .then(assertToken);
  });
  specify("will catch a thrown undefined", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw void 0; })
      .caught(() => false, assert.fail)
      .caught(predicateIsUndefined, returnToken)
      .then(assertToken);
  });
  specify("will catch a thrown string", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw "asd"; })
      .caught(() => false, assert.fail)
      .caught(predicateIsPrimitiveString, returnToken)
      .then(assertToken);
  });
  specify("will assert.fail when a predicate throws", () => {
    const a = Promise.defer();
    a.fulfill(3);
    return a.promise
      .then(() => { throw new CustomError("error happens"); })
      .then(assert.fail, e => e.f.g, assert.fail)
      .caught(TypeError, returnToken)
      .then(assertToken);
  });
});

describe("object property predicates", () => {
  specify("matches 1 property loosely", () => {
    const e = new Error;
    e.code = "3";
    return Promise.resolve()
      .then(() => { throw e; })
      .caught({ code: 3 }, err => { assert.equal(e, err); });
  });
  specify("matches 2 properties loosely", () => {
    const e = new Error;
    e.code = "3";
    e.code2 = "3";
    return Promise.resolve()
      .then(() => { throw e; })
      .caught({ code: 3, code2: 3 }, err => { assert.equal(e, err); });
  });
  specify("doesn't match inequal properties", () => {
    const e = new Error;
    e.code = "3";
    e.code2 = "4";
    return Promise.resolve()
      .then(() => { throw e; })
      .caught({ code: 3, code2: 3 }, assert.fail)
      .caught(v => v === e, testUtils.noop);
  });
  specify("doesn't match primitives even if the property matches", () => {
    const e = "string";
    const length = e.length;
    return Promise.resolve()
      .then(() => { throw e; })
      .caught({ length }, assert.fail)
      .caught(v => typeof v === "string", err => { assert.equal(e, err); });
  });
});
