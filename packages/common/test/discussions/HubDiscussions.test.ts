import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import * as slugUtils from "../../src/items/slugs";
import { IHubRequestOptions, IModel } from "../../src/types";
import {
  createDiscussion,
  fetchDiscussion,
  deleteDiscussion,
  updateDiscussion,
} from "../../src/discussions/HubDiscussions";
import { IHubDiscussion } from "../../src/core/types/IHubDiscussion";
import { cloneObject } from "../../src/util";
import { EntityCapabilities } from "../../src/capabilities/types";

// TODO: update
const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const DISCUSSION_ITEM: portalModule.IItem = {
  id: GUID,
  title: "Fake Discussion",
  description: "fake description",
  snippet: "fake snippet",
  properties: {
    schemaVersion: 1,
  },
  owner: "vader",
  type: "Discussion",
  created: 1643646881000,
  modified: 1643646881000,
  tags: [],
  typeKeywords: [],
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
} as portalModule.IItem;

const DISCUSSION_DATA = {
  settings: { capabilities: {} },
};

const DISCUSSION_MODEL = {
  item: DISCUSSION_ITEM,
  data: DISCUSSION_DATA,
} as IModel;

describe("HubDiscussions:", () => {
  describe("fetchDiscussion:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(DISCUSSION_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(DISCUSSION_DATA)
      );

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("supports not having data", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(DISCUSSION_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve()
      );

      const chk = await fetchDiscussion(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(DISCUSSION_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(DISCUSSION_DATA)
      );
      const ro: IHubRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchDiscussion(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/vader.png"
      );
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets by slug if not passed guid", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(DISCUSSION_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(DISCUSSION_DATA)
      );

      const chk = await fetchDiscussion("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(null));

      const chk = await fetchDiscussion("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubDiscussion);
    });
  });

  describe("deleteDiscussion:", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteDiscussion("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });

  describe("createDiscussion:", () => {
    it("works with very limited structure", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createDiscussion(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Discussion");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createDiscussion(
        {
          name: "Hello World",
          slug: "dcdev|hello-world", // important for coverage
          description: "my desc",
          orgUrlKey: "dcdev",
        },
        { authentication: MOCK_AUTH }
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });

  describe("updateDiscussion: ", () => {
    it("updates backing model", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(DISCUSSION_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
      const prj: IHubDiscussion = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Discussion",
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
      const chk = await updateDiscussion(prj, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev-wat-blarg", existingId: GUID },
        "should recieve slug"
      );
      expect(getModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(prj.description);
      expect(modelToUpdate.item.properties.slug).toBe("dcdev-wat-blarg-1");
    });
  });
});
