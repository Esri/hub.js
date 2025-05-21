import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager, IArcGISContext } from "../../src";
import { fetchEntityCatalog } from "../../src/search/fetchEntityCatalog";
import * as SiteModule from "../../src/sites/HubSites";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as DomainModule from "../../src/sites/domains/lookup-domain";
import * as FetchEntityModule from "../../src/core/fetchHubEntity";
import * as FetchEventModule from "../../src/events/fetch";

import { MOCK_AUTH } from "../mocks/mock-auth";

describe("fetchEntityCatalog:", () => {
  let context: IArcGISContext;
  beforeEach(async () => {
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
    context = authdCtxMgr.context;
  });
  it("throws if identifier is not valid", async () => {
    try {
      await fetchEntityCatalog("not a valid identifier", context);
    } catch (err) {
      const error = err as { name?: string; message?: string };
      expect(error.name).toBe("HubError");
      expect(error.message).toBe("Identifier must be a url, item or event id");
    }
  });

  describe("works with a url:", () => {
    let lookupDomainSpy: jasmine.Spy;
    let getSiteSpy: jasmine.Spy;
    beforeEach(() => {
      // spies
      lookupDomainSpy = spyOn(DomainModule, "lookupDomain").and.callFake(() => {
        return Promise.resolve({ siteId: "3ef" });
      });
      getSiteSpy = spyOn(SiteModule, "fetchSite").and.callFake(() => {
        // We are not verifying that fetchSite applyes catalog schema migrations
        // so we can return a fake catalog
        return Promise.resolve({
          catalog: { schemaVersion: 9999 },
          otherCat: { schemaVersion: 8888 },
        });
      });
    });
    it("looks up domain, fetches site and returns catalog", async () => {
      // call
      const response = await fetchEntityCatalog(
        "https://myserver.com",
        context
      );
      // expect
      // verify the response
      expect(response.schemaVersion).toBe(9999);
      // verify spies were called
      expect(lookupDomainSpy).toHaveBeenCalled();
      expect(getSiteSpy).toHaveBeenCalled();
      // verify args on the calls
      expect(lookupDomainSpy.calls.argsFor(0)[0]).toBe("myserver.com");
      expect(getSiteSpy.calls.argsFor(0)[0]).toBe("3ef");
    });
    it("works enterprise and other props", async () => {
      // call
      const response = await fetchEntityCatalog(
        "https://myserver.com/portal/apps/sites/#/my-site-name",
        context,
        {
          prop: "otherCat",
        }
      );
      // expect
      // verify the response
      expect(response.schemaVersion).toBe(8888);
      // verify spies were called
      expect(lookupDomainSpy).toHaveBeenCalled();
      expect(getSiteSpy).toHaveBeenCalled();
      // verify args on the calls
      expect(lookupDomainSpy.calls.argsFor(0)[0]).toBe(
        "myserver.com/portal/apps/sites/#/my-site-name"
      );
      expect(getSiteSpy.calls.argsFor(0)[0]).toBe("3ef");
    });
  });
  describe("works with an item id:", () => {
    let getItemSpy: jasmine.Spy;
    let fetchEntitySpy: jasmine.Spy;
    beforeEach(() => {
      getItemSpy = spyOn(PortalModule, "getItem").and.callFake(() => {
        return Promise.resolve({ type: "Hub Project" });
      });

      fetchEntitySpy = spyOn(FetchEntityModule, "fetchHubEntity").and.callFake(
        () => {
          return Promise.resolve({
            catalog: { schemaVersion: 9999 },
            otherCat: { schemaVersion: 8888 },
          });
        }
      );
    });

    it("fetches item if entity type not passed", async () => {
      // call
      const response = await fetchEntityCatalog(
        "aa9e680b6b524611be96842ea4ff482f",
        context
      );
      // expect
      expect(getItemSpy).toHaveBeenCalled();
      expect(fetchEntitySpy).toHaveBeenCalled();

      // verify the response
      expect(response.schemaVersion).toBe(9999);

      // verify spies were called
      expect(getItemSpy).toHaveBeenCalled();
      expect(fetchEntitySpy).toHaveBeenCalled();
      // verify args on the calls
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(
        "aa9e680b6b524611be96842ea4ff482f"
      );
      expect(fetchEntitySpy.calls.argsFor(0)[0]).toBe("project");
    });

    it("skips item fetch is entity type passed", async () => {
      // call
      const response = await fetchEntityCatalog(
        "aa9e680b6b524611be96842ea4ff482f",
        context,
        {
          hubEntityType: "site",
          prop: "otherCat",
        }
      );
      // expect
      expect(getItemSpy).not.toHaveBeenCalled();
      expect(fetchEntitySpy).toHaveBeenCalled();

      // verify the response
      expect(response.schemaVersion).toBe(8888);

      // verify args on the calls
      expect(fetchEntitySpy.calls.argsFor(0)[0]).toBe("site");
    });
  });

  describe("works with an event id:", () => {
    let fetchEventSpy: jasmine.Spy;
    beforeEach(() => {
      fetchEventSpy = spyOn(FetchEventModule, "fetchEvent").and.callFake(() => {
        return Promise.resolve({
          catalog: { schemaVersion: 9999 },
          otherCat: { schemaVersion: 8888 },
        });
      });
    });

    it("fetches event and returns catalog", async () => {
      // call
      const response = await fetchEntityCatalog(
        "cm2w2oz2x000109k2dto6cm47",
        context
      );
      // expect
      // verify the response
      expect(response.schemaVersion).toBe(9999);
      // verify spies were called
      expect(fetchEventSpy).toHaveBeenCalled();
      // verify args on the calls
      expect(fetchEventSpy.calls.argsFor(0)[0]).toBe(
        "cm2w2oz2x000109k2dto6cm47"
      );
    });
    it("fetches event and returns other", async () => {
      // call
      const response = await fetchEntityCatalog(
        "cm2w2oz2x000109k2dto6cm47",
        context,
        {
          prop: "otherCat",
        }
      );
      // expect
      // verify the response
      expect(response.schemaVersion).toBe(8888);
      // verify spies were called
      expect(fetchEventSpy).toHaveBeenCalled();
      // verify args on the calls
      expect(fetchEventSpy.calls.argsFor(0)[0]).toBe(
        "cm2w2oz2x000109k2dto6cm47"
      );
    });
  });
});
