import { HubEntity } from "../../src/core/types";
import { getReferencedEntityIds } from "../../src/associations/getReferencedEntityIds";
import * as GetIdsFromKeywordsModule from "../../src/associations/internal/getIdsFromKeywords";

describe("getReferencedEntityIds", () => {
  let getIdsFromKeywordsSpy: jasmine.Spy;

  beforeEach(() => {
    getIdsFromKeywordsSpy = spyOn(
      GetIdsFromKeywordsModule,
      "getIdsFromKeywords"
    ).and.returnValue([]);
  });
  it("delegates to getIdsFromKeywords", () => {
    const entity = { id: "00c", typeKeywords: [] } as unknown as HubEntity;
    const associationType = "initiative";

    getReferencedEntityIds(entity, associationType);
    expect(getIdsFromKeywordsSpy).toHaveBeenCalledWith(entity, associationType);
  });
});
