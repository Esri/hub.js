import { vi } from "vitest";
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    getItem: vi.fn(),
    getItemData: vi.fn(),
    removeItem: vi.fn(),
  };
});
import * as portalModule from "@esri/arcgis-rest-portal";
import * as FetchEnrichments from "../../src/items/_enrichments";

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as createModelUtils from "../../src/models/createModel";
import * as getModelUtils from "../../src/models/getModel";
import * as updateModelUtils from "../../src/models/updateModel";
import * as slugUtils from "../../src/items/slugs";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  HubEntityStatus,
  IHubRequestOptions,
  IModel,
} from "../../src/hub-types";
import {
  createInitiative,
  enrichInitiativeSearchResult,
  fetchInitiative,
  deleteInitiative,
  updateInitiative,
} from "../../src/initiatives/HubInitiatives";
import { IHubInitiative } from "../../src/core/types/IHubInitiative";
import * as utilModule from "../../src/util";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const INITIATIVE_ITEM = {
  id: GUID,
  title: "Fake Initiative",
  description: "fake description",
  snippet: "fake snippet",
  properties: {
    schemaVersion: 1,
  },
  owner: "vader",
  type: "Hub Initiative",
  created: 1643646881000,
  modified: 1643646881000,
  tags: [],
  typeKeywords: [],
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
} as any;

const INITIATIVE_DATA = { view: {} } as any;

const INITIATIVE_MODEL = {
  item: INITIATIVE_ITEM,
  data: INITIATIVE_DATA,
} as IModel;

const INITIATIVE_ITEM_ENRICH = {
  id: "0332f8205e594368b8c3409772f2dcf1",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  isOrgItem: true,
  modified: 1652819949000,
  guid: null,
  name: null,
  title: "Data Initiative",
  type: "Hub Initiative",
  typeKeywords: ["Hub", "hubInitiativeV2"],
  description: "Test Initiative with data",
  tags: ["hubInitiativeV2"],
  thumbnail: "thumbnail/my-thing.png",
  extent: [],
  categories: [],
  access: "public",
  size: -1,
  numViews: 13,
  scoreCompleteness: 45,
  contentOrigin: "self",
} as any;

describe("HubInitiatives:", () => {
  describe("fetchInitiative:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockResolvedValue(INITIATIVE_ITEM );
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue(INITIATIVE_DATA );

      const chk = await fetchInitiative(GUID, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      vi.spyOn(portalModule, "getItem").mockResolvedValue(
        INITIATIVE_ITEM 
      );
      vi.spyOn(portalModule, "getItemData").mockResolvedValue(
        INITIATIVE_DATA 
      );
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchInitiative(GUID, ro as any);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/vader.png"
      );
    });

    it("gets by slug if not passed guid", async () => {
      vi.spyOn(slugUtils, "getItemBySlug").mockResolvedValue(
        INITIATIVE_ITEM 
      );
      vi.spyOn(portalModule, "getItemData").mockResolvedValue(
        INITIATIVE_DATA 
      );

      const chk = await fetchInitiative("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(slugUtils.getItemBySlug).toHaveBeenCalledTimes(1);
      expect(slugUtils.getItemBySlug).toHaveBeenCalledWith(
        "dcdev-34th-street",
        { authentication: MOCK_AUTH }
      );
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
    });

    it("returns null if no id found", async () => {
      vi.spyOn(slugUtils, "getItemBySlug").mockResolvedValue(null as any);

      const chk = await fetchInitiative("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(slugUtils.getItemBySlug).toHaveBeenCalledTimes(1);
      expect(chk).toEqual(null as unknown as IHubInitiative);
    });
  });

  describe("destroyProject:", () => {
    it("deletes the item", async () => {
      const removeSpy = vi
        .spyOn(portalModule, "removeItem")
        .mockResolvedValue({ success: true } as any);

      const result = await deleteInitiative("3ef", {
        authentication: MOCK_AUTH,
      } as any);
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy.mock.calls[0][0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.mock.calls[0][0].id).toBe("3ef");
    });
  });

  describe("createInitiative:", () => {
    it("works with very limited structure", async () => {
      vi.spyOn(slugUtils, "getUniqueSlug").mockResolvedValue(
        "dcdev|hello-world"
      );
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = utilModule.cloneObject(m as any);
          newModel.item.id = GUID;
          return Promise.resolve(newModel );
        });
      const chk = await createInitiative(
        { name: "Hello World", orgUrlKey: "dcdev" } as any,
        { authentication: MOCK_AUTH } as any
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(slugUtils.getUniqueSlug).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it("works with more complete object", async () => {
      vi.spyOn(slugUtils, "getUniqueSlug").mockResolvedValue(
        "dcdev|hello-world"
      );
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = utilModule.cloneObject(m as any);
          newModel.item.id = GUID;
          return Promise.resolve(newModel );
        });
      const chk = await createInitiative(
        {
          name: "Hello World",
          slug: "dcdev|hello-world",
          description: "my desc",
          orgUrlKey: "dcdev",
          status: HubEntityStatus.inProgress,
        } as any,
        { authentication: MOCK_AUTH } as any
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateInitiative: ", () => {
    it("updates backing model", async () => {
      vi.spyOn(slugUtils, "getUniqueSlug").mockResolvedValue(
        "dcdev|dcdev-wat-blarg-1"
      );
      vi.spyOn(getModelUtils, "getModel").mockResolvedValue(
        INITIATIVE_MODEL as any
      );
      vi.spyOn(updateModelUtils, "updateModel").mockImplementation(
        (m: IModel) => Promise.resolve(m as any)
      );
      const prj: IHubInitiative = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        status: HubEntityStatus.notStarted,
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        catalog: { schemaVersion: 0 },
        catalogs: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        typeKeywords: [],
      } as any;
      const chk = await updateInitiative(
        prj as any,
        { authentication: MOCK_AUTH } as any
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
    });
  });

  describe("enrichments:", () => {
    it("converts item to search result", async () => {
      vi.spyOn(FetchEnrichments, "fetchItemEnrichments").mockImplementation(
        () => Promise.resolve({ data: { status: "active" } } as any)
      );
      const hubRo: IHubRequestOptions = {
        portal: "https://some-server.com/gis/sharing/rest",
      } as any;
      const chk = await enrichInitiativeSearchResult(
        utilModule.cloneObject(INITIATIVE_ITEM_ENRICH ),
        [],
        hubRo as any
      );

      expect(chk.access).toEqual(INITIATIVE_ITEM_ENRICH.access);
      expect(chk.id).toEqual(INITIATIVE_ITEM_ENRICH.id);
      expect(chk.type).toEqual(INITIATIVE_ITEM_ENRICH.type);
      expect(chk.name).toEqual(INITIATIVE_ITEM_ENRICH.title);
      expect(chk.owner).toEqual(INITIATIVE_ITEM_ENRICH.owner);
      expect(chk.summary).toEqual(INITIATIVE_ITEM_ENRICH.description);
      expect(chk.createdDate).toEqual(new Date(INITIATIVE_ITEM_ENRICH.created));
    });

    it("maps fetched enrichments onto result properties", async () => {
      // return an enriched object with a nested value under `data.foo`
      const fetchSpy = vi
        .spyOn(FetchEnrichments, "fetchItemEnrichments")
        .mockResolvedValue({ data: { foo: "bar" } } as any);

      const hubRo: IHubRequestOptions = {
        portal: "https://some-server.com/gis/sharing/rest",
      } as any;

      // include requests the `data.foo` enrichment and maps it to `fooProp`
      const chk = await enrichInitiativeSearchResult(
        utilModule.cloneObject(INITIATIVE_ITEM_ENRICH ),
        ["data.foo AS fooProp"],
        hubRo as any
      );

      // fetchItemEnrichments should have been called with the list of enrichments (['data'])
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy.mock.calls[0][1]).toEqual(["data"]);

      // the mapped property should be present on the result
      expect(chk.fooProp).toBe("bar");
    });
  });
});
