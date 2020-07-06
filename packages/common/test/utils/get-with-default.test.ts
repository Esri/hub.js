import { getWithDefault } from "../../src";

describe("getWithDefault", function() {
  it("returns default correctly", function() {
    const obj: { [key: string]: any } = {
      foo: "bar",
      baz: 0,
      beep: null
    };
    const defaultVal = "DEFAULT";

    expect(getWithDefault(obj, "foo", defaultVal)).toEqual(
      "bar",
      "returns prop value when present"
    );
    expect(getWithDefault(obj, "baz", defaultVal)).toEqual(
      0,
      "returns falsey prop value when present"
    );
    expect(getWithDefault(obj, "beep", defaultVal)).toBeNull(
      "returns null prop value when present"
    );
    expect(getWithDefault(obj, "boop", defaultVal)).toEqual(
      defaultVal,
      "returns default when value prop undefined"
    );
  });
});
