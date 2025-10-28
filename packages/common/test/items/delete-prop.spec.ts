import {
  describe,
  it,
  expect,
} from "vitest";
import { deleteProp } from "../../src/items/delete-prop";

describe("deleteProp", () => {
  it("deletes a property", () => {
    const obj = {
      foo: {
        bar: {
          baz: "boop",
        },
      },
    };
    deleteProp(obj, "foo.bar.baz");
    expect(obj.foo.bar.baz).toBeUndefined();
  });

  it("deals with non-existant paths", () => {
    const obj = {
      foo: {
        bar: "baz",
      },
    };
    deleteProp(obj, "foo.bar.bleep.bloop");
    expect(obj).toEqual(obj);
  });

  it("deals with incorrect inputs", () => {
    const obj = "haha" as unknown as Record<string, any>;
    deleteProp(obj, "");
    expect(obj).toEqual(obj);

    const lookupStr = 123 as unknown as string;
    deleteProp({}, lookupStr);
    expect(obj).toEqual(obj);
  });
});
