import * as portal from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { _prepareUploadRequests } from "../../src/items/_internal/_prepare-upload-requests";
describe("_prepareUploadRequests", () => {
  if (typeof Blob !== "undefined") {
    it("properly slices up a file", async () => {
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;
      spyOn(portal, "addItemPart").and.callFake(async () => {
        return Promise.resolve({ status: "Success" });
      });
      const file = new Blob(["foo"], { type: "csv" });
      const result = _prepareUploadRequests(file, "test", "123abc", 1, ro);
      expect(result.length).toBe(3);
      await result[0]();
      expect(portal.addItemPart).toHaveBeenCalledTimes(1);
    });
  }
});
