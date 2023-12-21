import { cloneObject } from "../../../src";
import { IArcGISContext } from "../../../src/ArcGISContext";
import { getIncludesAndReferencesQuery } from "../../../src/associations/internal/getIncludesAndReferencesQuery";
import { MOCK_PARENT_ENTITY, MOCK_CHILD_ENTITY } from "../fixtures";
import * as ItemsModule from "@esri/arcgis-rest-portal";

describe("getIncludesAndReferencesQuery:", () => {
  describe("from the parent entity perspective", () => {
    it("returns a valid IQuery to fetch child entities", async () => {
      const query = await getIncludesAndReferencesQuery(
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
            predicates: [{ group: "group-00a" }],
          },
        ],
      });
    });
  });
  describe("from the child entity perspective", () => {
    it("returns a valid IQuery to fetch parent entities", async () => {
      const getItemGroupsSpy = spyOn(
        ItemsModule,
        "getItemGroups"
      ).and.returnValue(
        Promise.resolve({
          admin: [{ id: "group-00a", typeKeywords: ["initiative|parent-00a"] }],
          member: [{ id: "group-00b", typeKeywords: [] }],
          other: [{ id: "group-00c", typeKeywords: ["initiative|parent-00b"] }],
        })
      );
      const query = await getIncludesAndReferencesQuery(
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
    it("returns null when the child is not 'included' by any parents", async () => {
      spyOn(ItemsModule, "getItemGroups").and.returnValue(
        Promise.resolve({ admin: [], member: [], other: [] })
      );
      const query = await getIncludesAndReferencesQuery(
        MOCK_CHILD_ENTITY,
        "initiative",
        false,
        { requestOptions: {} } as IArcGISContext
      );

      expect(query).toBeNull();
    });
    it("returns null when the child does not 'reference' any parents", async () => {
      spyOn(ItemsModule, "getItemGroups").and.returnValue(
        Promise.resolve({
          admin: [{ id: "group-00a", typeKeywords: ["initiative|parent-00a"] }],
          member: [],
          other: [],
        })
      );
      const child = cloneObject(MOCK_CHILD_ENTITY);
      child.typeKeywords = [];
      const query = await getIncludesAndReferencesQuery(
        child,
        "initiative",
        false,
        { requestOptions: {} } as IArcGISContext
      );

      expect(query).toBeNull();
    });
  });
});
