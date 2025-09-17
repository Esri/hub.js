import type { IArcGISContext, HubEntityType } from "../../src";
import { fetchHubEntity } from "../../src/core/fetchHubEntity";
import * as fetchProjectsModule from "../../src/projects/fetch";
import * as sitesModule from "../../src/sites/HubSites";
import * as fetchOrganizationModule from "../../src/org/fetch";
import * as fetchChannelsModule from "../../src/channels/fetch";
import * as initiativesModule from "../../src/initiatives/HubInitiatives";
import * as fetchDiscussionsModule from "../../src/discussions/fetch";
import * as fetchContentModule from "../../src/content/fetchHubContent";
import * as fetchTemplatesModule from "../../src/templates/fetch";
import * as pagesModule from "../../src/pages/HubPages";
import * as groupsModule from "../../src/groups/HubGroups";
import * as fetchInitiativeTemplateModule from "../../src/initiative-templates/fetch";
import * as fetchEventsModule from "../../src/events/fetch";
import * as fetchHubUserModule from "../../src/users";
import * as userModule from "../../src/users/HubUsers";

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
    const spy = spyOn(fetchProjectsModule, "fetchProject").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("project", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(sitesModule, "fetchSite").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("site", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches organization", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      fetchOrganizationModule,
      "fetchOrganization"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("organization", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches channel", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(fetchChannelsModule, "fetchHubChannel").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("channel", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx);
  });
  it("fetches initiative", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(initiativesModule, "fetchInitiative").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("initiative", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches discussion", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      fetchDiscussionsModule,
      "fetchDiscussion"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("discussion", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches content", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(fetchContentModule, "fetchHubContent").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("content", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx);
  });
  it("fetches template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(fetchTemplatesModule, "fetchTemplate").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("template", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches page", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(pagesModule, "fetchPage").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("page", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches group", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(groupsModule, "fetchHubGroup").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("group", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx);
  });
  it("fetches initiative template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      fetchInitiativeTemplateModule,
      "fetchInitiativeTemplate"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("initiativeTemplate", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(fetchEventsModule, "fetchEvent").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("event", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches user", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(fetchHubUserModule, "fetchHubUser").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("user", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", {
      hubRequestOptions: "fakeRequestOptions",
    });
  });
  it("self returns the current user", async () => {
    const ctx = {
      currentUser: {},
    } as IArcGISContext;
    const spy = spyOn(userModule, "convertUserToHubUser").and.returnValue({});
    await fetchHubEntity("user", "self", ctx);
    expect(spy).toHaveBeenCalledWith(ctx.currentUser);
  });
});
