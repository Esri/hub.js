import { fetchHubEntity } from "../../src/core/fetchHubEntity";
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
    const spy = spyOn(fetchProjectModule, "fetchProject").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("project", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches site", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(hubSitesModule, "fetchSite").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("site", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches organization", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(orgFetchModule, "fetchOrganization").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("organization", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches channel", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(channelsFetchModule, "fetchHubChannel").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("channel", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx);
  });
  it("fetches initiative", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(hubInitiativesModule, "fetchInitiative").and.returnValue(
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
      discussionsFetchModule,
      "fetchDiscussion"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("discussion", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches content", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(hubContentFetchModule, "fetchHubContent").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("content", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx.hubRequestOptions);
  });
  it("fetches template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(templatesModule, "fetchTemplate").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("template", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches page", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(hubPagesModule, "fetchPage").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("page", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches group", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(hubGroupsModule, "fetchHubGroup").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("group", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", ctx.hubRequestOptions);
  });
  it("fetches initiative template", async () => {
    const ctx = {
      requestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(
      initiativeTemplatesFetchModule,
      "fetchInitiativeTemplate"
    ).and.returnValue(Promise.resolve({}));
    await fetchHubEntity("initiativeTemplate", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches event", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(eventsFetchModule, "fetchEvent").and.returnValue(
      Promise.resolve({})
    );
    await fetchHubEntity("event", "123", ctx);
    expect(spy).toHaveBeenCalledWith("123", "fakeRequestOptions");
  });
  it("fetches user", async () => {
    const ctx = {
      hubRequestOptions: "fakeRequestOptions",
    } as unknown as IArcGISContext;
    const spy = spyOn(hubUsersModule, "fetchHubUser").and.returnValue(
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
    const spy = spyOn(hubUsersModule, "convertUserToHubUser").and.returnValue(
      {}
    );
    await fetchHubEntity("user", "self", ctx);
    expect(spy).toHaveBeenCalledWith(ctx.currentUser);
  });
});
