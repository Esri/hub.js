import {
  describe,
  it,
  expect,
} from "vitest";
import { _mapValues } from "../../src/objects/_map-values";

describe("_mapValues", () => {
  it("maps over the values of an object", () => {
    const before = {
      foo: "bar",
      baz: "boop",
      beep: "bloop",
    };

    const expectedArgs = [
      ["bar", "foo", before],
      ["boop", "baz", before],
      ["bloop", "beep", before],
    ];
    let counter = 0;
    const mapped = _mapValues(before, function (...args) {
      expect(args).toEqual(expectedArgs[counter]);
      counter++;
      return "overwrite";
    });
    expect(mapped).toEqual({
      foo: "overwrite",
      baz: "overwrite",
      beep: "overwrite",
    });
  });
});
