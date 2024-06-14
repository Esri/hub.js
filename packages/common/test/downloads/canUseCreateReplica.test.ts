import { canUseCreateReplica } from "../../src/downloads/canUseCreateReplica";
import * as hostedServiceUtils from "../../src/content/hostedServiceUtils";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";

describe("canUseCreateReplica", () => {
  it("should return true if entity is an AGO hosted feature service with serverExtractCapability", () => {
    const entity = {
      serverExtractCapability: true,
    } as unknown as IHubEditableContent;

    const isAGOFeatureServiceUrlSpy = spyOn(
      hostedServiceUtils,
      "isAGOFeatureServiceUrl"
    ).and.returnValue(true);

    const result = canUseCreateReplica(entity);

    expect(result).toBe(true);
    expect(isAGOFeatureServiceUrlSpy).toHaveBeenCalled();
  });

  it("should return false if entity is not an AGO hosted feature service", () => {
    const entity = {
      serverExtractCapability: true,
    } as unknown as IHubEditableContent;

    const isAGOFeatureServiceUrlSpy = spyOn(
      hostedServiceUtils,
      "isAGOFeatureServiceUrl"
    ).and.returnValue(false);

    const result = canUseCreateReplica(entity);

    expect(result).toBe(false);
    expect(isAGOFeatureServiceUrlSpy).toHaveBeenCalled();
  });

  it("should return false if entity does not have serverExtractCapability", () => {
    const entity = {
      serverExtractCapability: false,
    } as unknown as IHubEditableContent;

    const isAGOFeatureServiceUrlSpy = spyOn(
      hostedServiceUtils,
      "isAGOFeatureServiceUrl"
    ).and.returnValue(true);

    const result = canUseCreateReplica(entity);

    expect(result).toBe(false);
    expect(isAGOFeatureServiceUrlSpy).toHaveBeenCalled();
  });
});
