import { vi } from "vitest";
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    removeItem: vi.fn(),
    getItemData: vi.fn(),
  } ;
});
import * as portalModule from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as getModelUtils from "../../src/models/getModel";
import * as createModelUtils from "../../src/models/createModel";
import * as updateModelUtils from "../../src/models/updateModel";
import * as slugUtils from "../../src/items/slugs";
import {
  createPage,
  fetchPage,
  deletePage,
  updatePage,
  enrichPageSearchResult,
} from "../../src/pages/HubPages";
import { IHubPage } from "../../src/core/types/IHubPage";
import * as FetchEnrichments from "../../src/items/_enrichments";
import * as fetchModule from "../../src/items/fetch";
import { cloneObject } from "../../src/util";
import { IHubRequestOptions, IModel } from "../../src/hub-types";

const GUID = "f995804e9e0e42cc84187258de0b710d";
const PAGE_ITEM: IItem = {
  id: GUID,
  owner: "vader",
  created: 1592615052000,
  modified: 1592615052000,
  guid: null,
  name: null,
  title: "CDO Annual Goals",
  type: "Hub Page",
  typeKeywords: [
    "Hub",
    "hubPage",
    "JavaScript",
    "Map",
    "Mapping Site",
    "Online Map",
    "OpenData",
    "selfConfigured",
    "Web Map",
  ],
  description:
    "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the ArcGIS Hub application. To make changes to this page, please visit https://hub.arcgis.com/admin/",
  tags: ["tag"],
  snippet: null,
  thumbnail: "thumbnail/foo.png",
  documentation: null,
  extent: [],
  categories: ["category"],
  spatialReference: null,
  accessInformation: null,
  licenseInfo: null,
  culture: "en-us",
  properties: {
    collaborationGroupId: "33280c225a1c4cc98834825e2e3c0433",
  },
  advancedSettings: null,
  url: "https://opendata.arcgis.com/admin/",
  proxyFilter: null,
  access: "public",
  size: -1,
  subInfo: 0,
  appCategories: ["[]"],
  industries: ["[]"],
  languages: ["[]"],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 136,
  scoreCompleteness: 26,
  groupDesignations: null,
  contentOrigin: "other",
};

const PAGE_DATA = {};

const PAGE_MODEL = {
  item: PAGE_ITEM,
  data: PAGE_DATA,
} as IModel;

describe("HubPages Module", () => {
  describe("createPage:", () => {
    it("works with very limited structure", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world");
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createPage(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should ensure unique slug
      expect(slugSpy).toHaveBeenCalledTimes(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0] ;
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Hub Page");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world");
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createPage(
        {
          name: "Hello World",
          slug: "dcdev|hello-world",
          description: "my desc",
          orgUrlKey: "dcdev",
        },
        { authentication: MOCK_AUTH }
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      // should ensure unique slug
      expect(slugSpy).toHaveBeenCalledTimes(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0] ;
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });

  describe("updatePage: ", () => {
    it("updates backing model", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|dcdev-wat-blarg-1");
      const getModelSpy = vi
        .spyOn(getModelUtils, "getModel")
        .mockResolvedValue(PAGE_MODEL as any);
      const updateModelSpy = vi
        .spyOn(updateModelUtils, "updateModel")
        .mockImplementation((m: IModel) => Promise.resolve(m));
      const page: IHubPage = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Page",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        typeKeywords: [],
      };
      const chk = await updatePage(page, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      // should ensure unique slug
      expect(slugSpy).toHaveBeenCalledTimes(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
        "should recieve slug"
      );
      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0] ;
      expect(modelToUpdate.item.description).toBe(page.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
    });
  });

  describe("deletePage:", () => {
    it("deletes the item", async () => {
      const removeSpy = vi
        .spyOn(portalModule, "removeItem")
        .mockResolvedValue({ success: true } as any);

      const result = await deletePage("3ef", { authentication: MOCK_AUTH });
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect((removeSpy.mock.calls[0][0] as any).authentication).toBe(
        MOCK_AUTH
      );
      expect((removeSpy.mock.calls[0][0] as any).id).toBe("3ef");
    });
  });

  describe("fetchPage:", () => {
    const requestOptions = { authentication: MOCK_AUTH };

    it("converts item to page if found", async () => {
      const fetchItemSpy = vi
        .spyOn(fetchModule, "fetchItem")
        .mockResolvedValue(PAGE_ITEM as any);
      // NOTE: this should probably just spy on convertItemToPage instead
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(PAGE_DATA as any);

      const result = await fetchPage(GUID, requestOptions);

      expect(result.id).toBe(GUID);
      expect(result.owner).toBe("vader");
      expect(fetchItemSpy).toHaveBeenCalledTimes(1);
      expect(fetchItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
    });

    it("returns null if item not found", async () => {
      const fetchItemSpy = vi
        .spyOn(fetchModule, "fetchItem")
        .mockResolvedValue(null as any);
      // NOTE: this should probably just spy on convertItemToPage instead
      const getItemDataSpy = vi.spyOn(portalModule, "getItemData");

      const result = await fetchPage(GUID, requestOptions);

      expect(result).toBeNull();
      expect(fetchItemSpy).toHaveBeenCalledTimes(1);
      expect(fetchItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("enrichments:", () => {
    let enrichmentSpy: any;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = vi
        .spyOn(FetchEnrichments, "fetchItemEnrichments")
        .mockImplementation(() =>
          Promise.resolve({
            item: PAGE_ITEM as any,
            data: { sites: [{ id: 1 }] },
          } as any)
        );
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      } as IHubRequestOptions;
    });

    it("converts item to search result", async () => {
      const chk = await enrichPageSearchResult(
        cloneObject(PAGE_ITEM),
        [],
        hubRo
      );

      expect(enrichmentSpy).toHaveBeenCalledTimes(0);

      // verify expected output
      const ITM = cloneObject(PAGE_ITEM);
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
      expect(chk.family).toEqual("document");
      expect(chk.tags).toEqual(ITM.tags);
      expect(chk.categories).toEqual(ITM.categories);
      expect(chk.links.self).toEqual(
        `https://some-server.com/gis/home/item.html?id=${ITM.id}`
      );
      expect(chk.links.siteRelative).toEqual(`/pages/${ITM.id}`);
      expect(chk.links.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${
          ITM.thumbnail as string
        }`
      );
    });
    it("uses snippet if defined", async () => {
      const itm = cloneObject(PAGE_ITEM);
      itm.snippet = "This should be used";
      const chk = await enrichPageSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });

    it("fetches enrichments", async () => {
      const chk = await enrichPageSearchResult(
        cloneObject(PAGE_ITEM),
        ["data.sites.length AS siteCount"],
        hubRo
      );

      // verify the response
      expect(chk.siteCount).toBe(1);

      // verify the spy
      expect(enrichmentSpy).toHaveBeenCalledTimes(1);
      const [item, enrichments, ro] = enrichmentSpy.mock.calls[0];
      expect(item).toEqual(PAGE_ITEM);
      expect(enrichments).toEqual(["data"]);
      expect(ro).toBe(hubRo);
    });
  });
});
