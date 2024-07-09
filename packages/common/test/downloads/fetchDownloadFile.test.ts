import * as canUseHubDownloadApiModule from "../../src/downloads/canUseHubDownloadApi";
import * as fetchHubApiDownloadFileModule from "../../src/downloads/_internal/file-url-fetchers/fetchHubApiDownloadFile";
import * as canUseExportItemFlowModule from "../../src/downloads/_internal/canUseExportItemFlow";
import * as fetchExportItemDownloadFileModule from "../../src/downloads/_internal/file-url-fetchers/fetchExportItemDownloadFile";
import * as canUseExportImageFlowModule from "../../src/downloads/_internal/canUseExportImageFlow";
import * as fetchExportImageDownloadFileModule from "../../src/downloads/_internal/file-url-fetchers/fetchExportImageDownloadFile";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IArcGISContext, ServiceDownloadFormat } from "../../src";
import { fetchDownloadFile } from "../../src/downloads/fetchDownloadFile";

describe("fetchDownloadFile", () => {
  let canUseHubDownloadApiSpy: jasmine.Spy;
  let fetchHubApiDownloadFileSpy: jasmine.Spy;
  let canUseExportItemFlowSpy: jasmine.Spy;
  let fetchExportItemDownloadFileSpy: jasmine.Spy;
  let canUseExportImageFlowSpy: jasmine.Spy;
  let fetchExportImageDownloadFileSpy: jasmine.Spy;

  beforeEach(() => {
    canUseHubDownloadApiSpy = spyOn(
      canUseHubDownloadApiModule,
      "canUseHubDownloadApi"
    );
    fetchHubApiDownloadFileSpy = spyOn(
      fetchHubApiDownloadFileModule,
      "fetchHubApiDownloadFile"
    );
    canUseExportItemFlowSpy = spyOn(
      canUseExportItemFlowModule,
      "canUseExportItemFlow"
    );
    fetchExportItemDownloadFileSpy = spyOn(
      fetchExportItemDownloadFileModule,
      "fetchExportItemDownloadFile"
    );
    canUseExportImageFlowSpy = spyOn(
      canUseExportImageFlowModule,
      "canUseExportImageFlow"
    );
    fetchExportImageDownloadFileSpy = spyOn(
      fetchExportImageDownloadFileModule,
      "fetchExportImageDownloadFile"
    );
  });

  it("should throw an error if no download flow can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(false);
    try {
      await fetchDownloadFile({
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
    expect(fetchHubApiDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchHubApiDownloadFile when the Hub Download API can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(true);
    canUseExportImageFlowSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);

    fetchHubApiDownloadFileSpy.and.returnValue(
      Promise.resolve({ type: "url", href: "hub-api-download-url" })
    );

    const entity = {
      id: "123",
      type: "Map Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    const result = await fetchDownloadFile({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(result).toEqual({ type: "url", href: "hub-api-download-url" });
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(canUseExportItemFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportItemDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportImageDownloadFileSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchExportItemDownloadFile when the Hub Download API cannot be used but export item flow can be", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(true);
    canUseExportImageFlowSpy.and.returnValue(false);

    fetchExportItemDownloadFileSpy.and.returnValue(
      Promise.resolve({ type: "url", href: "export-item-download-url" })
    );

    const entity = {
      id: "123",
      type: "Feature Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    const result = await fetchDownloadFile({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(result).toEqual({ type: "url", href: "export-item-download-url" });
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 1000,
    });
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportImageDownloadFileSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchExportImageDownloadFile when the Export Image flow can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(true);

    fetchExportImageDownloadFileSpy.and.returnValue(
      Promise.resolve({ type: "blob", filename: "image.png", blob: {} as Blob })
    );

    const entity = {
      id: "123",
      type: "Image Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    const result = await fetchDownloadFile({
      entity,
      context,
      format: ServiceDownloadFormat.PNG,
      pollInterval: 1000,
    });
    expect(result).toEqual({
      type: "blob",
      filename: "image.png",
      blob: {} as Blob,
    });
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.PNG,
      pollInterval: 1000,
    });
  });

  it("should set the pollInterval to 3000 if not provided", async () => {
    canUseHubDownloadApiSpy.and.returnValue(true);

    fetchHubApiDownloadFileSpy.and.returnValue(
      Promise.resolve({ type: "url", href: "hub-api-download-url" })
    );

    const entity = {
      id: "123",
      type: "Map Service",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;
    await fetchDownloadFile({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
    });
    expect(fetchHubApiDownloadFileSpy).toHaveBeenCalledWith({
      entity,
      context,
      format: ServiceDownloadFormat.CSV,
      layers: [0],
      pollInterval: 3000,
    });
  });
});
