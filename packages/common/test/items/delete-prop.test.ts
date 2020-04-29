import { deleteProp } from "../../src";

describe("deleteProp", function() {
  it("deletes a property", function() {
    const obj = {
      foo: {
        bar: {
          baz: "boop"
        }
      }
    };
    deleteProp(obj, "foo.bar.baz");
    expect(obj.foo.bar.baz).toBeUndefined();
  });

  it("deals with non-existant paths", function() {
    const obj = {
      foo: {
        bar: "baz"
      }
    };
    deleteProp(obj, "foo.bar.bleep.bloop");
    expect(obj).toEqual(obj, "object not changed when path didnt exist");
  });

  it("deals with incorrect inputs", function() {
    const obj = ("haha" as unknown) as Record<string, any>;
    deleteProp(obj, "");
    expect(obj).toEqual(obj, "object not changed when wrong arg type");

    const lookupStr = (123 as unknown) as string;
    deleteProp({}, lookupStr);
    expect(obj).toEqual(obj, "object not changed when wrong arg type");
  });
});
