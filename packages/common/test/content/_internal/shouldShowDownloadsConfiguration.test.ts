import { shouldShowDownloadsConfiguration } from "../../../src/content/_internal/shouldShowDownloadsConfiguration";

describe("shouldShowDownloadsConfiguration", () => {
  const hubRequestOptions = { isPortal: false } as any;
  const portalRequestOptions = { isPortal: true } as any;

  it("returns false if isPortal is true", () => {
    const entity = {
      type: "Feature Service",
      url: "https://example.com/arcgis/rest/services/test/0",
    } as any;
    expect(shouldShowDownloadsConfiguration(entity, portalRequestOptions)).toBe(
      false
    );
  });

  it("returns true for reference layer entity (Feature Service with /<layerId> url)", () => {
    const entity = {
      type: "Feature Service",
      url: "https://example.com/arcgis/rest/services/test/2",
    } as any;
    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      true
    );
  });

  it("returns true for reference layer entity (Map Service with /<layerId> url)", () => {
    const entity = {
      type: "Map Service",
      url: "https://example.com/arcgis/rest/services/test/5",
    } as any;
    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      true
    );
  });

  it("returns false for Feature Service without layerId in url", () => {
    const entity = {
      type: "Feature Service",
      url: "https://example.com/arcgis/rest/services/test",
    } as any;
    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      false
    );
  });

  it("returns true for single layer entity", () => {
    const entity = {
      type: "Feature Service",
      url: "https://example.com/arcgis/rest/services/test",
      extendedProps: { server: { layers: [{ id: 0 }] } },
    } as any;
    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      true
    );
  });

  it("returns false for multi-layer entity", () => {
    const entity = {
      type: "Feature Service",
      url: "https://example.com/arcgis/rest/services/test",
      extendedProps: { server: { layers: [{ id: 0 }, { id: 1 }] } },
    } as any;
    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      false
    );
  });

  it("returns true if canUseExportImageFlow returns true", () => {
    const entity = {
      type: "Image Service",
      url: "https://example.com/arcgis/rest/services/test",
      typeKeywords: [],
    } as any;

    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      true
    );
  });

  it("returns false if none of the conditions are met", () => {
    const entity = { type: "PDF" } as any;
    expect(shouldShowDownloadsConfiguration(entity, hubRequestOptions)).toBe(
      false
    );
  });
});
