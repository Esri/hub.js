import { describe, it, expect, vi, afterEach } from "vitest";
import { getIncludesAndReferencesQuery } from "../../../src/associations/internal/getIncludesAndReferencesQuery";
import type { HubEntity } from "../../../src/core/types/HubEntity";
import type { IArcGISContext } from "../../../src/types/IArcGISContext";
import { cloneObject } from "../../../src/util";
import { MOCK_PARENT_ENTITY, MOCK_CHILD_ENTITY } from "../fixtures";
import * as ItemsModule from "@esri/arcgis-rest-portal";

vi.mock("@esri/arcgis-rest-portal");

describe("getIncludesAndReferencesQuery:", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe("from the parent entity perspective", () => {
    it("returns null if the parent's association group hasn't been created yet", async () => {
      const query = await getIncludesAndReferencesQuery(
        {} as HubEntity,
        "project",
        true,
        {} as IArcGISContext
      );

      expect(query).toBeNull();
    });
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
      const getItemGroupsSpy = vi
        .spyOn(ItemsModule, "getItemGroups")
        .mockReturnValue(
          Promise.resolve({
            admin: [
              { id: "group-00a", typeKeywords: ["initiative|parent-00a"] },
            ],
            member: [{ id: "group-00b", typeKeywords: [] }],
            other: [
              { id: "group-00c", typeKeywords: ["initiative|parent-00b"] },
            ],
          } as any)
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
      vi.spyOn(ItemsModule, "getItemGroups").mockReturnValue(
        Promise.resolve({ admin: [], member: [], other: [] })
      );
      const query = await getIncludesAndReferencesQuery(
        MOCK_CHILD_ENTITY,
        "initiative" as any,
        false,
        { requestOptions: {} } as IArcGISContext
      );

      expect(query).toBeNull();
    });
    it("returns null when the child does not 'reference' any parents", async () => {
      vi.spyOn(ItemsModule, "getItemGroups").mockReturnValue(
        Promise.resolve({
          admin: [{ id: "group-00a", typeKeywords: ["initiative|parent-00a"] }],
          member: [],
          other: [],
        } as any)
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
