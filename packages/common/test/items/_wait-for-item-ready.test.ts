import * as portal from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { _waitForItemReady } from "../../src/items/_internal/_wait-for-item-ready";

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

describe("_waitForItemReady", () => {
  it("works for success", async (done) => {
    try {
      // auth
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;

      spyOn(portal, "getItemStatus").and.returnValues(
        new Promise((resolve, reject) => {
          resolve({
            status: "progress",
          });
        }),
        new Promise((resolve, reject) => {
          resolve({
            status: "completed",
          });
        })
      );
      await _waitForItemReady("1234abc", ro);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(2);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });
  it("throws an error when an error occurs", async (done) => {
    try {
      // auth
      const ro = {
        authentication: {
          portal: "http://some-org.mapsqaext.arcgis.com",
        },
      } as IUserRequestOptions;

      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.resolve({
          status: "failed",
          statusMessage: "Upload failed",
        });
      });

      await _waitForItemReady("1234abc", ro);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
    } catch (err) {
      expect(err.message).toEqual("Upload failed");
    } finally {
      done();
    }
  });
});
