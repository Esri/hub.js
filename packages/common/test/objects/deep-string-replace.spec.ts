import { deepStringReplace } from "../../src/objects/deep-string-replace";

describe("deepStringReplace", () => {
  it("works with a string", () => {
    const before = {
      foo: {
        bar: "replace",
      },
      baz: [{ value: "replace" }, { value: "replace" }, { value: "replace" }],
      beep: "replace",
      number: 123,
    };

    const after = deepStringReplace(before, "replace", "replaced");

    expect(after).toEqual({
      foo: {
        bar: "replaced",
      },
      baz: [
        { value: "replaced" },
        { value: "replaced" },
        { value: "replaced" },
      ],
      beep: "replaced",
      number: 123,
    });
  });

  it("works with a regex", () => {
    const before = {
      foo: {
        bar: "replace",
      },
      baz: [{ value: "replace" }, { value: "replace" }, { value: "replace" }],
      beep: "replace",
      number: 123,
    };

    const after = deepStringReplace(before, /replace/, "replaced");

    expect(after).toEqual({
      foo: {
        bar: "replaced",
      },
      baz: [
        { value: "replaced" },
        { value: "replaced" },
        { value: "replaced" },
      ],
      beep: "replaced",
      number: 123,
    });
  });
});
