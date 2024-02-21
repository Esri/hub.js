/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { getStakeholderModel } from "../../src/feedback/utils/get-stakeholder-model";
import * as StakeholderItem from "../mocks/items/stakeholder-item.json";

describe("getStakeholderModel", function () {
  let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;

  beforeEach(() => {
    getRelatedItemsResponse = {
      total: 2,
      relatedItems: [StakeholderItem],
    };
  });

  it("should resolve undefined when getRelatedItems returns no Stakeholder", async function () {
    getRelatedItemsResponse.relatedItems.pop();
    const getRelatedItemsSpy = spyOn(
      restPortal,
      "getRelatedItems"
    ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getStakeholderModel("123", mockUserSession);
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
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
    const getRelatedItemsSpy = spyOn(
      restPortal,
      "getRelatedItems"
    ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const result = await getStakeholderModel("123", mockUserSession);
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
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
