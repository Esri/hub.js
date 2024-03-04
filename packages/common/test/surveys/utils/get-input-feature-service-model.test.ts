import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../../test-helpers/fake-user-session";
import * as FieldworkerItem from "../../mocks/items/fieldworker-item.json";
import { getInputFeatureServiceModel } from "../../../src/surveys/utils/get-input-feature-service-model";

describe("getInputFeatureServiceModel", () => {
  let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;

  beforeEach(() => {
    getRelatedItemsResponse = {
      total: 1,
      relatedItems: [FieldworkerItem],
    };
  });

  it("should resolve undefined when getRelatedItems returns no related items", async function () {
    getRelatedItemsResponse.relatedItems.splice(0, 1);
    const getRelatedItemsSpy = spyOn(
      restPortal,
      "getRelatedItems"
    ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getInputFeatureServiceModel("123", mockUserSession);
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
      {
        id: "123",
        relationshipType: "Survey2Service",
        direction: "forward",
        ...mockUserSession,
      },
    ]);
    expect(result).toBeUndefined();
  });

  it("should resolve an IModel when getRelatedItems returns related items", async function () {
    const getRelatedItemsSpy = spyOn(
      restPortal,
      "getRelatedItems"
    ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getInputFeatureServiceModel("123", mockUserSession);
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
      {
        id: "123",
        relationshipType: "Survey2Service",
        direction: "forward",
        ...mockUserSession,
      },
    ]);
    const expected = { item: FieldworkerItem };
    expect(result).toEqual(expected);
  });
});
