import { deepGetPropValues } from "../../src/objects/deepGetPropValues";
import { cloneObject } from "../../src/util";

describe("deepGetPropValues util:", () => {
  it("returns array of all values of a specified prop at all levels of the graph", () => {
    const schema = cloneObject(testObject);
    const chk = deepGetPropValues(schema, "scope");
    expect(chk).toEqual([
      "topLevel",
      "/properties/property1",
      "/properties/property2",
      "/properties/property3",
      "/properties/property4",
    ]);
  });
});

const testObject = {
  type: "Layout",
  scope: "topLevel",
  elements: [
    {
      type: "Section",
      options: { headerTag: "h4" },
      labelKey: "section1.label.key",
      elements: [
        {
          labelKey: "property1.label.key",
          scope: "/properties/property1",
          type: "Control",
        },
        {
          labelKey: "property2.label.key",
          scope: "/properties/property2",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "section2.label.key",
      elements: [
        {
          labelKey: "property3.label.key",
          scope: "/properties/property3",
          type: "Control",
        },
        {
          labelKey: "property4.label.key",
          scope: "/properties/property4",
          type: "Control",
        },
      ],
    },
  ],
};
