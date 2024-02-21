/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { cloneObject } from "../../src/util";
import { isFieldworkerView } from "../../src/feedback/utils/is-fieldworker-view";
import * as FieldworkerItem from "../mocks/items/fieldworker-item.json";
import * as FeatureServiceItem from "../mocks/items/feature-service-item.json";
import * as StakeholderItem from "../mocks/items/stakeholder-item.json";

describe("isFieldworkerView", function () {
  it("should return true for a Fieldworker", function () {
    expect(isFieldworkerView(FieldworkerItem)).toBe(true);
  });

  it("should support legacy Fieldworkers", function () {
    const item = {
      ...cloneObject(FieldworkerItem),
      typeKeywords: ["Survey123", "Feature Service", "View Service"],
    };
    expect(isFieldworkerView(item)).toBe(true);
  });

  it("should return false for a Feature Service", function () {
    expect(isFieldworkerView(FeatureServiceItem)).toBe(false);
  });

  it("should return false for a Stakeholder", function () {
    expect(isFieldworkerView(StakeholderItem)).toBe(false);
  });
});
