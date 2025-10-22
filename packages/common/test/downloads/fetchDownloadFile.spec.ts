import * as canUseHubDownloadApiModule from "../../src/downloads/canUseHubDownloadApi";
import * as fetchHubApiDownloadFileModule from "../../src/downloads/_internal/file-url-fetchers/fetchHubApiDownloadFile";
import * as canUseExportImageFlowModule from "../../src/downloads/_internal/canUseExportImageFlow";
import * as fetchExportImageDownloadFileModule from "../../src/downloads/_internal/file-url-fetchers/fetchExportImageDownloadFile";
import * as getDownloadFormatsModule from "../../src/downloads/getDownloadFormats";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { fetchDownloadFile } from "../../src/downloads/fetchDownloadFile";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import { ServiceDownloadFormat } from "../../src/downloads/types";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("fetchDownloadFile", () => {
  let canUseHubDownloadApiSpy: any;
  let fetchHubApiDownloadFileSpy: any;
  let canUseExportImageFlowSpy: any;
  let fetchExportImageDownloadFileSpy: any;
  let getDownloadFormatsSpy: any;

  beforeEach(() => {
    canUseHubDownloadApiSpy = vi.spyOn(
      canUseHubDownloadApiModule,
      "canUseHubDownloadApi"
    );
    fetchHubApiDownloadFileSpy = vi.spyOn(
      fetchHubApiDownloadFileModule,
      "fetchHubApiDownloadFile"
    );
    canUseExportImageFlowSpy = vi.spyOn(
      canUseExportImageFlowModule,
      "canUseExportImageFlow"
    );
    fetchExportImageDownloadFileSpy = vi.spyOn(
      fetchExportImageDownloadFileModule,
      "fetchExportImageDownloadFile"
    );
    getDownloadFormatsSpy = vi.spyOn(
      getDownloadFormatsModule,
      "getDownloadFormats"
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should throw an error if the requested format isn't enabled", async () => {
    // Additional resources (aka static formats) are not included in the list of valid formats
    getDownloadFormatsSpy.mockReturnValue([
      { type: "static", url: "my-additional-resource" },
    ]);
    try {
      await fetchDownloadFile({
        entity: {} as unknown as IHubEditableContent,
        context: {} as unknown as IArcGISContext,
        format: ServiceDownloadFormat.CSV,
        layers: [0],
      });
      expect(true).toBe(false);
    } catch (err) {
      expect((err as Error).message).toBe(
        `The following format is not enabled for the entity: ${ServiceDownloadFormat.CSV}`
      );
    }
    expect(canUseHubDownloadApiSpy).not.toHaveBeenCalled();
    expect(fetchHubApiDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportImageDownloadFileSpy).not.toHaveBeenCalled();
  });

  it("should throw an error if no download flow can be used", async () => {
    canUseHubDownloadApiSpy.mockReturnValue(false);
    canUseExportImageFlowSpy.mockReturnValue(false);
    getDownloadFormatsSpy.mockReturnValue([
      { type: "dynamic", format: ServiceDownloadFormat.CSV },
    ]);
    try {
      await fetchDownloadFile({
        entity: {} as unknown as IHubEditableContent,
        context: {} as unknown as IArcGISContext,
        format: ServiceDownloadFormat.CSV,
        layers: [0],
      });
      expect(true).toBe(false);
    } catch (err) {
      expect((err as Error).message).toBe(
        "Downloads are not supported for this item in this environment"
      );
    }
    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(fetchHubApiDownloadFileSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportImageDownloadFileSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchHubApiDownloadFile when the Hub Download API can be used", async () => {
    canUseHubDownloadApiSpy.mockReturnValue(true);
    canUseExportImageFlowSpy.mockReturnValue(false);
    getDownloadFormatsSpy.mockReturnValue([
      { type: "dynamic", format: ServiceDownloadFormat.CSV },
    ]);
    fetchHubApiDownloadFileSpy.mockResolvedValue(
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
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportImageDownloadFileSpy).not.toHaveBeenCalled();
  });

  it("should delegate to fetchExportImageDownloadFile when the Export Image flow can be used", async () => {
    canUseHubDownloadApiSpy.mockReturnValue(false);
    canUseExportImageFlowSpy.mockReturnValue(true);
    getDownloadFormatsSpy.mockReturnValue([
      { type: "dynamic", format: ServiceDownloadFormat.PNG },
    ]);
    fetchExportImageDownloadFileSpy.mockResolvedValue(
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
    canUseHubDownloadApiSpy.mockReturnValue(true);
    getDownloadFormatsSpy.mockReturnValue([
      { type: "dynamic", format: ServiceDownloadFormat.CSV },
    ]);
    fetchHubApiDownloadFileSpy.mockResolvedValue(
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
