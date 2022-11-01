import * as portalModule from "@esri/arcgis-rest-portal";
import { clearItemFeaturedImage } from "../../src/items/clear-item-featured-image";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("clearItemFeaturedImage", () => {
  it("calls removeItemResource with expected params", async () => {
    const removeSpy = spyOn(
      portalModule,
      "removeItemResource"
    ).and.returnValues(Promise.resolve({ success: true }));
    await clearItemFeaturedImage("3ef", "bob", "featuredImage.png", {
      authentication: MOCK_AUTH,
    });
    expect(removeSpy.calls.count()).toBe(1);
    const args = removeSpy.calls.argsFor(0)[0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if remove fails", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await clearItemFeaturedImage("3ef", "bob", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if remove rejects with error", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    try {
      await clearItemFeaturedImage("3ef", "bob", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if remove rejects", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.reject("something else")
    );
    try {
      await clearItemFeaturedImage("3ef", "bob", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
});
