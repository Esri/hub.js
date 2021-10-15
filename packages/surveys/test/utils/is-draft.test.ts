/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { isDraft } from "../../src/utils/is-draft";
import * as FormItemDraft from "../../../common/test/mocks/items/form-item-draft.json";
import * as FormItemPublished from "../../../common/test/mocks/items/form-item-published.json";

describe("isDraft", function () {
  it('should return true when typeKeywords includes "Draft"', function () {
    expect(isDraft(FormItemDraft)).toBe(true);
  });

  it('should return false when typeKeywords excludes "Draft"', function () {
    expect(isDraft(FormItemPublished)).toBe(false);
  });
});
