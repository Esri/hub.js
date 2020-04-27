import { interpolateItemId, IModel, IModelTemplate } from "../../src";
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
        beep: "{{123:toISO}}"
      }
    };

    const interpolated = interpolateItemId(inModel);

    expect(interpolated.data.foo).toBe(itemId);
    expect(interpolated.data.bar.baz).toBe(itemId);
    expect(interpolated.data.beep).toEqual(jasmine.any(Date));
  });
});
