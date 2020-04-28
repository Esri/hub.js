import { interpolateItemId } from "../../src";
import { IItem } from "@esri/arcgis-rest-types";

describe("interpolateItemId", function() {
  it("interpolates the item id", function() {
    const itemId = "ITEM_ID";
    const toReplace = "{{appid}}";
    const inModel = {
      item: {
        id: itemId
      } as IItem,
      data: {
        foo: toReplace,
        bar: {
          baz: toReplace
        },
        boop: "{{prop.no.exist:toISO}}"
      }
    };

    const interpolated = interpolateItemId(inModel);

    expect(interpolated.data.foo).toBe(itemId);
    expect(interpolated.data.bar.baz).toBe(itemId);
  });
});
