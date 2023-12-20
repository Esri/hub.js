import { IGroup } from "@esri/arcgis-rest-types";
import { getIdsFromAssociationGroups } from "../../../src/associations/internal/getIdsFromAssociationGroups";

describe("getIdsFromAssociationGroups:", () => {
  it("returns an empty array if no groups are passed", () => {
    const ids = getIdsFromAssociationGroups([], "initiative");
    expect(ids.length).toBe(0);
  });
  it("returns an empty array if no association groups are passed", () => {
    const ids = getIdsFromAssociationGroups(
      [{ id: "00c", typeKeywords: ["someKeyword"] }] as unknown as IGroup[],
      "initiative"
    );
    expect(ids.length).toBe(0);
  });
  it("returns an array of ids for association groups", () => {
    const ids = getIdsFromAssociationGroups(
      [
        { id: "00a", typeKeywords: ["someKeyword"] },
        { id: "00b", typeKeywords: ["something", "initiative|00c"] },
      ] as unknown as IGroup[],
      "initiative"
    );

    expect(ids.length).toBe(1);
    expect(ids[0]).toBe("00c");
  });
});
