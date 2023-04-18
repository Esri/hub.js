import { deepSet } from "../../src";

describe("deepSet", function () {
  it("sets deep properties", function () {
    const foo: Record<string, any> = {
      horses: {
        types: {
          spalding: true,
        },
      },
      apple: null,
      whale: "dolphin",
      cars: {
        toyota: "camry",
      },
      location: {
        type: "org",
        extent: [[], []],
        geometry: {},
      },
    };
    deepSet(foo, "horses.types.spalding", false);
    deepSet(foo, "bar.baz", "beep");
    deepSet(foo, "apple.orange", "banana");
    deepSet(foo, "whale", "shark");
    deepSet(foo, "cars", { honda: "accord" });
    deepSet(foo, "location", { type: "none" }, true);

    expect(foo.horses.types.spalding).toBeFalsy("sets deep path when exists");
    expect(foo.bar.baz).toBe("beep", "constructs path if doesnt exist");
    expect(foo.apple.orange).toBe("banana", "overwrites nulls");
    expect(foo.whale).toBe("shark", "overwrites non-object values");
    expect(foo.cars).toEqual(
      {
        toyota: "camry",
        honda: "accord",
      },
      "merges objects"
    );
    expect(foo.location).toEqual({ type: "none" }, "replaces objects");
  });
});
