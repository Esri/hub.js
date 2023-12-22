import { IArcGISContext } from "../../src";
import { getAssociatedEntitiesQuery } from "../../src/associations/getAssociatedEntitiesQuery";
import { MOCK_PARENT_ENTITY } from "./fixtures";
import * as AssociationsModule from "../../src/associations/internal/getIncludesAndReferencesQuery";

describe("getAssociatedEntitiesQuery:", () => {
  it("delegates to getIncludesAndReferencesQuery", async () => {
    const getIncludesAndReferencesQuerySpy = spyOn(
      AssociationsModule,
      "getIncludesAndReferencesQuery"
    ).and.returnValue(Promise.resolve());
    await getAssociatedEntitiesQuery(MOCK_PARENT_ENTITY, "project", {
      requestOptions: {},
    } as IArcGISContext);

    expect(getIncludesAndReferencesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getIncludesAndReferencesQuerySpy).toHaveBeenCalledWith(
      MOCK_PARENT_ENTITY,
      "project",
      true,
      { requestOptions: {} } as IArcGISContext
    );
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await getAssociatedEntitiesQuery(MOCK_PARENT_ENTITY, "group", {
        requestOptions: {},
      } as IArcGISContext);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "getAssociatedEntitiesQuery: Association between initiative and group is not supported."
        )
      );
    }
  });
});
