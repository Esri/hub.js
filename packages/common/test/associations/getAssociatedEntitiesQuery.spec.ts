import { describe, it, expect, vi } from "vitest";
import { getAssociatedEntitiesQuery } from "../../src/associations/getAssociatedEntitiesQuery";
import { MOCK_PARENT_ENTITY } from "./fixtures";
import * as AssociationsModule from "../../src/associations/internal/getIncludesAndReferencesQuery";
import { IArcGISContext } from "../../src/types/IArcGISContext";

describe("getAssociatedEntitiesQuery:", () => {
  it("delegates to getIncludesAndReferencesQuery", async () => {
    const spy = vi
      .spyOn(AssociationsModule, "getIncludesAndReferencesQuery")
      .mockResolvedValue(undefined as any);

    await getAssociatedEntitiesQuery(MOCK_PARENT_ENTITY, "project", {
      requestOptions: {},
    } as IArcGISContext);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(MOCK_PARENT_ENTITY, "project", true, {
      requestOptions: {},
    } as IArcGISContext);

    spy.mockRestore();
  });

  it("throws an error if the association is not supported", async () => {
    await expect(
      getAssociatedEntitiesQuery(MOCK_PARENT_ENTITY, "group", {
        requestOptions: {},
      } as IArcGISContext)
    ).rejects.toEqual(
      new Error(
        "getAssociatedEntitiesQuery: Association between initiative and group is not supported."
      )
    );
  });
});
