import { cloneObject } from "../../../src";
import { IArcGISContext } from "../../../src/ArcGISContext";
import { getReferencesDoesNotIncludeQuery } from "../../../src/associations/internal/getReferencesDoesNotIncludeQuery";
import { MOCK_PARENT_ENTITY, MOCK_CHILD_ENTITY } from "../fixtures";
import * as ItemsModule from "@esri/arcgis-rest-portal";

describe("getReferencesDoesNotIncludeQuery:", () => {
  describe("from the parent entity perspective", () => {
    it("returns a valid IQuery to fetch child entities", async () => {
      const query = await getReferencesDoesNotIncludeQuery(
        MOCK_PARENT_ENTITY,
        "project",
        true,
        {} as IArcGISContext
      );

      expect(query).toEqual({
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: ["Hub Project"],
                typekeywords: ["ref|initiative|parent-00a"],
              },
            ],
          },
          {
            predicates: [{ group: { not: ["group-00a"], any: [], all: [] } }],
          },
        ],
      });
    });
  });
  describe("from the child entity perspective", () => {
    let getItemGroupsSpy: jasmine.Spy;
    beforeEach(() => {
      getItemGroupsSpy = spyOn(ItemsModule, "getItemGroups").and.returnValue(
        Promise.resolve({
          admin: [{ id: "group-00a", typeKeywords: ["initiative|parent-00b"] }],
          member: [{ id: "group-00b", typeKeywords: [] }],
          other: [{ id: "group-00c", typeKeywords: ["initiative|parent-00c"] }],
        })
      );
    });
    afterEach(() => {
      getItemGroupsSpy.calls.reset();
    });

    it("returns a valid IQuery to fetch parent entities", async () => {
      const query = await getReferencesDoesNotIncludeQuery(
        MOCK_CHILD_ENTITY,
        "initiative",
        false,
        { requestOptions: {} } as IArcGISContext
      );

      expect(getItemGroupsSpy).toHaveBeenCalledTimes(1);
      expect(getItemGroupsSpy).toHaveBeenCalledWith("child-00a", {});
      expect(query).toEqual({
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: ["Hub Initiative"],
                id: ["parent-00a"],
              },
            ],
          },
        ],
      });
    });
    it("returns null when the child doesn't reference any parents", async () => {
      const child = cloneObject(MOCK_CHILD_ENTITY);
      child.typeKeywords = [];
      const query = await getReferencesDoesNotIncludeQuery(
        child,
        "initiative",
        false,
        { requestOptions: {} } as IArcGISContext
      );

      expect(query).toBeNull();
    });
  });
});
