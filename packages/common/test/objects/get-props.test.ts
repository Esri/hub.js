import { getProps } from "../../src";

describe("getProps", function() {
  it("gets multiple props", function() {
    const obj = {
      foo: {
        bar: "baz",
        boop: "beep"
      }
    };

    const props = getProps(obj, ["foo.bar", "foo.boop", "foo.noexist"]);
    expect(props.length).toEqual(2, "Only returned existant props");

    const [prop1, prop2] = props;
    expect(prop1).toEqual("baz");
    expect(prop2).toEqual("beep");
  });
});
