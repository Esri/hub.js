import {
  IArcGISContext,
  HubEntityType,
  HubEntity,
  updateHubEntity,
} from "../../src";
import * as editProjectsModule from "../../src/projects/edit";
import * as sitesModule from "../../src/sites/HubSites";
import * as initiativesModule from "../../src/initiatives/HubInitiatives";
import * as editDiscussionsModule from "../../src/discussions/edit";
import * as editContentModule from "../../src/content/edit";
import * as editTemplatesModule from "../../src/templates/edit";
import * as pagesModule from "../../src/pages/HubPages";
import * as editInitiativeTemplateModule from "../../src/initiative-templates/edit";
import * as groupsModule from "../../src/groups/HubGroups";
import * as editEventsModule from "../../src/events/edit";

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
    const spy = spyOn(editProjectsModule, "updateProject").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("project", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(sitesModule, "updateSite").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("site", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates initiative", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(initiativesModule, "updateInitiative").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("initiative", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates discussion", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      editDiscussionsModule,
      "updateDiscussion"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("discussion", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates content", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(editContentModule, "updateContent").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("content", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates template", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(editTemplatesModule, "updateTemplate").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("template", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates page", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(pagesModule, "updatePage").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("page", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates initiative template", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      editInitiativeTemplateModule,
      "updateInitiativeTemplate"
    ).and.returnValue(Promise.resolve({}));
    await updateHubEntity("initiativeTemplate", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates group", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(groupsModule, "updateHubGroup").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("group", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, ctx);
  });
  it("updates event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(editEventsModule, "updateHubEvent").and.returnValue(
      Promise.resolve({})
    );
    await updateHubEntity("event", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
});
