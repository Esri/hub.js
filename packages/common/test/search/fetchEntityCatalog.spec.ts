import { vi, afterEach } from "vitest";

// Make @esri/arcgis-rest-portal spyable by merging the original exports and
// overriding only the functions we need to mock/spy on.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...(mod as any),
    getItem: vi.fn(),
  };
});

import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { fetchEntityCatalog } from "../../src/search/fetchEntityCatalog";
import * as SiteModule from "../../src/sites/HubSites";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as DomainModule from "../../src/sites/domains/lookup-domain";
import * as FetchEntityModule from "../../src/core/fetchHubEntity";
import * as FetchEventModule from "../../src/events/fetch";

import { createMockContext, MOCK_AUTH } from "../mocks/mock-auth";
import { IArcGISContext } from "../../src/types/IArcGISContext";

describe("fetchEntityCatalog:", () => {
  let context: IArcGISContext;
  beforeEach(async () => {
    // Use deterministic mock context instead of creating a real ArcGISContextManager
    context = createMockContext({
      authentication: MOCK_AUTH,
      currentUser: { username: "casey" } as unknown as IUser,
      portalSelf: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    let lookupDomainSpy: ReturnType<typeof vi.spyOn>;
    let getSiteSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      // spies
      lookupDomainSpy = vi
        .spyOn(DomainModule as any, "lookupDomain")
        .mockImplementation(() => Promise.resolve({ siteId: "3ef" }));

      getSiteSpy = vi
        .spyOn(SiteModule as any, "fetchSite")
        .mockImplementation(() =>
          Promise.resolve({
            catalog: { schemaVersion: 9999 },
            otherCat: { schemaVersion: 8888 },
          })
        );
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
      expect(lookupDomainSpy.mock.calls.length).toBeGreaterThan(0);
      expect(getSiteSpy.mock.calls.length).toBeGreaterThan(0);
      // verify args on the calls
      expect(lookupDomainSpy.mock.calls[0][0]).toBe("myserver.com");
      expect(getSiteSpy.mock.calls[0][0]).toBe("3ef");
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
      expect(lookupDomainSpy.mock.calls.length).toBeGreaterThan(0);
      expect(getSiteSpy.mock.calls.length).toBeGreaterThan(0);
      // verify args on the calls
      expect(lookupDomainSpy.mock.calls[0][0]).toBe(
        "myserver.com/portal/apps/sites/#/my-site-name"
      );
      expect(getSiteSpy.mock.calls[0][0]).toBe("3ef");
    });
  });

  describe("works with an item id:", () => {
    let getItemSpy: ReturnType<typeof vi.spyOn>;
    let fetchEntitySpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      getItemSpy = vi
        .spyOn(PortalModule as any, "getItem")
        .mockResolvedValue({ type: "Hub Project" } as any);

      fetchEntitySpy = vi
        .spyOn(FetchEntityModule as any, "fetchHubEntity")
        .mockImplementation(() =>
          Promise.resolve({
            catalog: { schemaVersion: 9999 },
            otherCat: { schemaVersion: 8888 },
          })
        );
    });

    it("fetches item if entity type not passed", async () => {
      // call
      const response = await fetchEntityCatalog(
        "aa9e680b6b524611be96842ea4ff482f",
        context
      );
      // expect
      expect(getItemSpy.mock.calls.length).toBeGreaterThan(0);
      expect(fetchEntitySpy.mock.calls.length).toBeGreaterThan(0);

      // verify the response
      expect(response.schemaVersion).toBe(9999);

      // verify args on the calls
      expect(getItemSpy.mock.calls[0][0]).toBe(
        "aa9e680b6b524611be96842ea4ff482f"
      );
      expect(fetchEntitySpy.mock.calls[0][0]).toBe("project");
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
      expect(getItemSpy.mock.calls.length).toBe(0);
      expect(fetchEntitySpy.mock.calls.length).toBeGreaterThan(0);

      // verify the response
      expect(response.schemaVersion).toBe(8888);

      // verify args on the calls
      expect(fetchEntitySpy.mock.calls[0][0]).toBe("site");
    });
  });

  describe("works with an event id:", () => {
    let fetchEventSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      fetchEventSpy = vi
        .spyOn(FetchEventModule as any, "fetchEvent")
        .mockImplementation(() =>
          Promise.resolve({
            catalog: { schemaVersion: 9999 },
            otherCat: { schemaVersion: 8888 },
          })
        );
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
      expect(fetchEventSpy.mock.calls.length).toBeGreaterThan(0);
      // verify args on the calls
      expect(fetchEventSpy.mock.calls[0][0]).toBe("cm2w2oz2x000109k2dto6cm47");
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
      expect(fetchEventSpy.mock.calls.length).toBeGreaterThan(0);
      // verify args on the calls
      expect(fetchEventSpy.mock.calls[0][0]).toBe("cm2w2oz2x000109k2dto6cm47");
    });
  });
});
