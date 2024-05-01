import * as canUseHubDownloadApiModule from "../../src/downloads/canUseHubDownloadApi";
import * as fetchHubApiDownloadFileUrlModule from "../../src/downloads/_internal/file-url-fetchers/fetchHubApiDownloadFileUrl";
import * as canUseExportItemFlowModule from "../../src/downloads/_internal/canUseExportItemFlow";
import * as fetchExportItemDownloadFileUrlModule from "../../src/downloads/_internal/file-url-fetchers/fetchExportItemDownloadFileUrl";
import * as canUseExportImageFlowModule from "../../src/downloads/_internal/canUseExportImageFlow";
import * as fetchExportImageDownloadFileUrlModule from "../../src/downloads/_internal/file-url-fetchers/fetchExportImageDownloadFileUrl";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IArcGISContext, ServiceDownloadFormat } from "../../src";
import { fetchDownloadFileUrl } from "../../src/downloads/fetchDownloadFileUrl";

describe("fetchDownloadFileUrl", () => {
  let canUseHubDownloadApiSpy: jasmine.Spy;
  let fetchHubApiDownloadFileUrlSpy: jasmine.Spy;
  let canUseExportItemFlowSpy: jasmine.Spy;
  let fetchExportItemDownloadFileUrlSpy: jasmine.Spy;
  let canUseExportImageFlowSpy: jasmine.Spy;
  let fetchExportImageDownloadFileUrlSpy: jasmine.Spy;

  beforeEach(() => {
    canUseHubDownloadApiSpy = spyOn(
      canUseHubDownloadApiModule,
      "canUseHubDownloadApi"
    );
    fetchHubApiDownloadFileUrlSpy = spyOn(
      fetchHubApiDownloadFileUrlModule,
      "fetchHubApiDownloadFileUrl"
    );
    canUseExportItemFlowSpy = spyOn(
      canUseExportItemFlowModule,
      "canUseExportItemFlow"
    );
    fetchExportItemDownloadFileUrlSpy = spyOn(
      fetchExportItemDownloadFileUrlModule,
      "fetchExportItemDownloadFileUrl"
    );
    canUseExportImageFlowSpy = spyOn(
      canUseExportImageFlowModule,
      "canUseExportImageFlow"
    );
    fetchExportImageDownloadFileUrlSpy = spyOn(
      fetchExportImageDownloadFileUrlModule,
      "fetchExportImageDownloadFileUrl"
    );
  });

  it("should throw an error if no download flow can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(false);
    try {
      await fetchDownloadFileUrl({
        entity: {} as unknown as IHubEditableContent,
        context: {} as unknown as IArcGISContext,
        format: ServiceDownloadFormat.CSV,
        layers: [0],
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Downloads are not supported for this item in this environment"
      );
    }
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileUrlSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileUrlSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileUrlSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchHubApiDownloadFileUrl when the Hub Download API can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(true);
    canUseExportImageFlowSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);

    fetchHubApiDownloadFileUrlSpy.and.returnValue(
      Promise.resolve("hub-api-download-url")
    );

    const entity = {
      id: "123",
      type: "Map Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    const result = await fetchDownloadFileUrl({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(result).toBe("hub-api-download-url");
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileUrlSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileUrlSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(canUseExportItemFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportItemDownloadFileUrlSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportImageDownloadFileUrlSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchExportItemDownloadFileUrl when the Hub Download API cannot be used but export item flow can be", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(true);
    canUseExportImageFlowSpy.and.returnValue(false);

    fetchExportItemDownloadFileUrlSpy.and.returnValue(
      Promise.resolve("export-item-download-url")
    );

    const entity = {
      id: "123",
      type: "Feature Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    const result = await fetchDownloadFileUrl({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(result).toBe("export-item-download-url");
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileUrlSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileUrlSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileUrlSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportImageDownloadFileUrlSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchExportImageDownloadFileUrl when the Export Image flow can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(true);

    fetchExportImageDownloadFileUrlSpy.and.returnValue(
      Promise.resolve("export-image-download-url")
    );

    const entity = {
      id: "123",
      type: "Image Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    const result = await fetchDownloadFileUrl({
      entity,
      context,
      format: ServiceDownloadFormat.PNG,
      pollInterval: 1000,
    });
    expect(result).toBe("export-image-download-url");
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileUrlSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileUrlSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileUrlSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileUrlSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.PNG,
      pollInterval: 1000,
    });
  });

  it("should set the pollInterval to 3000 if not provided", async () => {
    canUseHubDownloadApiSpy.and.returnValue(true);

    fetchHubApiDownloadFileUrlSpy.and.returnValue(
      Promise.resolve("hub-api-download-url")
    );

    const entity = {
      id: "123",
      type: "Map Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    await fetchDownloadFileUrl({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
    });
    expect(fetchHubApiDownloadFileUrlSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 3000,
    });
  });
});
