import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { removeResource } from "../../src/resources/removeResource";

describe("removeResource:", () => {
  it("calls removeItemResource with expected params", async () => {
    const addSpy = spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const resp = await removeResource("3ef", "featuredImage.png", "bob", {
      authentication: MOCK_AUTH,
    });
    expect(resp).toEqual({ success: true });
    expect(addSpy.calls.count()).toBe(1);
    const args = addSpy.calls.argsFor(0)[0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("Properly constructs url when a prefix is passed", async () => {
    const addSpy = spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const resp = await removeResource("3ef", "featuredImage.png", "bob", {
      authentication: MOCK_AUTH,
    });
    expect(resp).toEqual({ success: true });
    expect(addSpy.calls.count()).toBe(1);
    const args = addSpy.calls.argsFor(0)[0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if add fails", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await removeResource("3ef", "featuredImage.png", "bob", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with error", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    try {
      await removeResource("3ef", "featuredImage.png", "bob", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with non-error", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.reject("Fake Rejection")
    );
    try {
      await removeResource("3ef", "featuredImage.png", "bob", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
});
