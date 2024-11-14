import { IItem } from "@esri/arcgis-rest-portal";
import { applyPropertiesToItems } from "../../src";

describe("applyPropertiesToItems", () => {
  it("applyPropertiesToItems", () => {
    const items = [{}, { properties: { baz: "boop" } }] as IItem[];

    const out = applyPropertiesToItems(items, {
      foo: "bar"
    });

    expect(out).toEqual([
      { properties: { foo: "bar" } },
      { properties: { baz: "boop", foo: "bar" } }
    ] as IItem[]);
  });
});
