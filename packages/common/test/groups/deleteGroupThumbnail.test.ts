import * as RequestModule from "@esri/arcgis-rest-request";
import { deleteGroupThumbnail } from "../../src/groups/deleteGroupThumbnail";

describe("deleteGroupThumbnail:", () => {
  it("makes request to API", async () => {
    const spy = spyOn(RequestModule, "request").and.returnValue(
      Promise.resolve({})
    );
    await deleteGroupThumbnail("3ef", {
      authentication: {},
      portal: "https://www.arcgis.com/sharing/rest",
    } as any);
    expect(spy.calls.count()).toBe(1);
    const args = spy.calls.argsFor(0)[0];

    expect(args).toBe(
      "https://www.arcgis.com/sharing/rest/community/groups/3ef/deleteThumbnail"
    );
  });
});
