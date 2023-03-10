import { IArcGISContext } from "../../src/ArcGISContext";
import { fetchHubEntity } from "../../src/core/fetchHubEntity";
import { HubEntityType } from "../../src/core/types/HubEntityType";
import { getProp } from "../../src/objects/get-prop";

describe("fetchHubEntity:", () => {
  it("throws for page", async () => {
    try {
      await fetchHubEntity("page", "123", {} as any);
    } catch (e) {
      expect(getProp(e, "message")).toBe("FetchPage not implemented");
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
      require("../../src/projects/fetch"),
      "fetchProject"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("project", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/sites/HubSites"),
      "fetchSite"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("site", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches initiative", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/initiatives/HubInitiatives"),
      "fetchInitiative"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("initiative", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches content", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/content/fetch"),
      "fetchHubContent"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("content", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
});
