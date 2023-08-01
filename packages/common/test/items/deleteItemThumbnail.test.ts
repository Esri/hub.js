import * as RequestModule from "@esri/arcgis-rest-request";
import { deleteItemThumbnail } from "../../src";
describe("deleteItemThumbnail:", () => {
  it("makes request to API", async () => {
    const spy = spyOn(RequestModule, "request").and.returnValue(
      Promise.resolve({})
    );
    await deleteItemThumbnail("3ef", "fakeOwner", {
      authentication: {},
      portal: "https://www.arcgis.com/sharing/rest",
    } as any);
    expect(spy.calls.count()).toBe(1);
    const args = spy.calls.argsFor(0)[0];

    expect(args).toBe(
      "https://www.arcgis.com/sharing/rest/content/users/fakeOwner/items/3ef/deleteThumbnail"
    );
  });
});
