import { IArcGISContext } from "../../../src/ArcGISContext";
import { getIncludesDoesNotReferenceQuery } from "../../../src/associations/internal/getIncludesDoesNotReferenceQuery";
import { MOCK_PARENT_ENTITY, MOCK_CHILD_ENTITY } from "../fixtures";
import * as ItemsModule from "@esri/arcgis-rest-portal";

describe("getIncludesDoesNotReferenceQuery:", () => {
  describe("from the parent entity perspective", () => {
    it("returns a valid IQuery to fetch child entities", async () => {
      const query = await getIncludesDoesNotReferenceQuery(
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
                typekeywords: { not: ["ref|initiative|parent-00a"] },
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
          admin: [{ id: "group-00a", typeKeywords: ["initiative|parent-00b"] }],
          member: [{ id: "group-00b", typeKeywords: [] }],
          other: [{ id: "group-00c", typeKeywords: ["initiative|parent-00c"] }],
        })
      );
      const query = await getIncludesDoesNotReferenceQuery(
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
                id: ["parent-00b", "parent-00c"],
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
      const query = await getIncludesDoesNotReferenceQuery(
        MOCK_CHILD_ENTITY,
        "initiative",
        false,
        { requestOptions: {} } as IArcGISContext
      );

      expect(query).toBeNull();
    });
  });
});
