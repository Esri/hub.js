import { deepStringReplace } from "../../src";

describe("deepStringReplace", function() {
  it("works with a string", function() {
    const before = {
      foo: {
        bar: "replace"
      },
      baz: [{ value: "replace" }, { value: "replace" }, { value: "replace" }],
      beep: "replace"
    };

    const after = deepStringReplace(before, "replace", "replaced");

    expect(after).toEqual(
      {
        foo: {
          bar: "replaced"
        },
        baz: [
          { value: "replaced" },
          { value: "replaced" },
          { value: "replaced" }
        ],
        beep: "replaced"
      },
      "replaced deep strings"
    );
  });

  it("works with a regex", function() {
    const before = {
      foo: {
        bar: "replace"
      },
      baz: [{ value: "replace" }, { value: "replace" }, { value: "replace" }],
      beep: "replace"
    };

    const after = deepStringReplace(before, /replace/, "replaced");

    expect(after).toEqual(
      {
        foo: {
          bar: "replaced"
        },
        baz: [
          { value: "replaced" },
          { value: "replaced" },
          { value: "replaced" }
        ],
        beep: "replaced"
      },
      "replaced deep strings"
    );
  });
});
