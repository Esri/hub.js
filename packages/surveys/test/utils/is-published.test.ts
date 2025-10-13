/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { isPublished } from "../../src/utils/is-published";
import * as publishUtils from "@esri/hub-common";
import * as FormItemDraft from "../mocks/items/form-item-draft.json";
import * as FormItemPublished from "../mocks/items/form-item-published.json";
import type { IItem } from "@esri/arcgis-rest-portal";

describe("isPublished", function () {
  it("should return true when isDraft returns false", function () {
    const isDraftStub = spyOn(publishUtils, "isDraft").and.returnValue(false);
    const result = isPublished(FormItemDraft as unknown as IItem);
    expect(isDraftStub.calls.count()).toBe(1);
    expect(isDraftStub.calls.argsFor(0)).toEqual([FormItemDraft]);
    expect(result).toBe(true);
  });

  it("should return false when isDraft returns true", function () {
    const isDraftStub = spyOn(publishUtils, "isDraft").and.returnValue(true);
    const result = isPublished(FormItemPublished);
    expect(isDraftStub.calls.count()).toBe(1);
    expect(isDraftStub.calls.argsFor(0)).toEqual([FormItemPublished]);
    expect(result).toBe(false);
  });
});
