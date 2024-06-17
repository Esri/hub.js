import * as canUseHubDownloadApiModule from "../../src/downloads/canUseHubDownloadApi";
import * as getHubDownloadApiFormatsModule from "../../src/downloads/getHubDownloadApiFormats";
import * as canUseExportItemFlowModule from "../../src/downloads/_internal/canUseExportItemFlow";
import * as fetchExportItemFormatsModule from "../../src/downloads/_internal/format-fetchers/fetchExportItemFormats";
import * as canUseExportImageFlowModule from "../../src/downloads/_internal/canUseExportImageFlow";
import * as getExportImageFormatsModule from "../../src/downloads/_internal/format-fetchers/getExportImageFormats";
import { fetchDownloadFormats } from "../../src/downloads/fetchDownloadFormats";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IArcGISContext } from "../../src/ArcGISContext";
import {
  IDownloadFormat,
  IDynamicDownloadFormat,
  IStaticDownloadFormat,
  ServiceDownloadFormat,
} from "../../src";

describe("fetchDownloadFormats", () => {
  let canUseHubDownloadApiSpy: jasmine.Spy;
  let getHubDownloadApiFormatsSpy: jasmine.Spy;
  let canUseExportItemFlowSpy: jasmine.Spy;
  let fetchExportItemFormatsSpy: jasmine.Spy;
  let canUseExportImageFlowSpy: jasmine.Spy;
  let getExportImageFormatsSpy: jasmine.Spy;

  beforeEach(() => {
    canUseHubDownloadApiSpy = spyOn(
      canUseHubDownloadApiModule,
      "canUseHubDownloadApi"
    );
    getHubDownloadApiFormatsSpy = spyOn(
      getHubDownloadApiFormatsModule,
      "getHubDownloadApiFormats"
    );
    canUseExportItemFlowSpy = spyOn(
      canUseExportItemFlowModule,
      "canUseExportItemFlow"
    );
    fetchExportItemFormatsSpy = spyOn(
      fetchExportItemFormatsModule,
      "fetchExportItemFormats"
    );
    canUseExportImageFlowSpy = spyOn(
      canUseExportImageFlowModule,
      "canUseExportImageFlow"
    );
    getExportImageFormatsSpy = spyOn(
      getExportImageFormatsModule,
      "getExportImageFormats"
    );
  });

  it("returns an empty array if no download formats can be used", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(false);

    const results = await fetchDownloadFormats({
      entity: { type: "Web Map" } as unknown as IHubEditableContent,
      context: {} as unknown as IArcGISContext,
    });
    expect(results).toEqual([]);

    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(getHubDownloadApiFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(getExportImageFormatsSpy).not.toHaveBeenCalled();
  });

  it("returns additional resources as static formats", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(false);

    const entity = {
      type: "Web Map",
      additionalResources: [
        { name: "Resource 1", url: "resource-1-url" },
        { name: "Resource 2", url: "resource-2-url" },
      ],
    } as unknown as IHubEditableContent;

    const results = await fetchDownloadFormats({
      entity,
      context: {} as unknown as IArcGISContext,
    });

    const expected = [
      { type: "static", label: "Resource 1", url: "resource-1-url" },
      { type: "static", label: "Resource 2", url: "resource-2-url" },
    ] as unknown as IDownloadFormat[];

    expect(results).toEqual(expected);

    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(getHubDownloadApiFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(getExportImageFormatsSpy).not.toHaveBeenCalled();
  });

  it("returns base formats for an entity that can use the hub download api", async () => {
    canUseHubDownloadApiSpy.and.returnValue(true);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(false);

    const baseFormats = [
      { type: "dynamic", format: ServiceDownloadFormat.CSV },
      { type: "dynamic", format: ServiceDownloadFormat.GEOJSON },
    ] as unknown as IDynamicDownloadFormat[];

    getHubDownloadApiFormatsSpy.and.returnValue(baseFormats);

    const results = await fetchDownloadFormats({
      entity: { type: "Feature Service" } as unknown as IHubEditableContent,
      context: {} as unknown as IArcGISContext,
      layers: [0],
    });

    const expected = [...baseFormats] as unknown as IDownloadFormat[];

    expect(results).toEqual(expected);

    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(getHubDownloadApiFormatsSpy).toHaveBeenCalledTimes(1);
    expect(canUseExportItemFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportItemFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(getExportImageFormatsSpy).not.toHaveBeenCalled();
  });

  it("returns base formats for an entity that cannot use the download api but can use the export item flow", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(true);
    canUseExportImageFlowSpy.and.returnValue(false);

    const baseFormats = [
      { type: "dynamic", format: ServiceDownloadFormat.CSV },
      { type: "dynamic", format: ServiceDownloadFormat.GEOJSON },
    ] as unknown as IDynamicDownloadFormat[];

    fetchExportItemFormatsSpy.and.returnValue(baseFormats);

    const results = await fetchDownloadFormats({
      entity: { type: "Feature Service" } as unknown as IHubEditableContent,
      context: {} as unknown as IArcGISContext,
      layers: [0],
    });

    const expected = [...baseFormats] as unknown as IDownloadFormat[];

    expect(results).toEqual(expected);

    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(getHubDownloadApiFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemFormatsSpy).toHaveBeenCalledTimes(1);
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(getExportImageFormatsSpy).not.toHaveBeenCalled();
  });

  it("returns base formats for an entity that can use the export image flow", async () => {
    canUseHubDownloadApiSpy.and.returnValue(false);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(true);

    const baseFormats = [
      { type: "dynamic", format: ServiceDownloadFormat.PNG },
      { type: "dynamic", format: ServiceDownloadFormat.JPG },
    ] as unknown as IDynamicDownloadFormat[];

    getExportImageFormatsSpy.and.returnValue(baseFormats);

    const results = await fetchDownloadFormats({
      entity: { type: "Feature Service" } as unknown as IHubEditableContent,
      context: {} as unknown as IArcGISContext,
    });

    const expected = [...baseFormats] as unknown as IDownloadFormat[];

    expect(results).toEqual(expected);

    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(getHubDownloadApiFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportItemFlowSpy).toHaveBeenCalledTimes(1);
    expect(fetchExportItemFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).toHaveBeenCalledTimes(1);
    expect(getExportImageFormatsSpy).toHaveBeenCalledTimes(1);
  });

  it("combines base formats and additional resources", async () => {
    canUseHubDownloadApiSpy.and.returnValue(true);
    canUseExportItemFlowSpy.and.returnValue(false);
    canUseExportImageFlowSpy.and.returnValue(false);

    const baseFormats = [
      { type: "dynamic", format: ServiceDownloadFormat.CSV },
      { type: "dynamic", format: ServiceDownloadFormat.GEOJSON },
    ] as unknown as IDynamicDownloadFormat[];

    getHubDownloadApiFormatsSpy.and.returnValue(baseFormats);

    const entity = {
      type: "Feature Service",
      additionalResources: [
        { name: "Resource 1", url: "resource-1-url" },
        { name: "Resource 2", url: "resource-2-url" },
      ],
    } as unknown as IHubEditableContent;

    const results = await fetchDownloadFormats({
      entity,
      context: {} as unknown as IArcGISContext,
      layers: [0],
    });

    const additionalFormats = [
      { type: "static", label: "Resource 1", url: "resource-1-url" },
      { type: "static", label: "Resource 2", url: "resource-2-url" },
    ] as unknown as IStaticDownloadFormat[];

    const expected = [
      ...baseFormats,
      ...additionalFormats,
    ] as unknown as IDownloadFormat[];

    expect(results).toEqual(expected);

    expect(canUseHubDownloadApiSpy).toHaveBeenCalledTimes(1);
    expect(getHubDownloadApiFormatsSpy).toHaveBeenCalledTimes(1);
    expect(canUseExportItemFlowSpy).not.toHaveBeenCalled();
    expect(fetchExportItemFormatsSpy).not.toHaveBeenCalled();
    expect(canUseExportImageFlowSpy).not.toHaveBeenCalled();
    expect(getExportImageFormatsSpy).not.toHaveBeenCalled();
  });
});
