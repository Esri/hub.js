import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import { IHubRequestOptions, IModel } from "../../src/types";
import { IHubEditableContent } from "../../src/core/types";
import {
  createContent,
  deleteContent,
  updateContent,
} from "../../src/content/edit";
import { cloneObject } from "../../src/util";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";

describe("content editing:", () => {
  describe("create content:", () => {
    it("converts to a model and creates the item", async () => {
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createContent(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      // expect(modelToCreate.item.type).toBe("Hub Content");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });
  describe("update content:", () => {
    it("converts to a model and updates the item", async () => {
      // const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
      //   Promise.resolve({
      //     item: {
      //       typeKeywords: [],
      //     },
      //     data: {},
      //   })
      // );
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          item: {
            typeKeywords: [],
          },
        })
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
      };
      const chk = await updateContent(content, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(content.description);
    });
  });
  describe("delete content", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteContent("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });
});
