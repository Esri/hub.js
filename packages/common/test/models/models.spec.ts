import { vi } from "vitest";

// ESM-safe mock: merge original module and override only the functions we need to spy on.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  return {
    ...(await importOriginal()),
    getItemData: vi.fn(),
    getItem: vi.fn(),
    getItemResource: vi.fn(),
  };
});

import * as portalModule from "@esri/arcgis-rest-portal";
import * as getItemBySlugModule from "../../src/items/slugs";
import * as upsertResourceModule from "../../src/resources/upsertResource";
import * as restPortal from "../../src/rest/portal/wrappers";

import { MOCK_AUTH } from "../mocks/mock-auth";
import { IHubLocation } from "../../src/core/types/IHubLocation";
import { getModelBySlug } from "../../src/models/getModelBySlug";
import { createModel } from "../../src/models/createModel";
import { IModel } from "../../src/hub-types";
import { updateModel } from "../../src/models/updateModel";
import { fetchModelFromItem } from "../../src/models/fetchModelFromItem";
import { upsertModelResources } from "../../src/models/upsertModelResource";
import { fetchModelResources } from "../../src/models/fetchModelResource";
import { EntityResourceMap } from "../../src/core/types/types";
import { IItem } from "@esri/arcgis-rest-portal";

const LOCATION: IHubLocation = {
  type: "custom",
};

describe("model utils:", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getModelBySlug:", () => {
    it("getModelBySlug returns item and data", async () => {
      const getItemBySlugSpy = vi
        .spyOn(getItemBySlugModule, "getItemBySlug")
        .mockResolvedValue({
          id: "3ef",
          owner: "vader",
        } as unknown as portalModule.IItem);

      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });

      const chk = await getModelBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });

      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);

      expect(chk.item.id).toBe("3ef");
    });
    it("returns null if not found", async () => {
      const getItemBySlugSpy = vi
        .spyOn(getItemBySlugModule, "getItemBySlug")
        .mockResolvedValue(null);

      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });

      const chk = await getModelBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });

      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy).toHaveBeenCalledTimes(0);

      expect(chk).toBeNull();
    });
  });
  describe("createModel:", () => {
    it("creates item and stores it", async () => {
      const createItemSpy = vi
        .spyOn(restPortal, "createItem")
        .mockResolvedValue({
          success: true,
          id: "bc3",
        } as unknown as portalModule.ICreateItemResponse);
      const getItemSpy = vi.spyOn(portalModule, "getItem").mockResolvedValue({
        id: "bc3",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      } as unknown as portalModule.IItem);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });

      const m = {
        item: {
          title: "My New Thing",
          type: "Hub Project",
          extent: [
            [1, 2],
            [3, 4],
          ],
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;
      // depending how fast tests run, the date we're faking may be a bit off
      const ts = new Date().getTime() - 100;
      const chk = await createModel(m, {
        authentication: MOCK_AUTH,
      });
      expect(chk.item.id).toBe("bc3");
      expect(chk.item.created).toBeGreaterThanOrEqual(ts);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      const opts = (createItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.ICreateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
    });
    it("creates item and stores it w/ extent as string", async () => {
      const createItemSpy = vi
        .spyOn(restPortal, "createItem")
        .mockResolvedValue({
          success: true,
          id: "bc3",
        } as unknown as portalModule.ICreateItemResponse);
      const getItemSpy = vi.spyOn(portalModule, "getItem").mockResolvedValue({
        id: "bc3",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      } as unknown as portalModule.IItem);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });

      const m = {
        item: {
          title: "My New Thing",
          type: "Hub Project",
          extent: "1, 2, 3, 4" as unknown as number[][],
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;
      // depending how fast tests run, the date we're faking may be a bit off
      const ts = new Date().getTime() - 100;
      const chk = await createModel(m, {
        authentication: MOCK_AUTH,
      });
      expect(chk.item.id).toBe("bc3");
      expect(chk.item.created).toBeGreaterThanOrEqual(ts);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(createItemSpy).toHaveBeenCalledTimes(1);
      const opts = (createItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.ICreateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
    });
  });
  // longterm TODO: change these to spy on getModel rather than the implementations of it
  describe("updateModel: ", () => {
    it("updates a model", async () => {
      const updateItemSpy = vi
        .spyOn(restPortal, "updateItem")
        .mockResolvedValue({ success: true, id: "00c" });
      const getItemSpy = vi.spyOn(portalModule, "getItem").mockResolvedValue({
        id: "00c",
        created: 1643663750004,
        modified: new Date().getTime(),
      } as unknown as portalModule.IItem);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });

      const m = {
        item: {
          description: "",
          id: "00c",
          title: "My New Thing",
          type: "Hub Project",
          created: 1643663750004,
          modified: 1643663750007,
          extent: [
            [1, 2],
            [3, 4],
          ],
          tags: [],
          categories: [],
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;
      // depending how fast tests run, the modified date we're faking may be a bit off
      const ts = new Date().getTime() - 100;
      let chk = await updateModel(m, {
        authentication: MOCK_AUTH,
      });
      expect(chk.item.id).toBe("00c");
      expect(chk.item.created).toBe(1643663750004);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(updateItemSpy).toHaveBeenCalledTimes(1);
      let opts = (updateItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.IUpdateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.params).toBeDefined();
      expect(opts?.params?.clearEmptyFields).toBeTruthy();
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
      expect(opts.item.description).toBe("");

      m.item.description = "This is a description";
      chk = await updateModel(m, {
        authentication: MOCK_AUTH,
      });
      opts = (updateItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.IUpdateItemOptions;
      expect(opts?.params?.clearEmptyFields).toBeTruthy();
      expect(opts.item.tags).toEqual([]);
      expect(opts.item.categories).toEqual([]);
    });
    it("updates a model without data", async () => {
      const updateItemSpy = vi
        .spyOn(restPortal, "updateItem")
        .mockResolvedValue({ success: true, id: "00c" });
      const getItemSpy = vi.spyOn(portalModule, "getItem").mockResolvedValue({
        id: "00c",
        created: 1643663750004,
        modified: new Date().getTime(),
      } as unknown as portalModule.IItem);

      const m = {
        item: {
          description: "",
          id: "00c",
          title: "My New Thing",
          type: "Hub Project",
          created: 1643663750004,
          modified: 1643663750007,
          extent: [
            [1, 2],
            [3, 4],
          ],
          tags: [],
          categories: [],
        },
      } as unknown as IModel;
      // depending how fast tests run, the modified date we're faking may be a bit off
      const ts = new Date().getTime() - 100;
      let chk = await updateModel(m, {
        authentication: MOCK_AUTH,
      });
      expect(chk.item.id).toBe("00c");
      expect(chk.item.created).toBe(1643663750004);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(updateItemSpy).toHaveBeenCalledTimes(1);
      let opts = (updateItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.IUpdateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.params).toBeDefined();
      expect(opts?.params?.clearEmptyFields).toBeTruthy();
      expect(opts.item.data).toBeUndefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
      expect(opts.item.description).toBe("");

      m.item.description = "This is a description";
      chk = await updateModel(m, {
        authentication: MOCK_AUTH,
      });
      opts = (updateItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.IUpdateItemOptions;
      expect(opts?.params?.clearEmptyFields).toBeTruthy();
      expect(opts.item.tags).toEqual([]);
      expect(opts.item.categories).toEqual([]);
    });
    it("updates a model w/ extent as string", async () => {
      const updateItemSpy = vi
        .spyOn(restPortal, "updateItem")
        .mockResolvedValue({ success: true, id: "00c" });
      const getItemSpy = vi.spyOn(portalModule, "getItem").mockResolvedValue({
        id: "00c",
        created: 1643663750004,
        modified: new Date().getTime(),
      } as unknown as portalModule.IItem);
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });

      const m = {
        item: {
          id: "00c",
          title: "My New Thing",
          type: "Hub Project",
          created: 1643663750004,
          modified: 1643663750007,
          extent: "1, 2, 3, 4" as unknown as number[][],
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;
      // depending how fast tests run, the modified date we're faking may be a bit off
      const ts = new Date().getTime() - 100;
      const chk = await updateModel(m, {
        authentication: MOCK_AUTH,
      });
      expect(chk.item.id).toBe("00c");
      expect(chk.item.created).toBe(1643663750004);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(updateItemSpy).toHaveBeenCalledTimes(1);
      const opts = (updateItemSpy as unknown as any).mock
        .calls[0][0] as unknown as portalModule.IUpdateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
    });
  });
  describe("fetchModelFromItem:", () => {
    it("fetches data and returns model", async () => {
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockResolvedValue({ data: "values" });
      const chk = await fetchModelFromItem(
        { id: "3ef", type: "Web Map" } as portalModule.IItem,
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(chk.item).toEqual({
        id: "3ef",
        type: "Web Map",
      } as portalModule.IItem);
      expect(chk.data).toEqual({ data: "values" });
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
    });
    it("returns null if no item", async () => {
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockRejectedValue("no item");
      const chk = await fetchModelFromItem(
        { id: "3ef", type: "Web Map" } as portalModule.IItem,
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(chk.data).toBeNull();
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
    });
    it("should not fetch item data for excluded type", async () => {
      const getItemDataSpy = vi.spyOn(portalModule, "getItemData");
      const item = { id: "abc", type: "Image Collection" } as IItem;
      expect(await fetchModelFromItem(item, {} as any)).toEqual({
        item,
        data: null,
      } as IModel);
      expect(getItemDataSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("upsertModelResources", () => {
    it("upserts model resources", async () => {
      const upsertResourceSpy = vi
        .spyOn(upsertResourceModule, "upsertResource")
        .mockResolvedValue("https://fake.com/123");

      const m = {
        item: {
          id: "00c",
          owner: "fakeOwner",
          title: "My New Thing",
          type: "Hub Project",
          created: 1643663750004,
          modified: 1643663750007,
          extent: "1, 2, 3, 4" as unknown as number[][],
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;

      const resources = [
        {
          resource: LOCATION,
          filename: "location.json",
        },
      ];

      const chk = await upsertModelResources(m, resources, {
        authentication: MOCK_AUTH,
      });

      expect(upsertResourceSpy).toHaveBeenCalledTimes(1);
      expect(chk.resources).toEqual({
        location: LOCATION,
      });
    });
  });

  describe("fetchModelResources", () => {
    it("fetches model resources", async () => {
      const fetchResourceSpy = vi
        .spyOn(portalModule, "getItemResource")
        .mockResolvedValue(LOCATION);

      const i = {
        id: "00c",
        owner: "fakeOwner",
        title: "My New Thing",
        type: "Hub Project",
        created: 1643663750004,
        modified: 1643663750007,
        extent: "1, 2, 3, 4" as unknown as number[][],
      } as unknown as portalModule.IItem;

      const chk = await fetchModelResources(i, EntityResourceMap, {
        authentication: MOCK_AUTH,
      });

      expect(fetchResourceSpy).toHaveBeenCalledTimes(1);
      expect(chk).toEqual({
        location: LOCATION,
      });
    });

    it("rejects model resources", async () => {
      const fetchResourceSpy = vi
        .spyOn(portalModule, "getItemResource")
        .mockRejectedValue("nope");

      const i = {
        id: "00c",
        owner: "fakeOwner",
        title: "My New Thing",
        type: "Hub Project",
        created: 1643663750004,
        modified: 1643663750007,
        extent: "1, 2, 3, 4" as unknown as number[][],
      } as unknown as portalModule.IItem;

      const chk = await fetchModelResources(i, EntityResourceMap, {
        authentication: MOCK_AUTH,
      });

      expect(fetchResourceSpy).toHaveBeenCalledTimes(1);
      expect(chk).toEqual({});
    });
  });
});
