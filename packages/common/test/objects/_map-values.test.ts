import { _mapValues } from "../../src";

describe("_mapValues", function() {
  it("maps over the values of an object", function() {
    const before = {
      foo: "bar",
      baz: "boop",
      beep: "bloop"
    };

    const expectedArgs = [
      ["bar", "foo", before],
      ["boop", "baz", before],
      ["bloop", "beep", before]
    ];
    let counter = 0;
    const mapped = _mapValues(before, function(...args) {
      expect(args).toEqual(expectedArgs[counter]);
      counter++;
      return "overwrite";
    });
    expect(mapped).toEqual(
      {
        foo: "overwrite",
        baz: "overwrite",
        beep: "overwrite"
      },
      "values were overwritten with the return from the callback"
    );
  });
});
