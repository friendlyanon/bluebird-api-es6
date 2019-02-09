import assert from "assert";
import Promise from "../promise";

describe("AggregateError", () => {
  it("is on the promise object", () => {
    assert(Promise.AggregateError);
  });
  it("is an error subclass", () => {
    assert(new Promise.AggregateError instanceof Error);
  });
  it("is operational", () => {
    assert(new Promise.AggregateError().isOperational);
  });
  it("has a forEach property", () => {
    assert("forEach" in new Promise.AggregateError);
  });
  it("has a length property", () => {
    assert("length" in new Promise.AggregateError);
  });
  it("has a stack property", () => {
    try {
      throw new Promise.AggregateError;
    }
    catch (err) {
      assert("stack" in err);
    }
  });
  it("iterates errors with forEach", () => {
    const err = new Promise.AggregateError;
    err.push(new Error("hello"));
    let count = 0;
    err.forEach(e => {
      count++;
      assert.equal(e.message, "hello");
    });
    assert.equal(count, 1);
  });
  it("iterates errors with for..of", () => {
    const err = new Promise.AggregateError;
    err.push(new Error("hello"));
    let count = 0;
    for (const e of err) {
      count++;
      assert.equal(e.message, "hello");
    }
    assert.equal(count, 1);
  });
  it("returns an array when using an array method", () => {
    const err = new Promise.AggregateError;
    err.push(new Error("plain"));
    err.push(new TypeError("type"));
    let count = 0;
    const filtered = err.filter(x => ++count && (x instanceof TypeError));
    assert(Array.isArray(filtered));
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].message, "type");
    assert.equal(Object.getPrototypeOf(filtered[0]), TypeError.prototype);
    assert.equal(count, 2);
  });
});
