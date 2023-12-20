import { HubEntity } from "../../../src";
import { getIdsFromKeywords } from "../../../src/associations/internal/getIdsFromKeywords";

describe("getIdsFromKeywords", () => {
  it("returns an empty array if no keywords are passed", () => {
    const ids = getIdsFromKeywords(
      { typeKeywords: [] } as unknown as HubEntity,
      "initiative"
    );
    expect(ids.length).toBe(0);
  });
  it("returns an empty array if no association keywords are passed", () => {
    const ids = getIdsFromKeywords(
      { typeKeywords: ["someKeyword"] } as unknown as HubEntity,
      "initiative"
    );
    expect(ids.length).toBe(0);
  });
  it("returns an array of ids for association keywords", () => {
    const ids = getIdsFromKeywords(
      {
        typeKeywords: ["someKeyword", "ref|initiative|00c"],
      } as unknown as HubEntity,
      "initiative"
    );
    expect(ids.length).toBe(1);
    expect(ids[0]).toBe("00c");
  });
});
