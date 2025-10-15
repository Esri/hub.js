import { HubEntity } from "../../src/core/types/HubEntity";
import { getReferencedEntityIds } from "../../src/associations/getReferencedEntityIds";
import * as GetIdsFromKeywordsModule from "../../src/associations/internal/getIdsFromKeywords";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("getReferencedEntityIds", () => {
  let getIdsFromKeywordsSpy: any;

  beforeEach(() => {
    getIdsFromKeywordsSpy = vi
      .spyOn(GetIdsFromKeywordsModule, "getIdsFromKeywords")
      .mockReturnValue([] as any);
  });

  it("delegates to getIdsFromKeywords", () => {
    const entity = { id: "00c", typeKeywords: [] } as unknown as HubEntity;
    const associationType = "initiative";

    getReferencedEntityIds(entity, associationType);
    expect(getIdsFromKeywordsSpy).toHaveBeenCalledWith(entity, associationType);
  });
});
