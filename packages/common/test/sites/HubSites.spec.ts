import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

// Make ESM namespace export spyable by merging original exports and overriding
// the specific function we need to spy on. This must be registered before the
// module is imported.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  removeItem: vi.fn(),
}));
import * as portalModule from "@esri/arcgis-rest-portal";
import * as FetchEnrichments from "../../src/items/_enrichments";
import {
  MOCK_AUTH,
  MOCK_ENTERPRISE_REQOPTS,
  MOCK_HUB_REQOPTS,
  MOCK_NOAUTH_HUB_REQOPTS,
} from "../mocks/mock-auth";
import * as slugUtils from "../../src/items/slugs";
import { SearchCategories } from "../../src/sites/_internal/enums/searchCategories";
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
  tags: ["Hub Site"],
  thumbnail: "thumbnail/bar.png",
  extent: [],
  categories: ["category"],
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
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("fetchSite:", () => {
    it("gets by id, if passed a guid", async () => {
      const fetchSpy: any = vi
        .spyOn(fetchSiteModelModule, "fetchSiteModel")
        .mockResolvedValue(SITE_MODEL as any);

      const chk = await fetchSite(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy.mock.calls[0][0]).toBe(GUID);
    });

    it("applies catalog migration", async () => {
      vi.spyOn(fetchSiteModelModule, "fetchSiteModel").mockResolvedValue(
        SITE_MODEL as any
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
      (borkedSite as any).data.values.searchCategories = borkedSearchCategories;
      vi.spyOn(fetchSiteModelModule, "fetchSiteModel").mockResolvedValue(
        borkedSite as any
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
      const fetchSpy: any = vi
        .spyOn(fetchSiteModelModule, "fetchSiteModel")
        .mockResolvedValue(SITE_MODEL as any);

      const ro: IHubRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchSite("mysite.com", ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.thumbnailUrl).toBe(
        `https://gis.myserver.com/portal/sharing/rest/content/items/${GUID}/info/vader.png`
      );
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy.mock.calls[0][0]).toBe("mysite.com");
    });
  });
  describe("converItemToSite:", () => {
    it("fetches model and converts to site with auth", async () => {
      const fetchModelSpy: any = vi
        .spyOn(fetchModelFromItemModule, "fetchModelFromItem")
        .mockResolvedValue(SITE_MODEL as any);
      const site = await convertItemToSite(SITE_ITEM, MOCK_HUB_REQOPTS);
      expect(fetchModelSpy).toHaveBeenCalledTimes(1);
      expect(site.name).toBe(SITE_ITEM.title);
    });
    it("fetches model and converts to site without auth", async () => {
      const fetchModelSpy: any = vi
        .spyOn(fetchModelFromItemModule, "fetchModelFromItem")
        .mockResolvedValue(SITE_MODEL as any);
      const site = await convertItemToSite(SITE_ITEM, MOCK_NOAUTH_HUB_REQOPTS);
      expect(fetchModelSpy).toHaveBeenCalledTimes(1);
      expect(site.name).toBe(SITE_ITEM.title);
    });
  });

  describe("deleteSite:", () => {
    it("removes item and domains in AGO", async () => {
      const removeSpy: any = vi
        .spyOn(portalModule, "removeItem")
        .mockResolvedValue({ success: true } as any);

      const removeDomainSpy: any = vi
        .spyOn(removeDomainsBySiteIdModule, "removeDomainsBySiteId")
        .mockResolvedValue(undefined as any);

      const result = await deleteSite("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy.mock.calls[0][0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.mock.calls[0][0].id).toBe("3ef");
      expect(removeDomainSpy).toHaveBeenCalledTimes(1);
      expect(removeDomainSpy.mock.calls[0][0]).toBe("3ef");
    });
    it("removes item in portal", async () => {
      const removeSpy: any = vi
        .spyOn(portalModule, "removeItem")
        .mockResolvedValue({ success: true } as any);

      const result = await deleteSite("3ef", MOCK_ENTERPRISE_REQOPTS);
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy.mock.calls[0][0].authentication).toBe(
        MOCK_ENTERPRISE_REQOPTS.authentication
      );
      expect(removeSpy.mock.calls[0][0].id).toBe("3ef");
    });
  });
  describe("updateSite removes properties:", () => {
    let updateModelSpy: any;
    let fetchSiteModelSpy: any;

    beforeEach(() => {
      vi.spyOn(
        handleDomainChangesModule,
        "handleDomainChanges"
      ).mockResolvedValue(undefined as any);

      updateModelSpy = vi
        .spyOn(updateModelModule, "updateModel")
        .mockImplementation((m: IModel) => {
          return Promise.resolve(m);
        });

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

      fetchSiteModelSpy = vi
        .spyOn(fetchSiteModelModule, "fetchSiteModel")
        .mockResolvedValue(SiteModelWithExtraProps as any);

      vi.spyOn(slugUtils, "getUniqueSlug").mockImplementation(
        ({ slug }: any) => {
          return Promise.resolve(slug as string);
        }
      );
    });
    it("removes props", async () => {
      const updatedSite = cloneObject(SITE);
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.data.values.map.baseMapLayers).not.toBeDefined();
      expect(modelToUpdate.data.values.map.basemaps.primary).toBeDefined();
      expect(modelToUpdate.data.values.map.title).not.toBeDefined();
      expect(modelToUpdate.item.properties?.telemetry).not.toBeDefined();
      expect(modelToUpdate.data.values.telemetry).not.toBeDefined();
      expect(modelToUpdate.item.properties?.slug).not.toBeDefined();
      const hasSlugKeyword = (modelToUpdate.item.typeKeywords as string[]).some(
        (kw) => kw.startsWith("slug|")
      );
      expect(hasSlugKeyword).toBe(false);
    });
  });
  describe("updateSite:", () => {
    let domainChangeSpy: any;
    let updateModelSpy: any;
    let fetchSiteModelSpy: any;

    beforeEach(() => {
      domainChangeSpy = vi
        .spyOn(handleDomainChangesModule, "handleDomainChanges")
        .mockResolvedValue(undefined as any);

      updateModelSpy = vi
        .spyOn(updateModelModule, "updateModel")
        .mockImplementation((m: IModel) => {
          return Promise.resolve(m);
        });

      fetchSiteModelSpy = vi
        .spyOn(fetchSiteModelModule, "fetchSiteModel")
        .mockResolvedValue(SITE_MODEL as any);

      vi.spyOn(slugUtils, "getUniqueSlug").mockImplementation(
        ({ slug }: any) => {
          return Promise.resolve(slug as string);
        }
      );
    });
    it("updates the backing model", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.name = "Updated Name";
      const chk = await updateSite(updatedSite, MOCK_HUB_REQOPTS);

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Updated Name");
      expect(chk.description).toBe("Some longer description");

      expect(domainChangeSpy).toHaveBeenCalledTimes(1);

      expect(domainChangeSpy.mock.calls[0][1]).toEqual(SITE_MODEL);

      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.title).toBe(updatedSite.name);
    });

    it("handles change to subdomain in enterprise", async () => {
      const updatedSite = cloneObject(SITE);
      updatedSite.subdomain = "updated-subdomain";
      const ro = { ...MOCK_HUB_REQOPTS, isPortal: true };
      const chk = await updateSite(updatedSite, ro);

      expect(chk.id).toBe(GUID);
      expect(chk.subdomain).toBe("updated-subdomain");

      expect(domainChangeSpy).toHaveBeenCalledTimes(0);

      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
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

      expect(domainChangeSpy).toHaveBeenCalledTimes(1);

      const domainChangeArg0 = domainChangeSpy.mock.calls[0][0];
      const domainChangeArg1 = domainChangeSpy.mock.calls[0][1];
      expect(domainChangeArg0.data.values.customHostname).toEqual(
        updatedHostname
      );
      expect(domainChangeArg1).toEqual(SITE_MODEL);

      expect(fetchSiteModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.title).toBe(updatedSite.name);
    });
    it("reflects collection changes to searchCategories", async () => {
      const updatedSite = cloneObject(SITE);
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
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
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
      const updatedSite = cloneObject(SITE);
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
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.data.catalog).toEqual({ groups: ["9001"] });
      expect(modelToUpdate.data.catalogV2).toEqual(expectedCatalogV2);
    });
  });
  describe("createSite:", () => {
    let uniqueDomainSpy: any;
    let createModelSpy: any;
    let updateModelSpy: any;
    let ensureUniqueEntitySlugSpy: any;

    let addDomainsSpy: any;
    beforeEach(() => {
      uniqueDomainSpy = vi
        .spyOn(ensureUniqueDomainNameModule, "ensureUniqueDomainName")
        .mockImplementation((subdomain: string, _ro?: any) => {
          return Promise.resolve(subdomain);
        });
      createModelSpy = vi
        .spyOn(createModelModule, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          (newModel.item as any).id = GUID;
          return Promise.resolve(newModel);
        });
      updateModelSpy = vi
        .spyOn(updateModelModule, "updateModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          return Promise.resolve(newModel);
        });
      ensureUniqueEntitySlugSpy = vi
        .spyOn(ensureUniqueEntitySlugModule, "ensureUniqueEntitySlug")
        .mockResolvedValue({} as any);
    });
    describe("online: ", () => {
      beforeEach(() => {
        addDomainsSpy = vi
          .spyOn(addSiteDomainsModule, "addSiteDomains")
          .mockResolvedValue([{ clientKey: "FAKE_CLIENT_KEY" }] as any);
      });
      it("works with a sparse IHubSite", async () => {
        const sparseSite: Partial<IHubSite> = {
          name: "my site",
          orgUrlKey: "DCdev",
        };

        const chk = await createSite(sparseSite, MOCK_HUB_REQOPTS);

        expect(ensureUniqueEntitySlugSpy).toHaveBeenCalledTimes(0);
        expect(uniqueDomainSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(updateModelSpy).toHaveBeenCalledTimes(1);

        expect(addDomainsSpy).toHaveBeenCalledTimes(1);

        const modelToCreate = createModelSpy.mock.calls[0][0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Hub Site Application");
        expect(modelToCreate.item.properties.slug).toBeUndefined();
        expect(modelToCreate.item.properties.orgUrlKey).toBe("org");

        const modelToUpdate = updateModelSpy.mock.calls[0][0];
        expect(modelToUpdate.data.values.clientId).toBe("FAKE_CLIENT_KEY");

        expect(chk.name).toBe("my site");
        expect(chk.url).toBe("https://my-site-org.hubqa.arcgis.com");
      });
      it("works with a sparse IHubSite without orgUrlKey", async () => {
        const sparseSite: Partial<IHubSite> = {
          name: "my site",
        };

        const hubRO = cloneObject(MOCK_HUB_REQOPTS);
        hubRO.portalSelf.urlKey = "DCdev";

        const chk = await createSite(sparseSite, hubRO);

        expect(ensureUniqueEntitySlugSpy).toHaveBeenCalledTimes(0);
        expect(uniqueDomainSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(updateModelSpy).toHaveBeenCalledTimes(1);

        expect(addDomainsSpy).toHaveBeenCalledTimes(1);

        const modelToCreate = createModelSpy.mock.calls[0][0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Hub Site Application");
        expect(modelToCreate.item.properties.slug).toBeUndefined();
        expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
        const modelToUpdate = updateModelSpy.mock.calls[0][0];
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

        expect(ensureUniqueEntitySlugSpy).toHaveBeenCalledTimes(0);
        expect(uniqueDomainSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(updateModelSpy).toHaveBeenCalledTimes(1);

        expect(addDomainsSpy).toHaveBeenCalledTimes(1);

        const modelToUpdate = updateModelSpy.mock.calls[0][0];
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
        const sparseSite: Partial<IHubSite> = {
          name: "my site",
        };

        const chk = await createSite(sparseSite, MOCK_ENTERPRISE_REQOPTS);

        expect(ensureUniqueEntitySlugSpy).toHaveBeenCalledTimes(0);
        expect(uniqueDomainSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(updateModelSpy).toHaveBeenCalledTimes(1);

        const modelToCreate = createModelSpy.mock.calls[0][0];
        expect(modelToCreate.item.title).toBe("my site");
        expect(modelToCreate.item.type).toBe("Site Application");
        expect(modelToCreate.item.properties.slug).toBeUndefined();
        expect(modelToCreate.item.properties.orgUrlKey).toEqual("");
        const modelToUpdate = updateModelSpy.mock.calls[0][0];
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
    let enrichmentSpy: any;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = vi
        .spyOn(FetchEnrichments, "fetchItemEnrichments")
        .mockResolvedValue({
          item: cloneObject(SITE_ITEM_ENRICH),
          data: {
            pages: [{ id: 1 }, { id: 2 }],
          },
        } as any);
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      } as IHubRequestOptions;
    });
    it("converts item to search result", async () => {
      const chk = await enrichSiteSearchResult(
        cloneObject(SITE_ITEM_ENRICH),
        [],
        hubRo
      );

      expect(enrichmentSpy).toHaveBeenCalledTimes(0);

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
      const portalStr: string = hubRo.portal as unknown as string;
      const thumbName: string = ITM.thumbnail as unknown as string;
      expect(chk.links?.thumbnail).toEqual(
        `${portalStr}/content/items/${ITM.id}/info/${thumbName}`
      );
    });
    it("uses snippet if defined", async () => {
      const itm = cloneObject(SITE_ITEM_ENRICH);
      (itm as any).snippet = "This should be used";
      const chk = await enrichSiteSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });
    it("fetches enrichments", async () => {
      const chk = await enrichSiteSearchResult(
        cloneObject(SITE_ITEM_ENRICH),
        ["data.pages.length AS pageCount"],
        hubRo
      );

      expect(chk.pageCount).toBe(2);

      expect(enrichmentSpy).toHaveBeenCalledTimes(1);
      const [item, enrichments, ro] = enrichmentSpy.mock.calls[0];
      expect(item).toEqual(SITE_ITEM_ENRICH);
      expect(enrichments).toEqual(["data"]);
      expect(ro).toBe(hubRo);
    });
  });
});

// Consolidated minimal cover test (was in HubSites-cover.spec.ts)
describe("HubSites.enrichSiteSearchResult minimal", () => {
  it("converts Web Mapping Application type to Hub Site Application and maps basic fields", async () => {
    const item: any = {
      id: "1",
      type: "Web Mapping Application",
      title: "T",
      owner: "o",
      typeKeywords: [],
      tags: [],
      categories: [],
      snippet: "s",
      description: "d",
      created: Date.now(),
      modified: Date.now(),
      access: "public",
    };
    const res = await enrichSiteSearchResult(item, [], {} as unknown as any);
    expect(res.type).toBe("Hub Site Application");
    expect(res.id).toBe("1");
    expect(res.name).toBe("T");
  });
});
