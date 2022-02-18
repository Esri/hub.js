import { setItemThumbnail } from "../../src/items/setItemThumbnail";
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("setItemThumbnail:", () => {
  it("calls updateItem with expected params", async () => {
    const updateSpy = spyOn(portalModule, "updateItem").and.returnValues(
      Promise.resolve({ success: true })
    );
    await setItemThumbnail("3ef", "fakeFile", "mything.png", {
      authentication: MOCK_AUTH,
    });
    expect(updateSpy.calls.count()).toBe(1);
    const args = updateSpy.calls.argsFor(0)[0];
    expect(args.item.id).toBe("3ef");
    expect(args.params.thumbnail).toEqual("fakeFile");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if update fails", async () => {
    const updateSpy = spyOn(portalModule, "updateItem").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await setItemThumbnail("3ef", "fakeFile", "mything.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("throws hub error if update rejects with error", async () => {
    const updateSpy = spyOn(portalModule, "updateItem").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    try {
      await setItemThumbnail("3ef", "fakeFile", "mything.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("throws hub error if update rejects", async () => {
    const updateSpy = spyOn(portalModule, "updateItem").and.returnValues(
      Promise.reject("something else")
    );
    try {
      await setItemThumbnail("3ef", "fakeFile", "mything.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
});
