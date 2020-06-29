/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { getStakeholderModel } from "../../src/sharing/get-stakeholder-model";
import { FieldworkerItem } from "../mocks/fieldworker-item";
import { StakeholderItem } from "../mocks/stakeholder-item";
import * as isFieldworkerView from "../../src/utils/is-fieldworker-view";

describe("getStakeholderModel", function () {
  let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;
  
  beforeEach(() => {
    getRelatedItemsResponse = {
      total: 2,
      relatedItems: [FieldworkerItem, StakeholderItem]
    };
  });

  it("should resolve undefined when getRelatedItems returns no Stakeholder", async function () {
    getRelatedItemsResponse.relatedItems.pop();
    const getRelatedItemsSpy = spyOn(restPortal, "getRelatedItems").and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const isFieldworkerViewSpy = spyOn(isFieldworkerView, "isFieldworkerView").and.returnValues(true);
    const result = await getStakeholderModel("123", mockUserSession);
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([{
      id: "123",
      relationshipType: "Service2Service",
      direction: "forward",
      ...mockUserSession
    }]);
    expect(isFieldworkerViewSpy.calls.count()).toBe(1);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([FieldworkerItem]);
    expect(result).toBeUndefined();
  });

  it("should resolve an IFeatureServiceModel when getRelatedItems returns a Fieldworker", async function () {
    const getRelatedItemsSpy = spyOn(restPortal, "getRelatedItems").and.returnValue(Promise.resolve(getRelatedItemsResponse));
    const isFieldworkerViewSpy = spyOn(isFieldworkerView, "isFieldworkerView").and.returnValues(true, false);
    const result = await getStakeholderModel("123", mockUserSession);
    expect(getRelatedItemsSpy.calls.count()).toBe(1);
    expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([{
      id: "123",
      relationshipType: "Service2Service",
      direction: "forward",
      ...mockUserSession
    }]);
    expect(isFieldworkerViewSpy.calls.count()).toBe(2);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([FieldworkerItem]);
    expect(isFieldworkerViewSpy.calls.argsFor(1)).toEqual([StakeholderItem]);
    const expected = { item: StakeholderItem };
    expect(result).toEqual(expected);
  });
});
