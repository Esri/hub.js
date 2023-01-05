import { IArcGISContext } from "../../src";
import { fetchHubEntity, HubEntityType } from "../../src/core";

describe("fetchHubEntity:", () => {
  it("throws for page", async () => {
    try {
      await fetchHubEntity("page", "123", {} as any);
    } catch (e) {
      expect(e.message).toBe("FetchPage not implemented");
    }
  });
  it("returns undefined for non-hub types", async () => {
    expect(
      await fetchHubEntity("foo" as HubEntityType, "123", {} as any)
    ).toBeUndefined();
  });
  it("fetches project", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/projects"),
      "fetchProject"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("project", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(require("../../src/sites"), "fetchSite").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("site", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches initiative", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/initiatives"),
      "fetchInitiative"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("initiative", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
});
