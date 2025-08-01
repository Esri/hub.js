/* eslint-disable @typescript-eslint/no-var-requires */
import * as commonModule from "../../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as FetchEnrichments from "../../src/items/_enrichments";
import {
  MOCK_AUTH,
  MOCK_ENTERPRISE_REQOPTS,
  MOCK_HUB_REQOPTS,
  MOCK_NOAUTH_HUB_REQOPTS,
} from "../mocks/mock-auth";
import {
  cloneObject,
  enrichSiteSearchResult,
  fetchSite,
  IHubCollection,
  IHubRequestOptions,
} from "../../src";
import * as slugUtils from "../../src/items/slugs";
import { SearchCategories } from "../../src/sites/_internal/types";

const GUID = "042584cf391c428e995e97eccdebb8f8";
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
  catalog: { groups: ["00c"] },
  values: {
    customHostname: "site-org.hub.arcgis.com",
    defaultHostname: "",
    map: {
      basemaps: {
        primary: {},
      },
    },
  },
};
const SITE_MODEL = {
  item: SITE_ITEM,
  data: SITE_DATA,
} as commonModule.IModel;

const SITE: commonModule.IHubSite = {
  itemControl: "edit",
  id: GUID,
  name: "Fake Site",
  tags: ["Transportation"],
  description: "Some longer description",
  slug: "dcdev-wat-blarg",
  orgUrlKey: "dcdev",
  owner: "dcdev_dude",
  type: "Hub Site Application",
  typeKeywords: [],
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
  legacyCapabilities: [],
  catalog: {
    schemaVersion: 1,
    title: "Default Site Catalog",
    scopes: {
      item: {
        targetEntity: "item",
        filters: [],
      },
      event: {
        targetEntity: "event",
        filters: [],
      },
    },
    collections: [],
  },
  pages: [],
  defaultHostname: "site-org.hub.arcgis.com",
  customHostname: "",
  clientId: "bc7ashcase13as",
  telemetry: {},
  map: {
    basemaps: {
      primary: { updated: true },
    },
  },
  contentViews: {},
  headerSass: "",
  thumbnailUrl: "",
  schemaVersion: 2,
  permissions: [],
  canEdit: true,
  canDelete: false,
} as unknown as commonModule.IHubSite;

const SITE_ITEM_ENRICH: portalModule.IItem = {
  id: "ad5bace94384467b8712309ae8b68bfd",
  owner: "zhen9978",
  created: 1647332678000,
  modified: 1647404575000,
  guid: null,
  name: null,
  title: "314 march update",
  type: "Hub Site Application",
  typeKeywords: [
    "Hub",
    "hubSite",
    "hubSolution",
    "JavaScript",
    "Map",
    "Mapping Site",
    "Online Map",
    "OpenData",
    "Ready To Use",
    "selfConfigured",
    "source-embedded-basic-default-site",
    "Web Map",
    "Registered App",
  ],
  // description: null,
  tags: ["Hub Site"],
  // snippet: null,
  thumbnail: "thumbnail/bar.png",
  // documentation: null,
  extent: [],
  categories: ["category"],
  // spatialReference: null,
  accessInformation: null,
  licenseInfo: null,
  culture: "en-us",
  properties: {
    createdFrom: "basicDefaultSite Solution Template (embedded)",
    schemaVersion: 1.5,
    hasSeenGlobalNav: true,
    collaborationGroupId: "7faa3c339a5f4f6b9e605f7aba2b1593",
    contentGroupId: "19db2e0ea0a14b54bc94a3cf04b93abe",
    parentInitiativeId: "c1d7fe46f84547a6ace8ad2ecd529a72",
    children: [],
    parentId: "embedded-basic-default-site",
  },
  advancedSettings: null,
  url: "https://314-march-update-beijing.hubdev.arcgis.com",
  proxyFilter: null,
  access: "public",
  size: -1,
  subInfo: 0,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 88,
  scoreCompleteness: 16,
  groupDesignations: null,
  contentOrigin: "other",
};

describe("HubSites:", () => {
  describe("fetchSite:", () => {
    it("gets by id, if passed a guid", async () => {
      const fetchSpy = spyOn(
        require("../../src/sites/fetchSiteModel"),
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));

      const chk = await fetchSite(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(fetchSpy.calls.count()).toBe(1);
      expect(fetchSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("applies catalog migration", async () => {
      spyOn(
        require("../../src/sites/fetchSiteModel"),
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));

      const chk = await fetchSite(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.catalog).toBeDefined();
      expect(chk.catalog.schemaVersion).toBeDefined();
    });

    it("applies catalog migration on sites with borked searchCategories", async () => {
      const borkedSearchCategories = [
        { key: "non-existant-search-category" },
        { key: "components.search.category_tabs.data" },
        { key: "components.search.category_tabs.sites" },
        { key: "components.search.category_tabs.documents" },
        { key: "components.search.category_tabs.apps_and_maps" },
      ];
      const borkedSite = cloneObject(SITE_MODEL);
      borkedSite.data.values.searchCategories = borkedSearchCategories;
      spyOn(
        require("../../src/sites/fetchSiteModel"),
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(borkedSite));

      const chk = await fetchSite(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.catalog).toBeDefined();
      expect(chk.catalog.schemaVersion).toBeDefined();
      const collections = chk.catalog.collections;
      expect(collections?.length).toBe(4);
    });

    it("gets by domain, without auth", async () => {
      const fetchSpy = spyOn(
        require("../../src/sites/fetchSiteModel"),
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));

      const ro: IHubRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchSite("mysite.com", ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.thumbnailUrl).toBe(
        `https://gis.myserver.com/portal/sharing/rest/content/items/${GUID}/info/vader.png`
      );
      expect(fetchSpy.calls.count()).toBe(1);
      expect(fetchSpy.calls.argsFor(0)[0]).toBe("mysite.com");
    });
  });
  describe("converItemToSite:", () => {
    it("fetches model and converts to site with auth", async () => {
      const fetchModelSpy = spyOn(
        require("../../src/models"),
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
        require("../../src/models"),
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

  describe("deleteSite:", () => {
    it("removes item and domains in AGO", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const removeDomainSpy = spyOn(
        require("../../src/sites/domains/remove-domains-by-site-id"),
        "removeDomainsBySiteId"
      ).and.returnValue(Promise.resolve());

      const result = await commonModule.deleteSite("3ef", {
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

      const result = await commonModule.deleteSite(
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
  describe("updateSite removes properties:", () => {
    let updateModelSpy: jasmine.Spy;
    let fetchSiteModelSpy: jasmine.Spy;

    beforeEach(() => {
      spyOn(
        require("../../src/sites/_internal"),
        "handleDomainChanges"
      ).and.returnValue(Promise.resolve());

      updateModelSpy = spyOn(
        require("../../src/models"),
        "updateModel"
      ).and.callFake((m: commonModule.IModel) => {
        return Promise.resolve(m);
      });

      // We need to add some extra props to the site_model
      // which will be removed by updateSite
      const SiteModelWithExtraProps = commonModule.cloneObject(SITE_MODEL);
      commonModule.setProp(
        "data.values.map.baseMapLayers",
        ["fake"],
        SiteModelWithExtraProps
      );
      commonModule.setProp(
        "data.values.map.title",
        "fake",
        SiteModelWithExtraProps
      );
      commonModule.setProp(
        "data.telemetry",
        { fake: "data.telemetry" },
        SiteModelWithExtraProps
      );
      commonModule.setProp(
        "item.properties.telemetry",
        { fake: "props.telemetry" },
        SiteModelWithExtraProps
      );

      fetchSiteModelSpy = spyOn(
        require("../../src/sites/fetchSiteModel"),
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SiteModelWithExtraProps));

      spyOn(slugUtils, "getUniqueSlug").and.callFake(({ slug }: any) => {
        return Promise.resolve(slug as string);
      });
    });
    it("removes props", async () => {
      const updatedSite = commonModule.cloneObject(SITE);
      const chk = await commonModule.updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.data.values.map.baseMapLayers).not.toBeDefined();
      expect(modelToUpdate.data.values.map.basemaps.primary).toBeDefined();
      expect(modelToUpdate.data.values.map.title).not.toBeDefined();
      expect(modelToUpdate.item.properties?.telemetry).not.toBeDefined();
      expect(modelToUpdate.data.values.telemetry).not.toBeDefined();
    });
  });
  describe("updateSite:", () => {
    let domainChangeSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let fetchSiteModelSpy: jasmine.Spy;

    beforeEach(() => {
      domainChangeSpy = spyOn(
        require("../../src/sites/_internal"),
        "handleDomainChanges"
      ).and.returnValue(Promise.resolve());

      updateModelSpy = spyOn(
        require("../../src/models"),
        "updateModel"
      ).and.callFake((m: commonModule.IModel) => {
        return Promise.resolve(m);
      });

      fetchSiteModelSpy = spyOn(
        require("../../src/sites/fetchSiteModel"),
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));

      spyOn(slugUtils, "getUniqueSlug").and.callFake(({ slug }: any) => {
        return Promise.resolve(slug as string);
      });
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

      expect(fetchSiteModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.title).toBe(updatedSite.name);
    });

    it("handles change to slug in enterprise", async () => {
      const updatedSite = commonModule.cloneObject(SITE);
      updatedSite.slug = "updated-slug";
      const ro = { ...MOCK_HUB_REQOPTS, isPortal: true };
      const chk = await commonModule.updateSite(updatedSite, ro);

      expect(chk.id).toBe(GUID);
      expect(chk.subdomain).toBe("updated-slug");

      // should not have made add/remove domain calls
      expect(domainChangeSpy.calls.count()).toBe(0);

      expect(fetchSiteModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.typeKeywords).toContain(
        `hubsubdomain|${updatedSite.subdomain}`.toLowerCase()
      );
    });

    it("updates domain configurations", async () => {
      const updatedHostname = "my-cool-hostname.dev";
      const updatedSite = commonModule.cloneObject(SITE);
      updatedSite.customHostname = updatedHostname;
      const chk = await commonModule.updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(chk.customHostname).toBe(updatedHostname);

      expect(domainChangeSpy.calls.count()).toBe(1);

      const domainChangeArg0 = domainChangeSpy.calls.argsFor(0)[0];
      const domainChangeArg1 = domainChangeSpy.calls.argsFor(0)[1];
      expect(domainChangeArg0.data.values.customHostname).toEqual(
        updatedHostname
      );
      expect(domainChangeArg1).toEqual(SITE_MODEL);

      expect(fetchSiteModelSpy.calls.count()).toBe(1);
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
      expect(modelToUpdate.item.properties.slug).toBe("dcdev|some-new-slug");
    });
    it("reflects collection changes to searchCategories", async () => {
      const updatedSite = commonModule.cloneObject(SITE);
      updatedSite.catalog.collections = [
        {
          label: "My Datasets",
          key: "dataset",
          targetEntity: "item",
          scope: {
            targetEntity: "item",
            collection: "dataset",
            filters: [],
          },
          displayConfig: {
            hidden: true,
          },
        } as IHubCollection,
      ];
      const chk = await commonModule.updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.data.values.searchCategories).toEqual([
        {
          overrideText: "My Datasets",
          key: SearchCategories.DATA,
          hidden: true,
          queryParams: {
            collection: "Dataset",
          },
        },
      ]);
    });
    it("converts catalog group changes to the old catalog format and stores the new catalog in data.catalogv2", async () => {
      const updatedSite = commonModule.cloneObject(SITE);
      updatedSite.catalog.scopes.item.filters = [
        {
          predicates: [
            {
              group: ["9001"],
            },
          ],
        },
      ];
      updatedSite.catalog.scopes.event.filters = [
        {
          predicates: [
            {
              group: ["1006"],
            },
          ],
        },
      ];
      const expectedCatalogV2 = commonModule.cloneObject(updatedSite.catalog);
      const chk = await commonModule.updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.data.catalog).toEqual({ groups: ["9001"] });
      expect(modelToUpdate.data.catalogV2).toEqual(expectedCatalogV2);
    });
  });
  describe("createSite:", () => {
    let uniqueDomainSpy: jasmine.Spy;
    let createModelSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let ensureUniqueEntitySlugSpy: jasmine.Spy;

    let addDomainsSpy: jasmine.Spy;
    beforeEach(() => {
      uniqueDomainSpy = spyOn(
        require("../../src/sites/domains/ensure-unique-domain-name"),
        "ensureUniqueDomainName"
      ).and.callFake((subdomain: string) => {
        return subdomain;
      });
      createModelSpy = spyOn(
        require("../../src/models"),
        "createModel"
      ).and.callFake((m: commonModule.IModel) => {
        const newModel = commonModule.cloneObject(m);
        newModel.item.id = GUID;
        return Promise.resolve(newModel);
      });
      updateModelSpy = spyOn(
        require("../../src/models"),
        "updateModel"
      ).and.callFake((m: commonModule.IModel) => {
        const newModel = commonModule.cloneObject(m);
        return Promise.resolve(newModel);
      });
      ensureUniqueEntitySlugSpy = spyOn(
        require("../../src/items/_internal/ensureUniqueEntitySlug"),
        "ensureUniqueEntitySlug"
      ).and.callFake((site: commonModule.IHubSite) => {
        return Promise.resolve(site);
      });
    });
    describe("online: ", () => {
      beforeEach(() => {
        addDomainsSpy = spyOn(
          require("../../src/sites/domains/addSiteDomains"),
          "addSiteDomains"
        ).and.returnValue(Promise.resolve([{ clientKey: "FAKE_CLIENT_KEY" }]));
      });
      it("works with a sparse IHubSite", async () => {
        const sparseSite: Partial<commonModule.IHubSite> = {
          name: "my site",
          orgUrlKey: "dcdev",
        };

        const chk = await commonModule.createSite(sparseSite, MOCK_HUB_REQOPTS);

        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(1);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        expect(addDomainsSpy.calls.count()).toBe(1);

        const modelToCreate = createModelSpy.calls.argsFor(0)[0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Hub Site Application");
        expect(modelToCreate.item.properties.slug).toBe("dcdev|my-site");
        expect(modelToCreate.item.properties.orgUrlKey).toBe("org");
        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.data.values.clientId).toBe("FAKE_CLIENT_KEY");

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
          catalog: {
            schemaVersion: 1,
            title: "Default Site Catalog",
            scopes: {
              item: {
                targetEntity: "item",
                filters: [
                  {
                    predicates: [
                      {
                        group: ["9001"],
                      },
                    ],
                  },
                ],
              },
            },
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

        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(1);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        expect(addDomainsSpy.calls.count()).toBe(1);

        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.data.values.clientId).toBe("FAKE_CLIENT_KEY");
        expect(modelToUpdate.data.catalog.groups).toContain("9001");
        expect(chk.name).toBe("Special Site");
        expect(chk.url).toBe("https://site.myorg.com");
        expect(chk.culture).toBe("fr-ca");
        expect(chk.theme).toEqual({ fake: "theme" });
        expect(chk.defaultExtent.xmax).toBe(10);
        expect(chk.map.basemaps.primary).toEqual({ fake: "basemap" });
      });
    });
    describe("portal:", () => {
      it("works in portal", async () => {
        const sparseSite: Partial<commonModule.IHubSite> = {
          name: "my site",
          // orgUrlKey: "dcdev", this is undefined in Enterpris
        };

        const chk = await commonModule.createSite(
          sparseSite,
          MOCK_ENTERPRISE_REQOPTS
        );

        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(1);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        const modelToCreate = createModelSpy.calls.argsFor(0)[0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Site Application");
        expect(modelToCreate.item.properties.slug).toBe("my-site");
        expect(modelToCreate.item.properties.orgUrlKey).toEqual("");
        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.data.values.clientId).toBe("arcgisonline");
        expect(chk.url).toBe(
          "https://my-server.com/portal/apps/sites/#/my-site"
        );
        expect(chk.typeKeywords).toContain(`hubsubdomain|${chk.subdomain}`);
        expect(chk.subdomain).toBe(`my-site`);
      });
    });
  });
  describe("enrichments:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchItemEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          data: {
            pages: [{ id: 1 }, { id: 2 }],
          },
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });
    it("converts item to search result", async () => {
      const chk = await enrichSiteSearchResult(
        cloneObject(SITE_ITEM_ENRICH),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const ITM = cloneObject(SITE_ITEM_ENRICH);
      expect(chk.access).toEqual(ITM.access);
      expect(chk.id).toEqual(ITM.id);
      expect(chk.type).toEqual(ITM.type);
      expect(chk.name).toEqual(ITM.title);
      expect(chk.owner).toEqual(ITM.owner);
      expect(chk.summary).toEqual(ITM.description);
      expect(chk.createdDate).toEqual(new Date(ITM.created));
      expect(chk.createdDateSource).toEqual("item.created");
      expect(chk.updatedDate).toEqual(new Date(ITM.modified));
      expect(chk.updatedDateSource).toEqual("item.modified");
      expect(chk.family).toEqual("site");
      expect(chk.tags).toEqual(ITM.tags);
      expect(chk.categories).toEqual(ITM.categories);
      expect(chk.links?.self).toEqual(ITM.url);
      expect(chk.links?.siteRelative).toEqual(`/content/${ITM.id}`);
      expect(chk.links?.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${ITM.thumbnail}`
      );
    });
    it("uses snippet if defined", async () => {
      const itm = cloneObject(SITE_ITEM_ENRICH);
      itm.snippet = "This should be used";
      const chk = await enrichSiteSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });
    it("fetches enrichments", async () => {
      const chk = await enrichSiteSearchResult(
        cloneObject(SITE_ITEM_ENRICH),
        ["data.pages.length AS pageCount"],
        hubRo
      );

      // verify the response
      expect(chk.pageCount).toBe(2);

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(SITE_ITEM_ENRICH);
      expect(enrichments).toEqual(["data"]);
      expect(ro).toBe(hubRo);
    });
  });
});
