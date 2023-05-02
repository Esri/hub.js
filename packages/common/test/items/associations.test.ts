import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubInitiative, IHubItemEntity } from "../../src";
import {
  addAssociation,
  fetchApprovedProjects,
  fetchAssociatedInitiatives,
  fetchAssociatedProjects,
  getAssociatedProjectsQuery,
  listAssociations,
  removeAssociation,
} from "../../src/items/associations";
import * as portal from "@esri/arcgis-rest-portal";
import { IHubProject } from "../../dist/types/core/types/IHubProject";
import { IQuery } from "../../dist/types/search/types/IHubCatalog";

describe("item associations:", () => {
  describe("addAssociation:", () => {
    it("adds the typekeyword", () => {
      const entity = {
        typeKeywords: [],
      } as unknown as IHubItemEntity;
      addAssociation({ type: "initiative", id: "123" }, entity);
      expect(entity.typeKeywords).toEqual(["initiative|123"]);
    });

    it("works if keyword already present", () => {
      const entity = {
        typeKeywords: ["initiative|123"],
      } as unknown as IHubItemEntity;
      addAssociation({ type: "initiative", id: "123" }, entity);
      expect(entity.typeKeywords).toEqual(["initiative|123"]);
    });

    it("adds the typekeywords if not present", () => {
      const entity = {} as unknown as IHubItemEntity;
      addAssociation({ type: "initiative", id: "123" }, entity);
      expect(entity.typeKeywords).toEqual(["initiative|123"]);
    });
  });

  describe("removeAssociation:", () => {
    it("removes the keyword if present", () => {
      const entity = {
        typeKeywords: ["other", "initiative|123"],
      } as unknown as IHubItemEntity;
      removeAssociation({ type: "initiative", id: "123" }, entity);
      expect(entity.typeKeywords).toEqual(["other"]);
    });

    it("works if keyword not present", () => {
      const entity = {
        typeKeywords: ["other"],
      } as unknown as IHubItemEntity;
      removeAssociation({ type: "initiative", id: "123" }, entity);
      expect(entity.typeKeywords).toEqual(["other"]);
    });

    it("works if keywords not present", () => {
      const entity = {} as unknown as IHubItemEntity;
      removeAssociation({ type: "initiative", id: "123" }, entity);
      expect(entity.typeKeywords).not.toBeDefined();
    });
  });

  describe("listAssociations:", () => {
    it("returns empty array if no keywords prop", () => {
      const entity = {} as unknown as IHubItemEntity;
      const list = listAssociations(entity, "initiative");
      expect(list).toBeDefined();
      expect(list.length).toBe(0);
    });

    it("returns empty array if none found", () => {
      const entity = {
        typeKeywords: ["other"],
      } as unknown as IHubItemEntity;
      const list = listAssociations(entity, "initiative");
      expect(list).toBeDefined();
      expect(list.length).toBe(0);
    });

    it("returns all entries", () => {
      const entity = {
        typeKeywords: ["other", "initiative|00c", "initiative|00d"],
      } as unknown as IHubItemEntity;
      const list = listAssociations(entity, "initiative");
      expect(list).toBeDefined();
      expect(list.length).toBe(2);
      expect(list[0].id).toBe("00c");
      expect(list[1].id).toBe("00d");
    });
  });

  describe("get queries", () => {
    it("returns associated projects query object", () => {
      const init = {
        id: "00c",
      } as unknown as IHubInitiative;
      const chk = getAssociatedProjectsQuery(init);
      expect(chk).toBeDefined();
      const pred = chk.filters[0].predicates[0];
      expect(pred).toBeDefined();
      expect(pred.type).toBe("Hub Project");
      expect(pred.typekeywords).toBe(`initiative|00c`);
    });
  });

  describe("fetch functions: ", () => {
    let searchItemsSpy: jasmine.Spy;

    it("fetches associated projects", async () => {
      searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            {
              id: "00c",
              title: "Project 1",
              type: "Hub Project",
              typeKeywords: ["initiative|001"],
            },
            {
              id: "00b",
              title: "Project 2",
              type: "Hub Project",
              typeKeywords: ["initiative|001"],
            },
            {
              id: "00e",
              title: "Project 3",
              type: "Hub Project",
              typeKeywords: ["initiative|001"],
            },
          ],
        })
      );

      const init = { id: "001" } as unknown as IHubInitiative;
      const chk = await fetchAssociatedProjects(
        init,
        {} as unknown as IRequestOptions
      );
      expect(chk).toBeDefined();
      expect(chk.length).toBe(3);
      expect(chk[0].id).toBe("00c");
      expect(chk[1].id).toBe("00b");
      expect(chk[2].id).toBe("00e");
    });

    it("fetches associated initiatives", async () => {
      searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            {
              id: "c01",
              title: "Initiative 1",
              type: "Hub Initiative",
              typeKeywords: [],
            },
            {
              id: "c02",
              title: "Initiative 2",
              type: "Hub Initiative",
              typeKeywords: [],
            },
          ],
        })
      );
      const project = {
        typeKeywords: ["initiative|c01", "initiative|c02"],
      } as unknown as IHubProject;
      const chk = await fetchAssociatedInitiatives(
        project,
        {} as unknown as IRequestOptions
      );
      expect(chk).toBeDefined();
      expect(chk.length).toBe(2);
      expect(chk[0].id).toBe("c01");
      expect(chk[1].id).toBe("c02");
    });

    it("early return if no initiatives associated", async () => {
      const project = {
        typeKeywords: [],
      } as unknown as IHubProject;
      const chk = await fetchAssociatedInitiatives(
        project,
        {} as unknown as IRequestOptions
      );
      expect(chk).toBeDefined();
      expect(chk.length).toBe(0);
    });

    it("fetches approved projects", async () => {
      searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            {
              id: "00b",
              title: "Project 2",
              type: "Hub Project",
              typeKeywords: ["initiative|001"],
            },
          ],
        })
      );

      const init = {
        id: "001",
        catalog: {
          collections: [
            {
              key: "projects",
              scope: {
                targetEntity: "item",
                filters: [
                  {
                    operation: "AND",
                    predicates: [
                      {
                        type: "Hub Project",
                        group: ["ff2", "001"],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      } as unknown as IHubInitiative;

      const chk = await fetchApprovedProjects(
        init,
        {} as unknown as IRequestOptions
      );
      expect(chk).toBeDefined();
      expect(chk.length).toBe(1);
      const args = searchItemsSpy.calls.argsFor(0);

      const q = args[0].q;
      expect(q).toEqual(
        '(type:"Hub Project" AND typekeywords:"initiative|001") AND (type:"Hub Project" AND (group:"ff2" OR group:"001"))'
      );
    });

    it("fetches approved projects: no project collection", async () => {
      searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            {
              id: "00b",
              title: "Project 2",
              type: "Hub Project",
              typeKeywords: ["initiative|001"],
            },
          ],
        })
      );

      const init = {
        id: "001",
        catalog: {
          collections: [],
        },
      } as unknown as IHubInitiative;

      const chk = await fetchApprovedProjects(
        init,
        {} as unknown as IRequestOptions
      );
      expect(chk).toBeDefined();
      expect(chk.length).toBe(1);
      const args = searchItemsSpy.calls.argsFor(0);

      const q = args[0].q;
      expect(q).toEqual(
        '(type:"Hub Project" AND typekeywords:"initiative|001")'
      );
    });
    it("fetches approved projects: with query", async () => {
      searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            {
              id: "00b",
              title: "Project 2",
              type: "Hub Project",
              typeKeywords: ["initiative|001"],
            },
          ],
        })
      );

      const init = {
        id: "001",
        catalog: {
          collections: [],
        },
      } as unknown as IHubInitiative;

      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                owner: "dbouwman",
              },
            ],
          },
        ],
      };

      const chk = await fetchApprovedProjects(
        init,
        {} as unknown as IRequestOptions,
        qry
      );
      expect(chk).toBeDefined();
      expect(chk.length).toBe(1);
      const args = searchItemsSpy.calls.argsFor(0);

      const q = args[0].q;
      expect(q).toEqual(
        '(type:"Hub Project" AND typekeywords:"initiative|001") AND (owner:"dbouwman")'
      );
    });
  });
});
