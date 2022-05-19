import * as portalModule from "@esri/arcgis-rest-portal";

import {
  cloneObject,
  IModel,
  fetchProject,
  destroyProject,
  IHubProject,
  createProject,
  updateProject,
  searchProjects,
  Filter,
} from "../../src";

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import * as slugUtils from "../../src/items/slugs";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IHubSearchOptions } from "../../dist/types";

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
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
} as portalModule.IItem;

const PROJECT_DATA = {
  timeline: {},
};

const PROJECT_MODEL = {
  item: PROJECT_ITEM,
  data: PROJECT_DATA,
} as IModel;

describe("HubProjects:", () => {
  describe("fetchProject:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(PROJECT_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(PROJECT_DATA)
      );

      const chk = await fetchProject(GUID, {
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
        Promise.resolve(PROJECT_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(PROJECT_DATA)
      );
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchProject(GUID, ro);
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
      ).and.returnValue(Promise.resolve(PROJECT_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(PROJECT_DATA)
      );

      const chk = await fetchProject("dcdev-34th-street", {
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

      const chk = await fetchProject("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(chk).toBe(null);
    });
  });

  describe("destroyProject:", () => {
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

  describe("createProject:", () => {
    it("works with very limited initial structure", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createProject(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev-hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Hub Project");
      expect(modelToCreate.item.properties.slug).toBe("dcdev-hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createProject(
        {
          name: "Hello World",
          slug: "dcdev-hello-world", // important for coverage
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
        { slug: "dcdev-hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev-hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });

  describe("updateProject: ", () => {
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
        orgUrlKey: "dcdev",
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

  describe("searchProjects:", () => {
    const fakeResults = {
      total: 1,
      results: [{ id: "bc3", thumbnail: "zen.jpg" }],
      nextStart: -1,
      aggregations: {
        counts: [
          {
            fieldName: "tags",
            fieldValues: [
              { value: "red", count: 50 },
              { value: "blue", count: 25 },
              { value: "green", count: 5 },
            ],
          },
        ],
      },
    };
    let searchSpy: jasmine.Spy;
    let dataSpy: jasmine.Spy;
    beforeEach(() => {
      searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve(fakeResults)
      );
      dataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve({ values: "the values" })
      );
    });
    it("it constructs search, minimal", async () => {
      const filter: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts = {};
      const response = await searchProjects(filter, opts);
      expect(response.results.length).toBe(1);
      expect(searchSpy.calls.count()).toBe(1);
      expect(dataSpy.calls.count()).toBe(1);
      expect(response.results[0].thumbnailUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/bc3/info/zen.jpg"
      );
      // verify the query
      const searchOpts = searchSpy.calls.argsFor(0)[0];

      expect(searchOpts.q).toBe("water");
      expect(searchOpts.filter).toBe(`type:"Hub Project"`);
      // Verify facets
      expect(response.facets).toBeDefined();
    });

    it("it constructs search, passing api", async () => {
      const filter: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts = {
        api: "arcgisQA",
      } as IHubSearchOptions;
      const response = await searchProjects(filter, opts);
      expect(response.results.length).toBe(1);
      expect(searchSpy.calls.count()).toBe(1);
      expect(dataSpy.calls.count()).toBe(1);
      expect(response.results[0].thumbnailUrl).toBe(
        "https://qaext.arcgis.com/sharing/rest/content/items/bc3/info/zen.jpg"
      );
      // verify the query
      const searchOpts = searchSpy.calls.argsFor(0)[0];

      expect(searchOpts.q).toBe("water");
      expect(searchOpts.filter).toBe(`type:"Hub Project"`);
      expect(searchOpts.portal).toEqual(`https://qaext.arcgis.com`);
      // Verify facets
      expect(response.facets).toBeDefined();
    });
    it("constructs search, detailed", async () => {
      const filter: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts = {
        authentication: MOCK_AUTH,
        aggFields: ["tags"],
        num: 10,
        sortField: "title",
        sortOrder: "desc",
        site: { item: {}, data: {} },
      } as IHubSearchOptions;
      const response = await searchProjects(filter, opts);
      expect(response.results.length).toBe(1);
      expect(searchSpy.calls.count()).toBe(1);
      expect(dataSpy.calls.count()).toBe(1);
      expect(response.results[0].thumbnailUrl).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/bc3/info/zen.jpg?token=fake-token"
      );
      // verify the query
      const searchOpts = searchSpy.calls.argsFor(0)[0];

      expect(searchOpts.q).toBe("water");
      expect(searchOpts.countFields).toBe("tags");
      expect(searchOpts.countSize).toBe(10);
      expect(searchOpts.filter).toBe(`type:"Hub Project"`);

      // Verify facets
      expect(response.facets).toBeDefined();
      expect(response.facets.length).toBe(1);
      expect(response.facets[0].key).toBe("tags");
      expect(response.facets[0].options.length).toBe(3);
    });
    it("constructs search, including a specific start if required", async () => {
      const filter: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts = {
        authentication: MOCK_AUTH,
        aggFields: ["tags"],
        aggLimit: 54,
        num: 10,
        sortField: "title",
        sortOrder: "desc",
        site: { item: {}, data: {} },
        start: 2,
      } as any;
      const response = await searchProjects(filter, opts);
      expect(response.results.length).toBe(1);
      expect(searchSpy.calls.count()).toBe(1);
      expect(dataSpy.calls.count()).toBe(1);
      expect(response.results[0].thumbnailUrl).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/bc3/info/zen.jpg?token=fake-token"
      );
      // verify the query
      const searchOpts = searchSpy.calls.argsFor(0)[0];

      expect(searchOpts.q).toBe("water");
      expect(searchOpts.filter).toBe(`type:"Hub Project"`);
      expect(searchOpts.countSize).toBe(54);

      // Verify facets
      expect(response.facets).toBeDefined();
      expect(response.facets.length).toBe(1);
      expect(response.facets[0].key).toBe("tags");
      expect(response.facets[0].options.length).toBe(3);
    });
  });
});
