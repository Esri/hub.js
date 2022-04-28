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
      const file = new Blob(["foo"], { type: "csv" });
      const result = _prepareUploadRequests(file, "test", "123abc", 1, ro);
      expect(result.length).toBe(3);
      expect(result[0].owner).toBe("test");
      expect(result[0].id).toBe("123abc");
      expect(result[0].partNum).toBe(3);
    });
  }
});
