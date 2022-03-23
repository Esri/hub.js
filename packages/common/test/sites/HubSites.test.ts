import * as commonModule from "../../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as siteInternals from "../../src/sites/_internal";
import * as searchEntitiesModule from "../../src/search/_internal/searchContentEntities";
import {
  MOCK_AUTH,
  MOCK_ENTERPRISE_REQOPTS,
  MOCK_HUB_REQOPTS,
  MOCK_NOAUTH_HUB_REQOPTS,
} from "../mocks/mock-auth";

const GUID = "00c77674e43cf4bbd9ecad5189b3f1fdc";
const SITE_ITEM: portalModule.IItem = {
  id: GUID,
  title: "Fake Site",
  description: "fake description",
  snippet: "fake snippet",
  owner: "vader",
  type: "Hub Site Application",
  created: 1643646881000,
  modified: 1643646881000,
  tags: ["Transportation"],
  typeKeywords: ["slug|dcdev-wat-blarg"],
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
  properties: {
    slug: "dcdev-wat-blarg",
  },
};
const SITE_DATA = {
  values: {
    customHostname: "site-org.hub.arcgis.com",
    defaultHostname: "",
  },
};
const SITE_MODEL = {
  item: SITE_ITEM,
  data: SITE_DATA,
} as commonModule.IModel;

const SITE: commonModule.IHubSite = {
  id: GUID,
  name: "Fake Site",
  tags: ["Transportation"],
  description: "Some longer description",
  slug: "dcdev-wat-blarg",
  orgUrlKey: "dcdev",
  owner: "dcdev_dude",
  type: "Hub Site Application",
  createdDate: new Date(1595878748000),
  createdDateSource: "item.created",
  updatedDate: new Date(1595878750000),
  updatedDateSource: "item.modified",
  feeds: {},
  defaultExtent: {
    spatialReference: { wkid: 102100 },
    xmax: -6199999.999999791,
    xmin: -14999999.999999491,
    ymax: 6499999.999999699,
    ymin: 2699999.9999999036,
  },
  layout: { sections: [{}] },
  theme: {},
  subdomain: "site-org",
  capabilities: [],
  catalog: { groups: [] },
  pages: [],
  defaultHostname: "site-org.hub.arcgis.com",
  customHostname: "",
  clientId: "bc7ashcase13as",
  telemetry: {},
  map: {},
  contentViews: {},
  headerSass: "",
  thumbnailUrl: "",
};

describe("HubSites:", () => {
  describe("fetchSite:", () => {
    it("delegates to fetchSiteModel: with auth", async () => {
      const fetchSiteModelSpy = spyOn(
        commonModule,
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));
      const site = await commonModule._fetchSite(GUID, MOCK_HUB_REQOPTS);
      expect(site.name).toBe(SITE_ITEM.title);
      expect(fetchSiteModelSpy.calls.count()).toBe(1);
      expect(fetchSiteModelSpy.calls.argsFor(0)[0]).toBe(GUID);
    });
    it("delegates to fetchSiteModel: without auth", async () => {
      const fetchSiteModelSpy = spyOn(
        commonModule,
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));
      const site = await commonModule._fetchSite(GUID, MOCK_NOAUTH_HUB_REQOPTS);
      expect(site.name).toBe(SITE_ITEM.title);
      expect(fetchSiteModelSpy.calls.count()).toBe(1);
      expect(fetchSiteModelSpy.calls.argsFor(0)[0]).toBe(GUID);
    });
  });
  describe("converItemToSite:", () => {
    it("fetches model and converts to site with auth", async () => {
      const fetchModelSpy = spyOn(
        commonModule,
        "fetchModelFromItem"
      ).and.returnValue(Promise.resolve(SITE_MODEL));
      const site = await commonModule.convertItemToSite(
        SITE_ITEM,
        MOCK_HUB_REQOPTS
      );
      expect(fetchModelSpy.calls.count()).toBe(1);
      expect(site.name).toBe(SITE_ITEM.title);
    });
    it("fetches model and converts to site without auth", async () => {
      const fetchModelSpy = spyOn(
        commonModule,
        "fetchModelFromItem"
      ).and.returnValue(Promise.resolve(SITE_MODEL));
      const site = await commonModule.convertItemToSite(
        SITE_ITEM,
        MOCK_NOAUTH_HUB_REQOPTS
      );
      expect(fetchModelSpy.calls.count()).toBe(1);
      expect(site.name).toBe(SITE_ITEM.title);
    });
  });
  describe("searchSites:", () => {
    it("delegates to searchContentEntities", async () => {
      const searchSpy = spyOn(
        searchEntitiesModule,
        "searchContentEntities"
      ).and.returnValue(Promise.resolve({ results: [] }));
      await commonModule.searchSites(
        { filterType: "content", term: "water" },
        { num: 10 }
      );
      expect(searchSpy.calls.count()).toBe(1);
      const filter = searchSpy.calls.argsFor(
        0
      )[0] as commonModule.Filter<"content">;
      expect(filter.term).toBe("water");
      // should merge the sites scopeing query
      expect(filter.subFilters.length).toBe(2);
    });
  });
  describe("destroySite:", () => {
    it("removes item and domains in AGO", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const removeDomainSpy = spyOn(
        commonModule,
        "removeDomainsBySiteId"
      ).and.returnValue(Promise.resolve());

      const result = await commonModule.destroySite("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
      expect(removeDomainSpy.calls.count()).toBe(1);
      expect(removeDomainSpy.calls.argsFor(0)[0]).toBe("3ef");
    });
    it("removes item in portal", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await commonModule.destroySite(
        "3ef",
        MOCK_ENTERPRISE_REQOPTS
      );
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(
        MOCK_ENTERPRISE_REQOPTS.authentication
      );
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });
  describe("updateSite:", () => {
    let domainChangeSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let getModelSpy: jasmine.Spy;
    beforeEach(() => {
      domainChangeSpy = spyOn(
        siteInternals,
        "handleDomainChanges"
      ).and.returnValue(Promise.resolve());
      updateModelSpy = spyOn(commonModule, "updateModel").and.callFake(
        (m: commonModule.IModel) => {
          return Promise.resolve(m);
        }
      );

      getModelSpy = spyOn(commonModule, "getModel").and.returnValue(
        Promise.resolve(SITE_MODEL)
      );
    });
    it("updates the backing model", async () => {
      const updatedSite = commonModule.cloneObject(SITE);
      updatedSite.name = "Updated Name";
      const chk = await commonModule.updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Updated Name");
      expect(chk.description).toBe("Some longer description");

      expect(domainChangeSpy.calls.count()).toBe(1);

      expect(domainChangeSpy.calls.argsFor(0)[1]).toEqual(SITE_MODEL);

      expect(getModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.title).toBe(updatedSite.name);
    });
    it("handles slug changes", async () => {
      const updatedSite = commonModule.cloneObject(SITE);
      updatedSite.name = "Updated Name";
      updatedSite.slug = "some-new-slug";
      const chk = await commonModule.updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.properties.slug).toBe("some-new-slug");
    });
  });
  describe("createSite:", () => {
    let uniqueDomainSpy: jasmine.Spy;
    let createModelSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let registerAppSpy: jasmine.Spy;
    let addDomainsSpy: jasmine.Spy;
    beforeEach(() => {
      uniqueDomainSpy = spyOn(
        commonModule,
        "ensureUniqueDomainName"
      ).and.callFake((subdomain: string) => {
        return subdomain;
      });
      createModelSpy = spyOn(commonModule, "createModel").and.callFake(
        (m: commonModule.IModel) => {
          const newModel = commonModule.cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      updateModelSpy = spyOn(commonModule, "updateModel").and.callFake(
        (m: commonModule.IModel) => {
          const newModel = commonModule.cloneObject(m);
          return Promise.resolve(newModel);
        }
      );
      registerAppSpy = spyOn(
        commonModule,
        "registerSiteAsApplication"
      ).and.returnValue(Promise.resolve({ client_id: "FAKE_CLIENT_ID" }));

      addDomainsSpy = spyOn(commonModule, "addSiteDomains").and.returnValue(
        Promise.resolve()
      );
    });
    it("works with a sparse IHubSite", async () => {
      const sparseSite: Partial<commonModule.IHubSite> = {
        name: "my site",
        orgUrlKey: "dcdev",
      };

      const chk = await commonModule.createSite(sparseSite, MOCK_HUB_REQOPTS);

      expect(uniqueDomainSpy.calls.count()).toBe(1);
      expect(createModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      expect(registerAppSpy.calls.count()).toBe(1);
      expect(addDomainsSpy.calls.count()).toBe(1);

      const modelToCreate = createModelSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("my site");
      expect(modelToCreate.item.type).toBe("Hub Site Application");
      expect(modelToCreate.item.properties.slug).toBe("dcdev-my-site");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("org");

      expect(chk.name).toBe("my site");
      expect(chk.url).toBe("https://my-site-org.hubqa.arcgis.com");
    });
    it("works with a full IHubSite", async () => {
      const site: Partial<commonModule.IHubSite> = {
        name: "Special Site",
        slug: "CuStOm-Slug",
        subdomain: "custom-subdomain",
        customHostname: "site.myorg.com",
        theme: {
          fake: "theme",
        },
        defaultExtent: {
          xmax: 10,
          ymax: 10,
          xmin: 5,
          ymin: 5,
          spatialReference: {
            wkid: 4326,
          },
        },
        culture: "fr-ca",
        map: {
          basemaps: {
            primary: {
              fake: "basemap",
            },
          },
        },
        orgUrlKey: "dcdev",
        layout: {
          sections: [{}],
          header: {
            component: {
              settings: {
                title: "Title that is already set",
              },
            },
          },
        },
      };

      const chk = await commonModule.createSite(site, MOCK_HUB_REQOPTS);

      expect(uniqueDomainSpy.calls.count()).toBe(1);
      expect(createModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      expect(registerAppSpy.calls.count()).toBe(1);
      expect(addDomainsSpy.calls.count()).toBe(1);

      expect(chk.name).toBe("Special Site");
      expect(chk.url).toBe("https://site.myorg.com");
      expect(chk.culture).toBe("fr-ca");
      expect(chk.theme).toEqual({ fake: "theme" });
      expect(chk.defaultExtent.xmax).toBe(10);
      expect(chk.map.basemaps.primary).toEqual({ fake: "basemap" });
    });
    it("works in portal", async () => {
      const sparseSite: Partial<commonModule.IHubSite> = {
        name: "my site",
        orgUrlKey: "dcdev",
      };

      const chk = await commonModule.createSite(
        sparseSite,
        MOCK_ENTERPRISE_REQOPTS
      );

      expect(uniqueDomainSpy.calls.count()).toBe(1);
      expect(createModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      expect(registerAppSpy.calls.count()).toBe(1);
      expect(addDomainsSpy.calls.count()).toBe(1);

      const modelToCreate = createModelSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("my site");
      expect(modelToCreate.item.type).toBe("Site Application");
      expect(modelToCreate.item.properties.slug).toBe("dcdev-my-site");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("org");
      expect(chk.url).toBe("https://my-server.com/portal/apps/sites/#/my-site");
      expect(chk.typeKeywords).toContain(`hubsubdomain|${chk.subdomain}`);
      expect(chk.subdomain).toBe(`my-site`);
    });
  });
});
