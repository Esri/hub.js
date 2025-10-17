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
import { vi } from "vitest";
import { HubEntityType } from "../../src/core/types/HubEntityType";
import { HubEntity } from "../../src/core/types/HubEntity";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import { updateHubEntity } from "../../src/core/updateHubEntity";

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
    const spy = vi
      .spyOn(editProjectsModule as any, "updateProject")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("project", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(sitesModule as any, "updateSite")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("site", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates initiative", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(initiativesModule as any, "updateInitiative")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("initiative", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates discussion", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(editDiscussionsModule as any, "updateDiscussion")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("discussion", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates content", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(editContentModule as any, "updateContent")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("content", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates template", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(editTemplatesModule as any, "updateTemplate")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("template", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates page", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(pagesModule as any, "updatePage")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("page", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates initiative template", async () => {
    const ctx = {
      userRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(editInitiativeTemplateModule as any, "updateInitiativeTemplate")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("initiativeTemplate", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  it("updates group", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(groupsModule as any, "updateHubGroup")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("group", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, ctx);
  });
  it("updates event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(editEventsModule as any, "updateHubEvent")
      .mockResolvedValue(Promise.resolve({}));
    await updateHubEntity("event", {} as HubEntity, ctx);
    expect(spy).toHaveBeenCalledWith({}, "fakeRequestOptions");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
});
