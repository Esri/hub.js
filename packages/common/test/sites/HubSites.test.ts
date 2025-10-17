import * as portalModule from "@esri/arcgis-rest-portal";
import * as FetchEnrichments from "../../src/items/_enrichments";
import {
  MOCK_AUTH,
  MOCK_ENTERPRISE_REQOPTS,
  MOCK_HUB_REQOPTS,
  MOCK_NOAUTH_HUB_REQOPTS,
} from "../mocks/mock-auth";
import * as slugUtils from "../../src/items/slugs";
import { SearchCategories } from "../../src/sites/_internal/types";
import { IHubSite } from "../../src/core/types/IHubSite";
import { IHubRequestOptions, IModel } from "../../src/hub-types";
import * as fetchSiteModelModule from "../../src/sites/fetchSiteModel";
import * as fetchModelFromItemModule from "../../src/models/fetchModelFromItem";
import * as removeDomainsBySiteIdModule from "../../src/sites/domains/remove-domains-by-site-id";
import * as handleDomainChangesModule from "../../src/sites/_internal/handleDomainChanges";
import * as updateModelModule from "../../src/models/updateModel";
import * as createModelModule from "../../src/models/createModel";
import * as ensureUniqueDomainNameModule from "../../src/sites/domains/ensure-unique-domain-name";
import * as ensureUniqueEntitySlugModule from "../../src/items/_internal/ensureUniqueEntitySlug";
import * as addSiteDomainsModule from "../../src/sites/domains/addSiteDomains";
import {
  convertItemToSite,
  createSite,
  deleteSite,
  enrichSiteSearchResult,
  fetchSite,
  updateSite,
} from "../../src/sites/HubSites";
import { cloneObject } from "../../src/util";
import { setProp } from "../../src/objects/set-prop";
import { IHubCollection } from "../../src/search/types/IHubCatalog";

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
  typeKeywords: [],
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
  properties: {},
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
    searchCategories: [{ key: "components.search.category_tabs.data" }],
  },
};
const SITE_MODEL = {
  item: SITE_ITEM,
  data: SITE_DATA,
} as IModel;

const SITE: IHubSite = {
  itemControl: "edit",
  id: GUID,
  name: "Fake Site",
  tags: ["Transportation"],
  description: "Some longer description",
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
} as unknown as IHubSite;

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
        fetchSiteModelModule,
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
      spyOn(fetchSiteModelModule, "fetchSiteModel").and.returnValue(
        Promise.resolve(SITE_MODEL)
      );

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
      spyOn(fetchSiteModelModule, "fetchSiteModel").and.returnValue(
        Promise.resolve(borkedSite)
      );

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
        fetchSiteModelModule,
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
        fetchModelFromItemModule,
        "fetchModelFromItem"
      ).and.returnValue(Promise.resolve(SITE_MODEL));
      const site = await convertItemToSite(SITE_ITEM, MOCK_HUB_REQOPTS);
      expect(fetchModelSpy.calls.count()).toBe(1);
      expect(site.name).toBe(SITE_ITEM.title);
    });
    it("fetches model and converts to site without auth", async () => {
      const fetchModelSpy = spyOn(
        fetchModelFromItemModule,
        "fetchModelFromItem"
      ).and.returnValue(Promise.resolve(SITE_MODEL));
      const site = await convertItemToSite(SITE_ITEM, MOCK_NOAUTH_HUB_REQOPTS);
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
        removeDomainsBySiteIdModule,
        "removeDomainsBySiteId"
      ).and.returnValue(Promise.resolve());

      const result = await deleteSite("3ef", {
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

      const result = await deleteSite("3ef", MOCK_ENTERPRISE_REQOPTS);
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
      spyOn(handleDomainChangesModule, "handleDomainChanges").and.returnValue(
        Promise.resolve()
      );

      updateModelSpy = spyOn(updateModelModule, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );

      // We need to add some extra props to the site_model
      // which will be removed by updateSite
      const SiteModelWithExtraProps = cloneObject(SITE_MODEL);
      setProp(
        "data.values.map.baseMapLayers",
        ["fake"],
        SiteModelWithExtraProps
      );
      setProp("data.values.map.title", "fake", SiteModelWithExtraProps);
      setProp(
        "data.telemetry",
        { fake: "data.telemetry" },
        SiteModelWithExtraProps
      );
      setProp(
        "item.properties.telemetry",
        { fake: "props.telemetry" },
        SiteModelWithExtraProps
      );
      // emulate a site that has slug set
      setProp(
        "item.properties.slug",
        "dcdev-wat-blarg",
        SiteModelWithExtraProps
      );
      setProp(
        "item.typeKeywords",
        ["slug|dcdev-wat-blarg"],
        SiteModelWithExtraProps
      );

      fetchSiteModelSpy = spyOn(
        fetchSiteModelModule,
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SiteModelWithExtraProps));

      spyOn(slugUtils, "getUniqueSlug").and.callFake(({ slug }: any) => {
        return Promise.resolve(slug as string);
      });
    });
    it("removes props", async () => {
      const updatedSite = cloneObject(SITE);
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.data.values.map.baseMapLayers).not.toBeDefined();
      expect(modelToUpdate.data.values.map.basemaps.primary).toBeDefined();
      expect(modelToUpdate.data.values.map.title).not.toBeDefined();
      expect(modelToUpdate.item.properties?.telemetry).not.toBeDefined();
      expect(modelToUpdate.data.values.telemetry).not.toBeDefined();
      // old slug
      expect(modelToUpdate.item.properties?.slug).not.toBeDefined();
      const hasSlugKeyword = (modelToUpdate.item.typeKeywords as string[]).some(
        (kw) => kw.startsWith("slug|")
      );
      expect(hasSlugKeyword).toBe(false);
    });
  });
  describe("updateSite:", () => {
    let domainChangeSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let fetchSiteModelSpy: jasmine.Spy;

    beforeEach(() => {
      domainChangeSpy = spyOn(
        handleDomainChangesModule,
        "handleDomainChanges"
      ).and.returnValue(Promise.resolve());

      updateModelSpy = spyOn(updateModelModule, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );

      fetchSiteModelSpy = spyOn(
        fetchSiteModelModule,
        "fetchSiteModel"
      ).and.returnValue(Promise.resolve(SITE_MODEL));

      spyOn(slugUtils, "getUniqueSlug").and.callFake(({ slug }: any) => {
        return Promise.resolve(slug as string);
      });
    });
    it("updates the backing model", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.name = "Updated Name";
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

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

    it("handles change to subdomain in enterprise", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.subdomain = "updated-subdomain";
      const ro = { ...MOCK_HUB_REQOPTS, isPortal: true };
      const chk = await updateSite(updatedSite, ro);

      expect(chk.id).toBe(GUID);
      expect(chk.subdomain).toBe("updated-subdomain");

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
      const updatedSite = cloneObject(SITE);
      updatedSite.customHostname = updatedHostname;
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

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
    it("if isCatalogV1Enabled, reflects collection changes to searchCategories", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.isCatalogV1Enabled = true;
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
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

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
    it("stores the new catalog in data.catalogv2 and (if isCatalogV1Enabled) converts catalog group changes to the old catalog format ", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.isCatalogV1Enabled = true;
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
      const expectedCatalogV2 = cloneObject(updatedSite.catalog);
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.data.catalog).toEqual({ groups: ["9001"] });
      expect(modelToUpdate.data.catalogV2).toEqual(expectedCatalogV2);
    });

    it("deletes old catalog and search categories if upgraded to the v2 catalog", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.isCatalogV1Enabled = false;
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
      const expectedCatalogV2 = cloneObject(updatedSite.catalog);
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.data.catalog).toBeUndefined();
      expect(modelToUpdate.data.values.searchCategories).toBeUndefined();
      expect(modelToUpdate.data.useCatalogV2).toBe(true);
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
        ensureUniqueDomainNameModule,
        "ensureUniqueDomainName"
      ).and.callFake((subdomain: string) => {
        return subdomain;
      });
      createModelSpy = spyOn(createModelModule, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      updateModelSpy = spyOn(updateModelModule, "updateModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          return Promise.resolve(newModel);
        }
      );
      ensureUniqueEntitySlugSpy = spyOn(
        ensureUniqueEntitySlugModule,
        "ensureUniqueEntitySlug"
      ).and.callFake((site: IHubSite) => {
        return Promise.resolve(site);
      });
    });
    describe("online: ", () => {
      beforeEach(() => {
        addDomainsSpy = spyOn(
          addSiteDomainsModule,
          "addSiteDomains"
        ).and.returnValue(Promise.resolve([{ clientKey: "FAKE_CLIENT_KEY" }]));
      });
      it("works with a sparse IHubSite", async () => {
        const sparseSite: Partial<IHubSite> = {
          name: "my site",
          orgUrlKey: "DCdev", // this is intentionally overwritten by portalself.urlKey
        };

        const chk = await createSite(sparseSite, MOCK_HUB_REQOPTS);

        // sites don't have slugs
        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(0);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        expect(addDomainsSpy.calls.count()).toBe(1);

        const modelToCreate = createModelSpy.calls.argsFor(0)[0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Hub Site Application");
        // orgUrlKey is pulled from portalSelf.urlKey, which is "org"
        expect(modelToCreate.item.properties.slug).toBeUndefined();
        expect(modelToCreate.item.properties.orgUrlKey).toBe("org");

        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.data.values.clientId).toBe("FAKE_CLIENT_KEY");

        expect(chk.name).toBe("my site");
        expect(chk.url).toBe("https://my-site-org.hubqa.arcgis.com");
      });
      it("works with a sparse IHubSite without orgUrlKey", async () => {
        const sparseSite: Partial<IHubSite> = {
          name: "my site",
        };

        const hubRO = cloneObject(MOCK_HUB_REQOPTS);
        // mixed case is intentional
        hubRO.portalSelf.urlKey = "DCdev";

        const chk = await createSite(sparseSite, hubRO);

        // sites don't have slugs
        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(0);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        expect(addDomainsSpy.calls.count()).toBe(1);

        const modelToCreate = createModelSpy.calls.argsFor(0)[0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Hub Site Application");
        expect(modelToCreate.item.properties.slug).toBeUndefined();
        // does not match sparse sight
        expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.data.values.clientId).toBe("FAKE_CLIENT_KEY");

        expect(chk.name).toBe("my site");
        expect(chk.url).toBe("https://my-site-dcdev.hubqa.arcgis.com");
      });
      it("works with a full IHubSite", async () => {
        const site: Partial<IHubSite> = {
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
          orgUrlKey: "DCdev",
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

        const chk = await createSite(site, MOCK_HUB_REQOPTS);

        // sites don't have slugs
        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(0);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        expect(addDomainsSpy.calls.count()).toBe(1);

        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.data.values.clientId).toBe("FAKE_CLIENT_KEY");
        expect(modelToUpdate.data.useCatalogV2).toBe(true);
        expect(modelToUpdate.data.catalogV2).toBeDefined();
        expect(modelToUpdate.data.catalogV2.collections.length).toBe(0);
        expect(modelToUpdate.data.catalog).toBeUndefined();
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
        const sparseSite: Partial<IHubSite> = {
          name: "my site",
          // orgUrlKey: "dcdev", this is undefined in Enterpris
        };

        const chk = await createSite(sparseSite, MOCK_ENTERPRISE_REQOPTS);

        // sites don't have slugs
        expect(ensureUniqueEntitySlugSpy.calls.count()).toBe(0);
        expect(uniqueDomainSpy.calls.count()).toBe(1);
        expect(createModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);

        const modelToCreate = createModelSpy.calls.argsFor(0)[0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Site Application");
        expect(modelToCreate.item.properties.slug).toBeUndefined();
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
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
