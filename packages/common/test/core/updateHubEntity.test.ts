import {
  IArcGISContext,
  HubEntityType,
  HubEntity,
  updateHubEntity,
} from "../../src";

describe("updateHubEntity:", () => {
  it("returns undefined for non-hub types", async () => {
    expect(
      await updateHubEntity("foo" as HubEntityType, {} as HubEntity, {} as any)
    ).toBeUndefined();
  });
  it("updates project", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/projects/edit"),
      "updateProject"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("project", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/sites/HubSites"),
      "updateSite"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("site", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates initiative", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/initiatives/HubInitiatives"),
      "updateInitiative"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("initiative", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates discussion", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/discussions/edit"),
      "updateDiscussion"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("discussion", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates content", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/content/edit"),
      "updateContent"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("content", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates template", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/templates/edit"),
      "updateTemplate"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("template", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates page", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/pages/HubPages"),
      "updatePage"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("page", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates initiative template", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/initiative-templates/edit"),
      "updateInitiativeTemplate"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("initiativeTemplate", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates group", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/groups/HubGroups"),
      "updateHubGroup"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("group", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      require("../../src/events/edit"),
      "updateHubEvent"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("event", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
});
