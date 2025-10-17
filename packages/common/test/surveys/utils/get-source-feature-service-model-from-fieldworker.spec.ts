vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getRelatedItems: vi.fn(),
  getItem: vi.fn(),
}));

import { vi } from "vitest";
import type { IGetRelatedItemsResponse } from "@esri/arcgis-rest-portal";
import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../../test-helpers/fake-user-session";
import * as FeatureServiceItem from "../../mocks/items/feature-service-item.json";
import { getSourceFeatureServiceModelFromFieldworker } from "../../../src/surveys/utils/get-source-feature-service-model-from-fieldworker";

describe("getSourceFeatureServiceModelFromFieldworker", () => {
  let getRelatedItemsResponse: IGetRelatedItemsResponse;

  beforeEach(() => {
    getRelatedItemsResponse = {
      total: 1,
      relatedItems: [FeatureServiceItem],
    };
  });

  it("should resolve undefined when getRelatedItems returns no related items", async function () {
    getRelatedItemsResponse.relatedItems.splice(0, 1);
    const getRelatedItemsSpy = vi
      .spyOn(restPortal, "getRelatedItems")
      .mockReturnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getSourceFeatureServiceModelFromFieldworker(
      "123",
      mockUserSession
    );
    expect(getRelatedItemsSpy).toHaveBeenCalledTimes(1);
    expect(getRelatedItemsSpy.mock.calls[0]).toEqual([
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
    const getRelatedItemsSpy = vi
      .spyOn(restPortal, "getRelatedItems")
      .mockReturnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getSourceFeatureServiceModelFromFieldworker(
      "123",
      mockUserSession
    );
    expect(getRelatedItemsSpy).toHaveBeenCalledTimes(1);
    expect(getRelatedItemsSpy.mock.calls[0]).toEqual([
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
