import * as hostedServiceUtils from "../../../src/content/hostedServiceUtils";
import { IHubEditableContent } from "../../../src/core/types/IHubEditableContent";
import { canUseExportItemFlow } from "../../../src/downloads/_internal/canUseExportItemFlow";

describe("canUseExportItemFlow", () => {
  it("should return true when isHostedFeatureServiceMainEntity returns true", () => {
    spyOn(
      hostedServiceUtils,
      "isHostedFeatureServiceMainEntity"
    ).and.returnValue(true);
    const entity: IHubEditableContent = {} as unknown as IHubEditableContent;
    const result = canUseExportItemFlow(entity);
    expect(result).toBe(true);
  });

  it("should return false when isHostedFeatureServiceMainEntity returns false", () => {
    spyOn(
      hostedServiceUtils,
      "isHostedFeatureServiceMainEntity"
    ).and.returnValue(false);
    const entity: IHubEditableContent = {} as unknown as IHubEditableContent;
    const result = canUseExportItemFlow(entity);
    expect(result).toBe(false);
  });
});
