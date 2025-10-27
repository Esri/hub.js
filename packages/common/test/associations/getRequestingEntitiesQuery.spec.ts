import { describe, it, expect, vi } from "vitest";
import { getRequestingEntitiesQuery } from "../../src/associations/getRequestingEntitiesQuery";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import * as getIncludesDoesNotReferenceQueryModule from "../../src/associations/internal/getIncludesDoesNotReferenceQuery";
import * as getReferencesDoesNotIncludeQueryModule from "../../src/associations/internal/getReferencesDoesNotIncludeQuery";
import { IArcGISContext } from "../../src/types/IArcGISContext";

describe("getRequestingEntitiesQuery:", () => {
  it("delegates to getReferencesDoesNotIncludeQuery for parents", async () => {
    const spy = vi
      .spyOn(
        getReferencesDoesNotIncludeQueryModule,
        "getReferencesDoesNotIncludeQuery"
      )
      .mockResolvedValue(undefined as any);

    await getRequestingEntitiesQuery(MOCK_PARENT_ENTITY, "project", {
      requestOptions: {},
    } as IArcGISContext);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(MOCK_PARENT_ENTITY, "project", true, {
      requestOptions: {},
    } as IArcGISContext);

    spy.mockRestore();
  });

  it("delegates to getIncludesDoesNotReferenceQuery for children", async () => {
    const spy = vi
      .spyOn(
        getIncludesDoesNotReferenceQueryModule,
        "getIncludesDoesNotReferenceQuery"
      )
      .mockResolvedValue(undefined as any);

    await getRequestingEntitiesQuery(MOCK_CHILD_ENTITY, "initiative", {
      requestOptions: {},
    } as IArcGISContext);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(MOCK_CHILD_ENTITY, "initiative", false, {
      requestOptions: {},
    } as IArcGISContext);

    spy.mockRestore();
  });

  it("throws an error if the association is not supported", async () => {
    await expect(
      getRequestingEntitiesQuery(MOCK_PARENT_ENTITY, "group", {
        requestOptions: {},
      } as IArcGISContext)
    ).rejects.toEqual(
      new Error(
        "getRequestingEntitiesQuery: Association between initiative and group is not supported."
      )
    );
  });
});
