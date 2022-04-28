import { createContentWithUrl } from "../../src/items/create-content-with-url";
import * as portal from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

describe("createContentWithUrl", () => {
  it("Properly calls createItem", async () => {
    const createItemSpy = spyOn(portal, "createItem").and.returnValue(
      Promise.resolve({ id: "123abc", success: true, folder: "test" })
    );
    const ro = {
      authentication: {
        portal: "http://some-org.mapsqaext.arcgis.com",
      },
    } as IUserRequestOptions;
    const item = {
      title: "Test.csv",
      type: "csv",
      owner: "test",
      dataUrl: "https://test.com",
      text: "This is a test",
      async: false,
    };
    const result = await createContentWithUrl(item, ro);
    expect(result).toEqual({ id: "123abc", success: true, folder: "test" });
    expect(createItemSpy.calls.count()).toBe(1);
  });
});
