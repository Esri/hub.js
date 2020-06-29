/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { isDraft } from "../../src/utils/is-draft";
import { FormItemDraft } from "../mocks/form-item-draft";
import { FormItemPublished } from "../mocks/form-item-published";

describe("isDraft", function () {
  it("should return true when typeKeywords includes \"Draft\"", function () {
    expect(isDraft(FormItemDraft)).toBe(true);
  });

  it("should return false when typeKeywords excludes \"Draft\"", function () {
    expect(isDraft(FormItemPublished)).toBe(false);
  });
});
