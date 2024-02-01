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
  it("returns an array of ids for the association keywords of a specific association type", () => {
    const ids = getIdsFromKeywords(
      {
        typeKeywords: ["someKeyword", "ref|initiative|00c"],
      } as unknown as HubEntity,
      "initiative"
    );
    expect(ids.length).toBe(1);
    expect(ids[0]).toBe("00c");
  });
  it("returns an array of ids for ALL association keywords if no association type is provided", () => {
    const ids = getIdsFromKeywords({
      typeKeywords: [
        "someKeyword",
        "ref|some-type-a|00c",
        "ref|some-type-b|00d",
      ],
    } as unknown as HubEntity);
    expect(ids.length).toBe(2);
    expect(ids[0]).toBe("00c");
    expect(ids[1]).toBe("00d");
  });
});
