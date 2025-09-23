import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { canUseHubDownloadSystem } from "../../src/downloads/canUseHubDownloadSystem";
import * as urlsModule from "../../src/urls/feature-service-urls";

describe("canUseHubDownloadSystem", () => {
  it("should return false if entity is not a map or feature service", () => {
    const isMapOrFeatureServerUrlSpy = spyOn(
      urlsModule,
      "isMapOrFeatureServerUrl"
    ).and.returnValue(false);

    const entity = {
      type: "Image Service",
      access: "public",
      url: "image-service-url",
    } as unknown as IHubEditableContent;

    const result = canUseHubDownloadSystem(entity);

    expect(result).toBe(false);
    expect(isMapOrFeatureServerUrlSpy).toHaveBeenCalledWith(
      "image-service-url"
    );
  });

  it("should return false if entity is not public", () => {
    const isMapOrFeatureServerUrlSpy = spyOn(
      urlsModule,
      "isMapOrFeatureServerUrl"
    ).and.returnValue(true);

    const entity = {
      type: "Feature Service",
      url: "feature-service-url",
      access: "private",
    } as unknown as IHubEditableContent;

    const result = canUseHubDownloadSystem(entity);

    expect(result).toBe(false);
    expect(isMapOrFeatureServerUrlSpy).toHaveBeenCalledWith(
      "feature-service-url"
    );
  });

  it("should return false if entity does not have serverQueryCapability", () => {
    const isMapOrFeatureServerUrlSpy = spyOn(
      urlsModule,
      "isMapOrFeatureServerUrl"
    ).and.returnValue(true);

    const entity = {
      type: "Feature Service",
      url: "feature-service-url",
      access: "public",
      serverQueryCapability: false,
    } as unknown as IHubEditableContent;

    const result = canUseHubDownloadSystem(entity);

    expect(result).toBe(false);
    expect(isMapOrFeatureServerUrlSpy).toHaveBeenCalledWith(
      "feature-service-url"
    );
  });

  it("should return true if entity is a map or feature service, is public, and has serverQueryCapability", () => {
    const isMapOrFeatureServerUrlSpy = spyOn(
      urlsModule,
      "isMapOrFeatureServerUrl"
    ).and.returnValue(true);

    const entity = {
      type: "Feature Service",
      url: "feature-service-url",
      access: "public",
      serverQueryCapability: true,
    } as unknown as IHubEditableContent;

    const result = canUseHubDownloadSystem(entity);

    expect(result).toBe(true);
    expect(isMapOrFeatureServerUrlSpy).toHaveBeenCalledWith(
      "feature-service-url"
    );
  });
});
