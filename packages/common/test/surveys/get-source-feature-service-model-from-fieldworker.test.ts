/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getSourceFeatureServiceModelFromFieldworker } from "../../src/surveys/utils/get-source-feature-service-model-from-fieldworker";
import * as FeatureServiceItem from "../mocks/items/feature-service-item.json";
import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("getSourceFeatureServiceModelFromFieldworker", function () {
  let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;

  beforeEach(() => {
    getRelatedItemsResponse = {
      total: 1,
      relatedItems: [FeatureServiceItem],
    };
  });

  it("should resolve undefined when getRelatedItems returns no related items", async function () {
    getRelatedItemsResponse.relatedItems.splice(0, 1);
    const getRelatedItemsSpy = spyOn(
      restPortal,
      "getRelatedItems"
    ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getSourceFeatureServiceModelFromFieldworker(
      "123",
      mockUserSession
    );
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
      {
        id: "123",
        relationshipType: "Service2Data",
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
    const result = await getSourceFeatureServiceModelFromFieldworker(
      "123",
      mockUserSession
    );
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
      {
        id: "123",
        relationshipType: "Service2Data",
        direction: "forward",
        ...mockUserSession,
      },
    ]);
    const expected = { item: FeatureServiceItem };
    expect(result).toEqual(expected);
  });
});
