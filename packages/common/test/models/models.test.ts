import * as portalModule from "@esri/arcgis-rest-portal";
import * as itemsModule from "../../src/items";
import * as resourcesModule from "../../src/resources";

import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  createModel,
  fetchModelFromItem,
  getModelBySlug,
  IHubLocation,
  IModel,
  updateModel,
  upsertModelResources,
  fetchModelResources,
  EntityResourceMap,
} from "../../src";

const LOCATION: IHubLocation = {
  type: "custom",
};

describe("model utils:", () => {
  describe("getModelBySlug:", () => {
    it("getModelBySlug returns item and data", async () => {
      const getItemBySlugSpy = spyOn(
        itemsModule,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve({ id: "3ef", owner: "vader" }));

      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );

      const chk = await getModelBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });

      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.count()).toBe(1);

      expect(chk.item.id).toBe("3ef");
    });
    it("returns null if not found", async () => {
      const getItemBySlugSpy = spyOn(
        itemsModule,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(null));

      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );

      const chk = await getModelBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });

      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.count()).toBe(0);

      expect(chk).toBeNull();
    });
  });
  describe("createModel:", () => {
    it("creates item and stores it", async () => {
      const createItemSpy = spyOn(portalModule, "createItem").and.returnValue(
        Promise.resolve({ success: true, id: "bc3" })
      );
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          id: "bc3",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        })
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );

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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(createItemSpy.calls.count()).toBe(1);
      const opts = createItemSpy.calls.argsFor(
        0
      )[0] as unknown as portalModule.ICreateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
    });
    it("creates item and stores it w/ extent as string", async () => {
      const createItemSpy = spyOn(portalModule, "createItem").and.returnValue(
        Promise.resolve({ success: true, id: "bc3" })
      );
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          id: "bc3",
          created: new Date().getTime(),
          modified: new Date().getTime(),
        })
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );

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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(createItemSpy.calls.count()).toBe(1);
      const opts = createItemSpy.calls.argsFor(
        0
      )[0] as unknown as portalModule.ICreateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
    });
  });
  describe("updateModel: ", () => {
    it("updates a model", async () => {
      const updateItemSpy = spyOn(portalModule, "updateItem").and.returnValue(
        Promise.resolve({ success: true, id: "00c" })
      );
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          id: "00c",
          created: 1643663750004,
          modified: new Date().getTime(),
        })
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );

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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(updateItemSpy.calls.count()).toBe(1);
      let opts = updateItemSpy.calls.argsFor(
        0
      )[0] as unknown as portalModule.IUpdateItemOptions;

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
      opts = updateItemSpy.calls.argsFor(
        0
      )[0] as unknown as portalModule.IUpdateItemOptions;
      expect(opts?.params?.clearEmptyFields).toBeTruthy();
      expect(opts.item.tags).toEqual([]);
      expect(opts.item.categories).toEqual([]);
    });
    it("updates a model w/ extent as string", async () => {
      const updateItemSpy = spyOn(portalModule, "updateItem").and.returnValue(
        Promise.resolve({ success: true, id: "00c" })
      );
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          id: "00c",
          created: 1643663750004,
          modified: new Date().getTime(),
        })
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );

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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(updateItemSpy.calls.count()).toBe(1);
      const opts = updateItemSpy.calls.argsFor(
        0
      )[0] as unknown as portalModule.IUpdateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
      expect(opts.item.extent).toBe("1, 2, 3, 4" as unknown as number[][]);
    });
  });
  describe("fetchModelFromItem:", () => {
    it("fetches data and returns model", async () => {
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ data: "values" })
      );
      const chk = await fetchModelFromItem(
        { id: "3ef" } as portalModule.IItem,
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(chk.item).toEqual({ id: "3ef" } as portalModule.IItem);
      expect(chk.data).toEqual({ data: "values" });
    });
  });

  describe("upsertModelResources", () => {
    it("upserts model resources", async () => {
      const upsertResourceSpy = spyOn(
        resourcesModule,
        "upsertResource"
      ).and.returnValue(Promise.resolve("https://fake.com/123"));

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

      expect(upsertResourceSpy.calls.count()).toBe(1);
      expect(chk.resources).toEqual({
        location: LOCATION,
      });
    });
  });

  describe("fetchModelResources", () => {
    it("fetches model resources", async () => {
      const fetchResourceSpy = spyOn(
        portalModule,
        "getItemResource"
      ).and.returnValue(Promise.resolve(LOCATION));

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

      expect(fetchResourceSpy.calls.count()).toBe(1);
      expect(chk).toEqual({
        location: LOCATION,
      });
    });

    it("rejects model resources", async () => {
      const fetchResourceSpy = spyOn(
        portalModule,
        "getItemResource"
      ).and.returnValue(Promise.reject("nope"));

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

      expect(fetchResourceSpy.calls.count()).toBe(1);
      expect(chk).toEqual({});
    });
  });
});
