import { IArcGISContext } from "../../src/ArcGISContext";
import { fetchHubEntity } from "../../src/core/fetchHubEntity";
import { HubEntityType } from "../../src/core/types/HubEntityType";

describe("fetchHubEntity:", () => {
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
  it("fetches discussion", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/discussions/fetch"),
      "fetchDiscussion"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("discussion", "123", ctx);
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
  it("fetches page", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/pages/HubPages"),
      "fetchPage"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("page", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
});
