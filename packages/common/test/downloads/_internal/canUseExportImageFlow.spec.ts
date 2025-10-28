import {
  describe,
  it,
  expect,
} from "vitest";

import { IHubEditableContent } from "../../../src/core/types/IHubEditableContent";
import { canUseExportImageFlow } from "../../../src/downloads/_internal/canUseExportImageFlow";

describe("canUseExportImageFlow", () => {
  it('should return true when entity type is "Image Service"', () => {
    const entity = { type: "Image Service" } as unknown as IHubEditableContent;
    const result = canUseExportImageFlow(entity);
    expect(result).toBe(true);
  });
  it("should return false when entity is a Tiled Image Service", () => {
    const entity = {
      type: "Image Service",
      typeKeywords: ["Tiled Imagery"],
    } as unknown as IHubEditableContent;
    const result = canUseExportImageFlow(entity);
    expect(result).toBe(false);
  });
  it('should return false when entity type is not "Image Service"', () => {
    const entity = {
      type: "Feature Service",
    } as unknown as IHubEditableContent;
    const result = canUseExportImageFlow(entity);
    expect(result).toBe(false);
  });
});
