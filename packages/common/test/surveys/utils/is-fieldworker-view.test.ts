import * as FieldworkerItem from "../../mocks/items/fieldworker-item.json";
import * as FeatureServiceItem from "../../mocks/items/feature-service-item.json";
import * as StakeholderItem from "../../mocks/items/stakeholder-item.json";
import { isFieldworkerView } from "../../../src/surveys/utils/is-fieldworker-view";
import { cloneObject } from "../../../src/util";

describe("isFieldworkerView", () => {
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
