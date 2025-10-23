import { removeEmptyProps } from "../../src/objects/remove-empty-props";

describe("removeEmptyProps", function () {
  it("removes empty props from an object", function () {
    const foo: any = {
      bar: undefined,
      baz: {
        boop: undefined,
        beep: "something",
      },
    };

    expect(Object.prototype.hasOwnProperty.call(foo, "bar")).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(foo, "baz")).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(foo.baz, "boop")).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(foo.baz, "beep")).toBeTruthy();

    removeEmptyProps(foo);

    expect(Object.prototype.hasOwnProperty.call(foo, "bar")).toBeFalsy();
    expect(Object.prototype.hasOwnProperty.call(foo, "baz")).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(foo.baz, "boop")).toBeFalsy();
    expect(Object.prototype.hasOwnProperty.call(foo.baz, "beep")).toBeTruthy();
  });
});
