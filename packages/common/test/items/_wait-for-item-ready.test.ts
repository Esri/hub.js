import * as portal from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { _waitForItemReady } from "../../src/items/_internal/_wait-for-item-ready";

describe("_waitForItemReady", () => {
  it("works for success", async () => {
    try {
      // auth
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;

      spyOn(portal, "getItemStatus").and.returnValues(
        Promise.resolve({ status: "partial" }),
        Promise.resolve({ status: "completed" })
      );
      await _waitForItemReady("1234abc", ro, 10);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(2);
    } catch (err) {
      expect(err).toEqual(undefined);
    }
  });
  it("throws an error when an error occurs", async () => {
    try {
      // auth
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;

      spyOn(portal, "getItemStatus").and.returnValues(
        Promise.resolve({ status: "partial" }),
        Promise.resolve({
          status: "failed",
          statusMessage: "Upload failed",
        })
      );

      await _waitForItemReady("1234abc", ro, 10);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(2);
    } catch (err) {
      expect((err as Error).message).toEqual("Upload failed");
    }
  });
});
