import { IArcGISContext } from "../../../../src/ArcGISContext";
import { IHubEditableContent } from "../../../../src/core/types/IHubEditableContent";
import * as buildExistingExportsPortalQueryModule from "../../../../src/downloads/build-existing-exports-portal-query";
import * as fetchAllPagesModule from "../../../../src/items/fetch-all-pages";
import * as getExportItemDataUrlModule from "../../../../src/downloads/_internal/getExportItemDataUrl";
import { IItem, searchItems } from "@esri/arcgis-rest-portal";
import { fetchAvailableExportItemFormats } from "../../../../src/downloads/_internal/format-fetchers/fetchAvailableExportItemFormats";
import { IStaticDownloadFormat, ServiceDownloadFormat } from "../../../../src";
describe("fetchAvailableExportItemFormats", () => {
  it("should throw an error if multiple layers are provided", async () => {
    const entity = { id: "123" } as unknown as IHubEditableContent;
    const context = {
      hubUrl: "https://hubqa.arcgis.com",
      hubRequestOptions: {},
    } as unknown as IArcGISContext;
    const layers = [0, 1];
    try {
      await fetchAvailableExportItemFormats(entity, context, layers);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        "Multi-layer downloads are not supported for this item"
      );
    }
  });
  it("should fetch previous export items and return their formats", async () => {
    const entity = { id: "123" } as unknown as IHubEditableContent;
    const context = {
      hubUrl: "https://hubqa.arcgis.com",
      hubRequestOptions: {},
    } as unknown as IArcGISContext;
    const layers = [0];
    const buildExistingExportsPortalQuerySpy = spyOn(
      buildExistingExportsPortalQueryModule,
      "buildExistingExportsPortalQuery"
    ).and.returnValue("query");
    const fetchAllPagesSpy = spyOn(
      fetchAllPagesModule,
      "fetchAllPages"
    ).and.returnValue(
      Promise.resolve([
        { id: "456", type: "File Geodatabase" } as IItem,
        { id: "789", type: "CSV" } as IItem,
      ])
    );
    const getExportItemDataUrlSpy = spyOn(
      getExportItemDataUrlModule,
      "getExportItemDataUrl"
    ).and.callFake((id: string, _context: any): any => {
      return `data-url-${id}`;
    });

    const result = await fetchAvailableExportItemFormats(
      entity,
      context,
      layers
    );
    const expected = [
      {
        type: "static",
        label: null,
        format: ServiceDownloadFormat.FILE_GDB,
        url: "data-url-456",
      },
      {
        type: "static",
        label: null,
        format: ServiceDownloadFormat.CSV,
        url: "data-url-789",
      },
    ] as unknown as IStaticDownloadFormat[];

    expect(result).toEqual(expected);
    expect(buildExistingExportsPortalQuerySpy).toHaveBeenCalledWith("123", {
      layerId: 0,
    });
    expect(fetchAllPagesSpy).toHaveBeenCalledWith(searchItems, {
      q: "query",
      ...context.hubRequestOptions,
    });
    expect(getExportItemDataUrlSpy).toHaveBeenCalledTimes(2);
    expect(getExportItemDataUrlSpy).toHaveBeenCalledWith("456", context);
    expect(getExportItemDataUrlSpy).toHaveBeenCalledWith("789", context);
  });
});
