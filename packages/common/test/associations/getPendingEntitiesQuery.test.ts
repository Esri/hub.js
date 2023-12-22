import { IArcGISContext } from "../../src";
import { getPendingEntitiesQuery } from "../../src/associations/getPendingEntitiesQuery";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import * as getIncludesDoesNotReferenceQueryModule from "../../src/associations/internal/getIncludesDoesNotReferenceQuery";
import * as getReferencesDoesNotIncludeQueryModule from "../../src/associations/internal/getReferencesDoesNotIncludeQuery";

describe("getPendingEntitiesQuery:", () => {
  it("delegates to getIncludesDoesNotReferenceQuery for parents", async () => {
    const getIncludesDoesNotReferenceQuerySpy = spyOn(
      getIncludesDoesNotReferenceQueryModule,
      "getIncludesDoesNotReferenceQuery"
    ).and.returnValue(Promise.resolve());
    await getPendingEntitiesQuery(MOCK_PARENT_ENTITY, "project", {
      requestOptions: {},
    } as IArcGISContext);

    expect(getIncludesDoesNotReferenceQuerySpy).toHaveBeenCalledTimes(1);
    expect(getIncludesDoesNotReferenceQuerySpy).toHaveBeenCalledWith(
      MOCK_PARENT_ENTITY,
      "project",
      true,
      { requestOptions: {} } as IArcGISContext
    );
  });
  it("delegates to getReferencesDoesNotIncludeQuery for children", async () => {
    const getReferencesDoesNotIncludeQuerySpy = spyOn(
      getReferencesDoesNotIncludeQueryModule,
      "getReferencesDoesNotIncludeQuery"
    ).and.returnValue(Promise.resolve());
    await getPendingEntitiesQuery(MOCK_CHILD_ENTITY, "initiative", {
      requestOptions: {},
    } as IArcGISContext);

    expect(getReferencesDoesNotIncludeQuerySpy).toHaveBeenCalledTimes(1);
    expect(getReferencesDoesNotIncludeQuerySpy).toHaveBeenCalledWith(
      MOCK_CHILD_ENTITY,
      "initiative",
      false,
      { requestOptions: {} } as IArcGISContext
    );
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await getPendingEntitiesQuery(MOCK_PARENT_ENTITY, "group", {
        requestOptions: {},
      } as IArcGISContext);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "getPendingEntitiesQuery: Association between initiative and group is not supported."
        )
      );
    }
  });
});
