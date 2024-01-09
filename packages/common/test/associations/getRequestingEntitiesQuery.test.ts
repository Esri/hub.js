import { IArcGISContext } from "../../src";
import { getRequestingEntitiesQuery } from "../../src/associations/getRequestingEntitiesQuery";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import * as getIncludesDoesNotReferenceQueryModule from "../../src/associations/internal/getIncludesDoesNotReferenceQuery";
import * as getReferencesDoesNotIncludeQueryModule from "../../src/associations/internal/getReferencesDoesNotIncludeQuery";

describe("getRequestingEntitiesQuery:", () => {
  it("delegates to getReferencesDoesNotIncludeQuery for parents", async () => {
    const getReferencesDoesNotIncludeQuerySpy = spyOn(
      getReferencesDoesNotIncludeQueryModule,
      "getReferencesDoesNotIncludeQuery"
    ).and.returnValue(Promise.resolve());
    await getRequestingEntitiesQuery(MOCK_PARENT_ENTITY, "project", {
      requestOptions: {},
    } as IArcGISContext);

    expect(getReferencesDoesNotIncludeQuerySpy).toHaveBeenCalledTimes(1);
    expect(getReferencesDoesNotIncludeQuerySpy).toHaveBeenCalledWith(
      MOCK_PARENT_ENTITY,
      "project",
      true,
      { requestOptions: {} } as IArcGISContext
    );
  });
  it("delegates to getIncludesDoesNotReferenceQuery for children", async () => {
    const getIncludesDoesNotReferenceQuerySpy = spyOn(
      getIncludesDoesNotReferenceQueryModule,
      "getIncludesDoesNotReferenceQuery"
    ).and.returnValue(Promise.resolve());
    await getRequestingEntitiesQuery(MOCK_CHILD_ENTITY, "initiative", {
      requestOptions: {},
    } as IArcGISContext);

    expect(getIncludesDoesNotReferenceQuerySpy).toHaveBeenCalledTimes(1);
    expect(getIncludesDoesNotReferenceQuerySpy).toHaveBeenCalledWith(
      MOCK_CHILD_ENTITY,
      "initiative",
      false,
      { requestOptions: {} } as IArcGISContext
    );
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await getRequestingEntitiesQuery(MOCK_PARENT_ENTITY, "group", {
        requestOptions: {},
      } as IArcGISContext);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "getRequestingEntitiesQuery: Association between initiative and group is not supported."
        )
      );
    }
  });
});
