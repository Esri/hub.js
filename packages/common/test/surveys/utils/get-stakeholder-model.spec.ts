vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getRelatedItems: vi.fn(),
  getItem: vi.fn(),
}));

import { vi } from "vitest";
import type { IGetRelatedItemsResponse } from "@esri/arcgis-rest-portal";
import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../../test-helpers/fake-user-session";
import * as StakeholderItem from "../../mocks/items/stakeholder-item.json";
import { getStakeholderModel } from "../../../src/surveys/utils/get-stakeholder-model";

describe("getStakeholderModel", () => {
  let getRelatedItemsResponse: IGetRelatedItemsResponse;

  beforeEach(() => {
    getRelatedItemsResponse = {
      total: 2,
      relatedItems: [StakeholderItem],
    };
  });

  it("should resolve undefined when getRelatedItems returns no Stakeholder", async function () {
    getRelatedItemsResponse.relatedItems.pop();
    const getRelatedItemsSpy = vi
      .spyOn(restPortal, "getRelatedItems")
      .mockReturnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getStakeholderModel("123", mockUserSession);
    expect(getRelatedItemsSpy).toHaveBeenCalledTimes(1);
    expect(getRelatedItemsSpy.mock.calls[0]).toEqual([
      {
        id: "123",
        relationshipType: "Survey2Data",
        direction: "forward",
        ...mockUserSession,
      },
    ]);
    expect(result).toBeUndefined();
  });

  it("should resolve an IModel when getRelatedItems returns a Stakeholder", async function () {
    const getRelatedItemsSpy = vi
      .spyOn(restPortal, "getRelatedItems")
      .mockReturnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getStakeholderModel("123", mockUserSession);
    expect(getRelatedItemsSpy).toHaveBeenCalledTimes(1);
    expect(getRelatedItemsSpy.mock.calls[0]).toEqual([
      {
        id: "123",
        relationshipType: "Survey2Data",
        direction: "forward",
        ...mockUserSession,
      },
    ]);
    const expected = { item: StakeholderItem };
    expect(result).toEqual(expected);
  });
});
