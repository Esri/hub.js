import {
  ArcgisHubDownloadError,
  DownloadOperationStatus,
  IArcGISContext,
  IHubEditableContent,
  ServiceDownloadFormat,
} from "../../../../src";
import { fetchHubApiDownloadFile } from "../../../../src/downloads/_internal/file-url-fetchers/fetchHubApiDownloadFile";
import * as fetchMock from "fetch-mock";

describe("fetchHubApiDownloadFile", () => {
  afterEach(fetchMock.restore);
  it("throws an error if no layers are provided", async () => {
    try {
      await fetchHubApiDownloadFile({
        entity: { id: "123" } as unknown as IHubEditableContent,
        format: ServiceDownloadFormat.CSV,
        context: {
          hubUrl: "https://hubqa.arcgis.com",
          hubRequestOptions: {},
        } as unknown as IArcGISContext,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("No layers provided for download");
    }
  });
  it("throws an error if empty layers array is provided", async () => {
    try {
      await fetchHubApiDownloadFile({
        entity: { id: "123" } as unknown as IHubEditableContent,
        format: ServiceDownloadFormat.CSV,
        context: {
          hubUrl: "https://hubqa.arcgis.com",
          hubRequestOptions: {},
        } as unknown as IArcGISContext,
        layers: [],
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("No layers provided for download");
    }
  });
  it("throws an error if multiple layers are provided", async () => {
    try {
      await fetchHubApiDownloadFile({
        entity: { id: "123" } as unknown as IHubEditableContent,
        format: ServiceDownloadFormat.CSV,
        context: {
          hubUrl: "https://hubqa.arcgis.com",
          hubRequestOptions: {},
        } as unknown as IArcGISContext,
        layers: [0, 1],
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        "Multiple layer downloads are not yet supported"
      );
    }
  });
  it("throws an ArcgisHubDownloadError if the api returns an error during polling", async () => {
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        status: 500,
        body: { message: "Special Server Error" },
      }
    );
    try {
      await fetchHubApiDownloadFile({
        entity: { id: "123" } as unknown as IHubEditableContent,
        format: ServiceDownloadFormat.CSV,
        context: {
          hubUrl: "https://hubqa.arcgis.com",
          hubRequestOptions: {},
        } as unknown as IArcGISContext,
        layers: [0],
        pollInterval: 0,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof ArcgisHubDownloadError).toBeTruthy();
      expect(error.message).toBe("Special Server Error");
    }
  });
  it('throws an error when the api returns a status of "Failed"', async () => {
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      { body: { status: "Failed" } }
    );
    try {
      await fetchHubApiDownloadFile({
        entity: { id: "123" } as unknown as IHubEditableContent,
        format: ServiceDownloadFormat.CSV,
        context: {
          hubUrl: "https://hubqa.arcgis.com",
          hubRequestOptions: {},
        } as unknown as IArcGISContext,
        layers: [0],
        pollInterval: 0,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("Download operation failed with a 200");
    }
  });
  it("polls without a progress callback", async () => {
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        body: {
          status: "Pending",
        },
      }
    );
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        body: {
          status: "InProgress",
          recordCount: 100,
          progressInPercent: 50,
        },
      },
      { overwriteRoutes: false }
    );
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        body: {
          status: "Completed",
          resultUrl: "fake-url",
        },
      },
      { overwriteRoutes: false }
    );

    const result = await fetchHubApiDownloadFile({
      entity: { id: "123" } as unknown as IHubEditableContent,
      format: ServiceDownloadFormat.CSV,
      context: {
        hubUrl: "https://hubqa.arcgis.com",
        hubRequestOptions: {},
      } as unknown as IArcGISContext,
      layers: [0],
      pollInterval: 0,
    });

    expect(result).toBe({ type: "url", href: "fake-url" });
  });
  it("polls with a progress callback", async () => {
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        body: {
          status: "Pending",
        },
      }
    );
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        body: {
          status: "PagingData",
          recordCount: 100,
          progressInPercent: 50,
        },
      },
      { overwriteRoutes: false }
    );
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0",
      {
        body: {
          status: "Completed",
          resultUrl: "fake-url",
        },
      },
      { overwriteRoutes: false }
    );

    const progressCallback = jasmine
      .createSpy("progressCallback")
      .and.callFake((status: any, percent: any): any => null);
    const result = await fetchHubApiDownloadFile({
      entity: { id: "123" } as unknown as IHubEditableContent,
      format: ServiceDownloadFormat.CSV,
      context: {
        hubUrl: "https://hubqa.arcgis.com",
        hubRequestOptions: {},
      } as unknown as IArcGISContext,
      layers: [0],
      pollInterval: 0,
      progressCallback,
    });

    expect(result).toBe({ type: "url", href: "fake-url" });
    expect(progressCallback).toHaveBeenCalledTimes(3);
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.PENDING,
      undefined
    );
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.PROCESSING,
      50
    );
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.COMPLETED,
      undefined
    );
  });
  it("handles geometry, token and where parameters", async () => {
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/csv?redirect=false&layers=0&geometry=%7B%22type%22%3A%22point%22%2C%22coordinates%22%3A%5B1%2C2%5D%7D&where=1%3D1&token=fake-token",
      {
        body: {
          status: "Completed",
          resultUrl: "fake-url",
        },
      }
    );

    const result = await fetchHubApiDownloadFile({
      entity: { id: "123" } as unknown as IHubEditableContent,
      format: ServiceDownloadFormat.CSV,
      context: {
        hubUrl: "https://hubqa.arcgis.com",
        hubRequestOptions: {
          authentication: {
            token: "fake-token",
          },
        },
      } as unknown as IArcGISContext,
      layers: [0],
      geometry: {
        type: "point",
        toJSON: () => ({ type: "point", coordinates: [1, 2] }),
      } as unknown as __esri.Point,
      where: "1=1",
    });

    expect(result).toBe({ type: "url", href: "fake-url" });
  });
  it("Explicitly sets the spatialRefId to 4326 for GeoJSON and KML", async () => {
    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/geojson?redirect=false&layers=0&spatialRefId=4326",
      {
        body: {
          status: "Completed",
          resultUrl: "fake-url",
        },
      }
    );

    const result = await fetchHubApiDownloadFile({
      entity: { id: "123" } as unknown as IHubEditableContent,
      format: ServiceDownloadFormat.GEOJSON,
      context: {
        hubUrl: "https://hubqa.arcgis.com",
        hubRequestOptions: {},
      } as unknown as IArcGISContext,
      layers: [0],
    });

    expect(result).toBe({ type: "url", href: "fake-url" });

    fetchMock.once(
      "https://hubqa.arcgis.com/api/download/v1/items/123/kml?redirect=false&layers=0&spatialRefId=4326",
      {
        body: {
          status: "Completed",
          resultUrl: "fake-url-2",
        },
      }
    );

    const result2 = await fetchHubApiDownloadFile({
      entity: { id: "123" } as unknown as IHubEditableContent,
      format: ServiceDownloadFormat.KML,
      context: {
        hubUrl: "https://hubqa.arcgis.com",
        hubRequestOptions: {},
      } as unknown as IArcGISContext,
      layers: [0],
    });

    expect(result2).toBe({ type: "url", href: "fake-url-2" });
  });
});
