import * as portalModule from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  IModel,
  getProject,
  destroyProject,
  IHubProject,
  createProject,
  updateProject,
} from "../../src";

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import * as slugUtils from "../../src/items/slugs";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const PROJECT_ITEM = {
  id: GUID,
  title: "Fake Project",
  description: "fake description",
  snippet: "fake snippet",
  owner: "vader",
  type: "Hub Project",
  created: 1643646881000,
  modified: 1643646881000,
  tags: [],
  typeKeywords: [],
} as portalModule.IItem;

const PROJECT_DATA = {
  timeline: {},
};

const PROJECT_MODEL = {
  item: PROJECT_ITEM,
  data: PROJECT_DATA,
} as IModel;

describe("HubProjects:", () => {
  describe("get:", () => {
    it("gets by id, if passed a guid", async () => {
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(PROJECT_MODEL)
      );

      const chk = await getProject(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
      expect(getModelSpy.calls.count()).toBe(1);
      expect(getModelSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets by slug if not passed guid", async () => {
      const getModelBySlugSpy = spyOn(
        modelUtils,
        "getModelBySlug"
      ).and.returnValue(Promise.resolve(PROJECT_MODEL));
      const chk = await getProject("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getModelBySlugSpy.calls.count()).toBe(1);
      expect(getModelBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe("vader");
    });
  });

  describe("destroy:", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await destroyProject("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });

  describe("create:", () => {
    it("works with very limited initial structure", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          m.item.id = GUID;
          return Promise.resolve(m);
        }
      );
      const chk = await createProject(
        { name: "Hello World", org: { id: "BC7ajs", urlKey: "dcdev" } },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toBe(
        "dcdev-hello-world",
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.properties.slug).toBe("dcdev-hello-world");
      expect(modelToCreate.data.org.urlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          m.item.id = GUID;
          return Promise.resolve(m);
        }
      );
      const chk = await createProject(
        {
          name: "Hello World",
          slug: "dcdev-hello-world", // important for coverage
          description: "my desc",
          org: { id: "BC7ajs", urlKey: "dcdev" },
        },
        { authentication: MOCK_AUTH }
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toBe(
        "dcdev-hello-world",
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev-hello-world");
      expect(modelToCreate.data.org.urlKey).toBe("dcdev");
    });
  });

  describe("update: ", () => {
    it("updates backing model", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(PROJECT_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
      const prj: IHubProject = {
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        org: {
          id: "BC7ajs",
          urlKey: "dcdev",
        },
        owner: "dcdev_dude",
        type: "Hub Project",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        status: "active",
        thumbnailUrl: "",
      };
      const chk = await updateProject(prj, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toBe(
        "dcdev-wat-blarg",
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
