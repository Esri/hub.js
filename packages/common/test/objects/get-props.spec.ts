import {
  describe,
  it,
  expect,
} from "vitest";
import { getProps } from "../../src/objects/get-props";

describe("getProps", () => {
  it("gets multiple props", () => {
    const obj = {
      foo: {
        bar: "baz",
        boop: "beep",
      },
    };

    const props = getProps(obj, ["foo.bar", "foo.boop", "foo.noexist"]);
    expect(props.length).toEqual(2);

    const [prop1, prop2] = props;
    expect(prop1).toEqual("baz");
    expect(prop2).toEqual("beep");
  });
});
