import { setGroupThumbnail } from "../../src/groups/setGroupThumbnail";
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("setGroupThumbnail:", () => {
  it("calls updateGroup with expected params", async () => {
    const updateSpy = spyOn(portalModule, "updateGroup").and.returnValues(
      Promise.resolve({ success: true })
    );
    await setGroupThumbnail(
      "3ef",
      "fakeFile",
      "mything.png",
      {
        authentication: MOCK_AUTH,
      },
      "fakeOwner"
    );
    expect(updateSpy.calls.count()).toBe(1);
    const args = updateSpy.calls.argsFor(0)[0];
    expect(args.group.id).toBe("3ef");
    expect(args.params.thumbnail).toEqual("fakeFile");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if update fails", async () => {
    spyOn(portalModule, "updateGroup").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await setGroupThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        },
        "fakeOwner"
      );
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("throws hub error if update rejects with error", async () => {
    spyOn(portalModule, "updateGroup").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    try {
      await setGroupThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        },
        "fakeOwner"
      );
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("throws hub error if update rejects", async () => {
    spyOn(portalModule, "updateGroup").and.returnValues(
      Promise.reject("something else")
    );
    try {
      await setGroupThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        },
        "fakeOwner"
      );
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
});
