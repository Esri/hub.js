import { fetchHubEntity } from "../../src/core/fetchHubEntity";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { HubEntityType } from "../../src/core/types/HubEntityType";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import * as fetchProjectModule from "../../src/projects/fetch";
import * as hubSitesModule from "../../src/sites/HubSites";
import * as orgFetchModule from "../../src/org/fetch";
import * as channelsFetchModule from "../../src/channels/fetch";
import * as hubInitiativesModule from "../../src/initiatives/HubInitiatives";
import * as discussionsFetchModule from "../../src/discussions/fetch";
import * as hubContentFetchModule from "../../src/content/fetchHubContent";
import * as templatesModule from "../../src/templates/fetch";
import * as hubPagesModule from "../../src/pages/HubPages";
import * as hubGroupsModule from "../../src/groups/HubGroups";
import * as initiativeTemplatesFetchModule from "../../src/initiative-templates/fetch";
import * as eventsFetchModule from "../../src/events/fetch";
import * as hubUsersModule from "../../src/users/HubUsers";

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
    const spy = vi
      .spyOn(fetchProjectModule as any, "fetchProject")
      .mockResolvedValue({});
    await fetchHubEntity("project", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(hubSitesModule as any, "fetchSite")
      .mockResolvedValue({});
    await fetchHubEntity("site", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches organization", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(orgFetchModule as any, "fetchOrganization")
      .mockResolvedValue({});
    await fetchHubEntity("organization", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches channel", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(channelsFetchModule as any, "fetchHubChannel")
      .mockResolvedValue({});
    await fetchHubEntity("channel", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx);
  });
  it("fetches initiative", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(hubInitiativesModule as any, "fetchInitiative")
      .mockResolvedValue({});
    await fetchHubEntity("initiative", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches discussion", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(discussionsFetchModule as any, "fetchDiscussion")
      .mockResolvedValue({});
    await fetchHubEntity("discussion", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches content", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(hubContentFetchModule as any, "fetchHubContent")
      .mockResolvedValue({});
    await fetchHubEntity("content", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx.hubRequestOptions);
  });
  it("fetches template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(templatesModule as any, "fetchTemplate")
      .mockResolvedValue({});
    await fetchHubEntity("template", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches page", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(hubPagesModule as any, "fetchPage")
      .mockResolvedValue({});
    await fetchHubEntity("page", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches group", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(hubGroupsModule as any, "fetchHubGroup")
      .mockResolvedValue({});
    await fetchHubEntity("group", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx.hubRequestOptions);
  });
  it("fetches initiative template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(initiativeTemplatesFetchModule as any, "fetchInitiativeTemplate")
      .mockResolvedValue({});
    await fetchHubEntity("initiativeTemplate", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(eventsFetchModule as any, "fetchEvent")
      .mockResolvedValue({});
    await fetchHubEntity("event", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches user", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = vi
      .spyOn(hubUsersModule as any, "fetchHubUser")
      .mockResolvedValue({});
    await fetchHubEntity("user", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", {
      hubRequestOptions: "fakeRequestOptions",
    });
  });
  it("self returns the current user", async () => {
    const ctx = {
      currentUser: {},
    } as IArcGISContext;
    const spy = vi
      .spyOn(hubUsersModule as any, "fetchHubUser")
      .mockResolvedValue({});
    await fetchHubEntity("user", "self", ctx);
    expect(spy).toHaveBeenCalledWith("self", ctx);
  });
});
