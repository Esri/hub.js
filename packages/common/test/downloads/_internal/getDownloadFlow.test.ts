import { getDownloadFlow } from "../../../src/downloads/_internal/getDownloadFlow";
import { IHubEditableContent } from "../../../src/core";

describe("getDownloadFlow", () => {
  it("should return null if the entity cannot be downloaded", () => {
    const entity: IHubEditableContent = {
      url: "https://www.arcgis.com/arcgis/rest/services/Hosted/FeatureServer/0",
      serverExtractCapability: false,
    } as any;
    const result = getDownloadFlow(entity);
    expect(result).toBeNull();
  });

  it("should return the appropriate create replica download flow", () => {
    const entity: IHubEditableContent = {
      url: "https://services.arcgis.com/arcgis/rest/services/Hosted/FeatureServer/0",
      serverExtractCapability: true,
    } as any;
    const result = getDownloadFlow(entity);
    expect(result).toBe("createReplica");
  });

  it("should return the appropriate paging download flow", () => {
    const entity: IHubEditableContent = {
      url: "https://www.arcgis.com/arcgis/rest/services/Hosted/FeatureServer/0",
      serverExtractCapability: false,
      serverQueryCapability: true,
      access: "public",
    } as any;
    const isEnterprise = false;
    const result = getDownloadFlow(entity, isEnterprise);
    expect(result).toBe("paging");
  });

  it("should return the appropriate export image download flow", () => {
    const entity: IHubEditableContent = {
      url: "https://www.arcgis.com/arcgis/rest/services/Hosted/FeatureServer/0",
      serverExtractCapability: false,
      serverQueryCapability: false,
      access: "public",
      type: "Image Service",
      typeKeywords: [],
    } as any;
    const result = getDownloadFlow(entity);
    expect(result).toBe("exportImage");
  });
});
