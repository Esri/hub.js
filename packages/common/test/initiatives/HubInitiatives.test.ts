import * as portalModule from "@esri/arcgis-rest-portal";
import * as FetchEnrichments from "../../src/items/_enrichments";

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import * as slugUtils from "../../src/items/slugs";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { HubEntityStatus, IHubRequestOptions, IModel } from "../../src/types";
import {
  createInitiative,
  enrichInitiativeSearchResult,
  fetchInitiative,
  deleteInitiative,
  updateInitiative,
  getPendingProjectsQuery,
  getAcceptedProjectsQuery,
  fetchAcceptedProjects,
  fetchPendingProjects,
} from "../../src/initiatives/HubInitiatives";
import { IHubInitiative } from "../../src/core/types/IHubInitiative";
import { cloneObject } from "../../src/util";
import { IPredicate, IQuery } from "../../src";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const INITIATIVE_ITEM: portalModule.IItem = {
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
} as portalModule.IItem;

const INITIATIVE_DATA = {};

const INITIATIVE_MODEL = {
  item: INITIATIVE_ITEM,
  data: INITIATIVE_DATA,
} as IModel;

const INITIATIVE_ITEM_ENRICH: portalModule.IItem = {
  id: "0332f8205e594368b8c3409772f2dcf1",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  isOrgItem: true,
  modified: 1652819949000,
  guid: null,
  name: null,
  title: "Data Initiative",
  type: "Hub Initiative",
  typeKeywords: [
    "Hub",
    "Hub Initiative",
    "JavaScript",
    "Map",
    "Mapping Site",
    "Online Map",
    "Ready To Use",
    "selfConfigured",
    "Web Map",
  ],
  description: "Test Initiative with data",
  tags: ["hubinitiative"],
  // snippet: null,
  thumbnail: "thumbnail/my-thing.png",
  // documentation: null,
  extent: [],
  categories: [],
  // spatialReference: null,
  accessInformation: null,
  licenseInfo: "CC-BY-SA",
  culture: "en-us",
  properties: null,
  advancedSettings: null,
  // url: null,
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
  ownerFolder: null,
  protected: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 13,
  scoreCompleteness: 45,
  groupDesignations: null,
  contentOrigin: "self",
};

describe("HubInitiatives:", () => {
  describe("fetchInitiative:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(INITIATIVE_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_DATA)
      );

      const chk = await fetchInitiative(GUID, {
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
        Promise.resolve(INITIATIVE_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_DATA)
      );
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchInitiative(GUID, ro);
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
      ).and.returnValue(Promise.resolve(INITIATIVE_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_DATA)
      );

      const chk = await fetchInitiative("dcdev-34th-street", {
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

      const chk = await fetchInitiative("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubInitiative);
    });
  });

  describe("destroyProject:", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteInitiative("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });

  describe("createInitiative:", () => {
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
      const chk = await createInitiative(
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
      expect(modelToCreate.item.type).toBe("Hub Initiative");
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
      const chk = await createInitiative(
        {
          name: "Hello World",
          slug: "dcdev|hello-world", // important for coverage
          description: "my desc",
          orgUrlKey: "dcdev",
          status: HubEntityStatus.inProgress,
        },
        { authentication: MOCK_AUTH }
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      expect(chk.typeKeywords).toEqual([
        "Hub Initiative",
        "slug|dcdev|hello-world",
        "status|inProgress",
        "cannotDiscuss",
      ]);
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

  describe("updateInitiative: ", () => {
    it("updates backing model", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(INITIATIVE_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
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
        catalog: {
          schemaVersion: 0,
        },
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        typeKeywords: [],
      };
      const chk = await updateInitiative(prj, { authentication: MOCK_AUTH });
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

  describe("enrichments:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchItemEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          data: {
            status: "active",
          },
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });
    it("converts item to search result", async () => {
      const chk = await enrichInitiativeSearchResult(
        cloneObject(INITIATIVE_ITEM_ENRICH),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const ITM = cloneObject(INITIATIVE_ITEM_ENRICH);
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
      expect(chk.family).toEqual("initiative");
      expect(chk.links?.self).toEqual(
        `https://some-server.com/gis/home/item.html?id=${ITM.id}`
      );
      expect(chk.links?.siteRelative).toEqual(`/content/${ITM.id}`);
      expect(chk.links?.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${ITM.thumbnail}`
      );
    });
    it("uses snippet if defined", async () => {
      const itm = cloneObject(INITIATIVE_ITEM_ENRICH);
      itm.snippet = "This should be used";
      const chk = await enrichInitiativeSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });
    it("fetches enrichments", async () => {
      const chk = await enrichInitiativeSearchResult(
        cloneObject(INITIATIVE_ITEM_ENRICH),
        ["data.status AS projectStatus"],
        hubRo
      );

      // verify the response
      expect(chk.projectStatus).toBe("active");

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(INITIATIVE_ITEM_ENRICH);
      expect(enrichments).toEqual(["data"]);
      expect(ro).toBe(hubRo);
    });
  });

  describe("query getters", () => {
    let fixture: IHubInitiative;
    beforeEach(() => {
      // Minimal structure needed for these tests
      fixture = {
        name: "Fixture Initiative",
        id: "00f",
        catalog: {
          schemaVersion: 1,
          scopes: {
            item: {
              targetEntity: "item",
              filters: [
                {
                  predicates: [
                    {
                      group: ["00c", "aa1"],
                    },
                  ],
                },
              ],
            },
          },
        },
      } as unknown as IHubInitiative;
    });
    it("getAssociatedProjectsQuery", () => {
      const chk = getAcceptedProjectsQuery(fixture);
      expect(chk.targetEntity).toBe("item");
      // ensure we have type and keyword in predicate
      expect(verifyPredicate(chk, { type: "Hub Project" })).toBeTruthy();
      expect(
        verifyPredicate(chk, { typekeywords: "initiative|00f" })
      ).toBeTruthy("should have keyword");
      expect(getPredicateValue(chk, { group: null })).toEqual(["00c", "aa1"]);
    });
    it("getConnectedProjectsQuery", () => {
      const chk = getPendingProjectsQuery(fixture);
      expect(chk.targetEntity).toBe("item");
      // ensure we have type and keyword in predicate
      expect(verifyPredicate(chk, { type: "Hub Project" })).toBeTruthy();
      expect(
        verifyPredicate(chk, { typekeywords: "initiative|00f" })
      ).toBeTruthy("should have keyword");
      expect(getPredicateValue(chk, { group: null })).toEqual({
        any: [],
        all: [],
        not: ["00c", "aa1"],
      });
    });
    // it("getUnConnectedProjectsQuery", () => {
    //   const chk = getUnConnectedProjectsQuery(fixture);
    //   expect(chk.targetEntity).toBe("item");
    //   // ensure we have type and keyword in predicate
    //   expect(verifyPredicate(chk, { type: "Hub Project" })).toBeTruthy();

    //   expect(getPredicateValue(chk, { typekeywords: null })).toEqual(
    //     {
    //       not: ["initiative|00f"],
    //     },
    //     "should have negated keyword"
    //   );
    //   expect(getPredicateValue(chk, { group: null })).toEqual({
    //     any: [],
    //     all: [],
    //     not: ["00c", "aa1"],
    //   });
    // });
  });

  describe("fetchAccepted:", () => {
    let searchSpy: jasmine.Spy;
    let fixture: IHubInitiative;
    beforeEach(() => {
      searchSpy = spyOn(
        require("../../src/search/_internal/portalSearchItems"),
        "portalSearchItemsAsItems"
      ).and.callFake(() =>
        Promise.resolve({
          results: [
            {
              id: "3ef",
              title: "fake result",
              type: "Hub Project",
              tags: ["fake"],
            },
          ],
        })
      );
      // Minimal structure needed for these tests
      fixture = {
        name: "Fixture Initiative",
        id: "00f",
        catalog: {
          schemaVersion: 1,
          scopes: {
            item: {
              targetEntity: "item",
              filters: [
                {
                  predicates: [
                    {
                      group: ["00c", "aa1"],
                    },
                  ],
                },
              ],
            },
          },
        },
      } as unknown as IHubInitiative;
    });
    it("fetches associated projects", async () => {
      const chk = await fetchAcceptedProjects(fixture, MOCK_AUTH);
      expect(searchSpy).toHaveBeenCalled();
      // get the query
      const qry = searchSpy.calls.argsFor(0)[0];
      // this should have the groups in the predicate
      expect(getPredicateValue(qry, { group: null })).toEqual(["00c", "aa1"]);
      expect(chk.length).toBe(1);
      // verify conversion
      expect(chk[0]).toEqual({
        id: "3ef",
        name: "fake result",
        type: "Hub Project",
      });
    });
    it("fetches pending projects", async () => {
      const chk = await fetchPendingProjects(fixture, MOCK_AUTH);
      expect(searchSpy).toHaveBeenCalled();
      // get the query
      const qry = searchSpy.calls.argsFor(0)[0];
      // this should have the negated groups in the predicate
      expect(getPredicateValue(qry, { group: null })).toEqual({
        any: [],
        all: [],
        not: ["00c", "aa1"],
      });
      expect(chk.length).toBe(1);
      // verify conversion
      expect(chk[0]).toEqual({
        id: "3ef",
        name: "fake result",
        type: "Hub Project",
      });
    });
    // ALTHOUGH WE DON"T CURRENTLY HAVE A UX THAT NEEDS THIS
    // THERE IS SOME DISCUSSION ABOUT IT BEING USEFUL SO I'M LEAVING
    // THE CODE HERE, COMMENTED.
    // it("fetches unconnected projects", async () => {
    //   const chk = await fetchUnConnectedProjects(fixture, MOCK_AUTH);
    //   expect(searchSpy).toHaveBeenCalled();
    //   // get the query
    //   const qry = searchSpy.calls.argsFor(0)[0];
    //   // this should have the negated groups in the predicate
    //   expect(getPredicateValue(qry, { group: null })).toEqual({
    //     any: [],
    //     all: [],
    //     not: ["00c", "aa1"],
    //   });
    //   expect(getPredicateValue(qry, { typekeywords: null })).toEqual(
    //     {
    //       not: ["initiative|00f"],
    //     },
    //     "should have negated keyword"
    //   );
    //   expect(chk.length).toBe(1);
    //   // verify conversion
    //   expect(chk[0]).toEqual({
    //     id: "3ef",
    //     name: "fake result",
    //     type: "Hub Project",
    //   });
    // });
  });
});

/**
 * Helper to verify that a predicate exists in a query
 * NOTE: This is NOT comprehensive!
 * @param query
 * @param expectedPredicate
 */
function verifyPredicate(query: IQuery, expectedPredicate: IPredicate) {
  if (Object.keys(expectedPredicate).length > 1) {
    throw new Error(
      `verifyPredicate helper expects to check a single prop on the predicate.`
    );
  }
  // iterate the filtes in the query, looking for a predicate that has the prop + value
  let present = false;
  query.filters.forEach((filter) => {
    filter.predicates.forEach((predicate) => {
      // iterate the props on expected, and check if this predicate has the prop + value
      Object.keys(expectedPredicate).forEach((key) => {
        if (Array.isArray(predicate[key])) {
          present = compareArrays(predicate[key], expectedPredicate[key]);
          // compare arrays
        } else {
          // tslint:disable-next-line
          if (predicate[key] == expectedPredicate[key]) {
            present = true;
          }
        }
      });
    });
  });
  return present;
}

function getPredicateValue(query: IQuery, expectedPredicate: IPredicate): any {
  let result: any;
  query.filters.forEach((filter) => {
    filter.predicates.forEach((predicate) => {
      // iterate the props on expected, and check if this predicate has the prop + value
      Object.keys(expectedPredicate).forEach((key) => {
        if (predicate[key]) {
          result = predicate[key];
        }
      });
    });
  });
  return result;
}

const compareArrays = (a: any[], b: any[]) =>
  // tslint:disable-next-line
  a.length === b.length && a.every((element, index) => element == b[index]);
