import { removeEmptyProps } from "../../src";

describe("removeEmptyProps", function() {
  it("removes empty props from an object", function() {
    const foo: any = {
      bar: undefined,
      baz: {
        boop: undefined,
        beep: "something"
      }
    };

    expect(foo.hasOwnProperty("bar")).toBeTruthy();
    expect(foo.hasOwnProperty("baz")).toBeTruthy();
    expect(foo.baz.hasOwnProperty("boop")).toBeTruthy();
    expect(foo.baz.hasOwnProperty("beep")).toBeTruthy();

    removeEmptyProps(foo);

    expect(foo.hasOwnProperty("bar")).toBeFalsy();
    expect(foo.hasOwnProperty("baz")).toBeTruthy();
    expect(foo.baz.hasOwnProperty("boop")).toBeFalsy();
    expect(foo.baz.hasOwnProperty("beep")).toBeTruthy();
  });
});
