import type { IArcGISContext, HubEntityType } from "../../src";
import { fetchHubEntity } from "../../src/core/fetchHubEntity";

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
  it("fetches organization", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/org/fetch"),
      "fetchOrganization"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("organization", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches channel", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/channels/fetch"),
      "fetchHubChannel"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("channel", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx);
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
      require("../../src/content/fetchHubContent"),
      "fetchHubContent"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("content", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/templates/fetch"),
      "fetchTemplate"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("template", "123", ctx);
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
  it("fetches group", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/groups/HubGroups"),
      "fetchHubGroup"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("group", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches initiative template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/initiative-templates/fetch"),
      "fetchInitiativeTemplate"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("initiativeTemplate", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/events/fetch"),
      "fetchEvent"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("event", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches user", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/users"),
      "fetchHubUser"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("user", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", {
      hubRequestOptions: "fakeRequestOptions",
    });
  });
  it("self returns the current user", async () => {
    const ctx = {
      currentUser: {},
    } as IArcGISContext;
    const spy = spyOn(
      require("../../src/users/HubUsers"),
      "convertUserToHubUser"
    ).and.returnValue({});
    await fetchHubEntity("user", "self", ctx);
    expect(spy).toHaveBeenCalledWith(ctx.currentUser);
  });
});
