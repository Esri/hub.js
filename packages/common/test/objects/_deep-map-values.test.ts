import { _deepMapValues } from "../../src";

describe("_deepMapValues", function() {
  it("maps through multiple levels of an object", function() {
    const before = {
      foo: {
        bar: "replace"
      },
      baz: [{ value: "replace" }, { value: "replace" }, { value: "replace" }],
      beep: "replace"
    };

    const mapped = _deepMapValues(before, function(value, path) {
      return value === "replace" ? "newval" : value;
    });

    expect(mapped).toEqual(
      {
        foo: {
          bar: "newval"
        },
        baz: [{ value: "newval" }, { value: "newval" }, { value: "newval" }],
        beep: "newval"
      },
      "Replaced deep properties"
    );
  });
});
