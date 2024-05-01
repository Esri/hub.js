import { canUseCreateReplica } from "../../src/downloads/canUseCreateReplica";
import * as hostedServiceUtils from "../../src/content/hostedServiceUtils";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";

describe("canUseCreateReplica", () => {
  it("should return true if entity is a hosted feature service with serverExtractCapability", () => {
    const entity = {
      serverExtractCapability: true,
    } as unknown as IHubEditableContent;

    const isHostedFeatureServiceEntitySpy = spyOn(
      hostedServiceUtils,
      "isHostedFeatureServiceEntity"
    ).and.returnValue(true);

    const result = canUseCreateReplica(entity);

    expect(result).toBe(true);
    expect(isHostedFeatureServiceEntitySpy).toHaveBeenCalled();
  });

  it("should return false if entity is not a hosted feature service", () => {
    const entity = {
      serverExtractCapability: true,
    } as unknown as IHubEditableContent;

    const isHostedFeatureServiceEntitySpy = spyOn(
      hostedServiceUtils,
      "isHostedFeatureServiceEntity"
    ).and.returnValue(false);

    const result = canUseCreateReplica(entity);

    expect(result).toBe(false);
    expect(isHostedFeatureServiceEntitySpy).toHaveBeenCalled();
  });

  it("should return false if entity does not have serverExtractCapability", () => {
    const entity = {
      serverExtractCapability: false,
    } as unknown as IHubEditableContent;

    const isHostedFeatureServiceEntitySpy = spyOn(
      hostedServiceUtils,
      "isHostedFeatureServiceEntity"
    ).and.returnValue(true);

    const result = canUseCreateReplica(entity);

    expect(result).toBe(false);
    expect(isHostedFeatureServiceEntitySpy).toHaveBeenCalled();
  });
});
