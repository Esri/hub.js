import {
  getModelBySlug,
  createModel,
  updateModel,
  IModel,
  fetchModelFromItem,
} from "../../src";

import * as portalModule from "@esri/arcgis-rest-portal";

import * as hubCommon from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  ICreateItemOptions,
  IUpdateItemOptions,
} from "@esri/arcgis-rest-portal";

describe("model utils:", () => {
  // afterEach(fetchMock.restore);
  describe("getModelBySlug:", () => {
    it("getModelBySlug returns item and data", async () => {
      const getItemBySlugSpy = spyOn(
        hubCommon,
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
        hubCommon,
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

      const m = {
        item: {
          title: "My New Thing",
          type: "Hub Project",
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;
      const ts = new Date().getTime();
      const chk = await createModel(m, { authentication: MOCK_AUTH });
      expect(chk.item.id).toBe("bc3");
      expect(chk.item.created).toBeGreaterThanOrEqual(ts);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(createItemSpy.calls.count()).toBe(1);
      const opts = createItemSpy.calls.argsFor(
        0
      )[0] as unknown as ICreateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
    });
  });
  describe("updateModel: ", () => {
    it("updates a model", async () => {
      const updateItemSpy = spyOn(portalModule, "updateItem").and.returnValue(
        Promise.resolve({ success: true, id: "bc3" })
      );

      const m = {
        item: {
          id: "00c",
          title: "My New Thing",
          type: "Hub Project",
          created: 1643663750004,
          modified: 1643663750007,
        },
        data: {
          some: "data",
        },
      } as unknown as IModel;
      const ts = new Date().getTime();
      const chk = await updateModel(m, { authentication: MOCK_AUTH });
      expect(chk.item.id).toBe("00c");
      expect(chk.item.created).toBe(1643663750004);
      expect(chk.item.modified).toBeGreaterThanOrEqual(ts);
      expect(updateItemSpy.calls.count()).toBe(1);
      const opts = updateItemSpy.calls.argsFor(
        0
      )[0] as unknown as IUpdateItemOptions;

      expect(opts.authentication).toBe(MOCK_AUTH);
      expect(opts.item.data).toBeDefined();
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
});
