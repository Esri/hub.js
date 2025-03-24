/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import type { IItem } from "@esri/arcgis-rest-types";
import { isDraft } from "../../../src/surveys/utils/is-draft";
import * as FormItemDraft from "../../mocks/items/form-item-draft.json";
import * as FormItemPublished from "../../mocks/items/form-item-published.json";

describe("isDraft", function () {
  it('should return true when typeKeywords includes "Draft"', function () {
    expect(isDraft(FormItemDraft as unknown as IItem)).toBe(true);
  });

  it('should return false when typeKeywords excludes "Draft"', function () {
    expect(isDraft(FormItemPublished)).toBe(false);
  });
});
