import {
  IExtent,
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-types";
import * as fetchMock from "fetch-mock";
import { ItemType } from "../../src";
import {
  shouldHaveDataUrl,
  getFileName,
  isUrl,
  isFeatureService,
  isService,
  isFeatureLayer,
  getFeatureServiceTitle,
  getFeatureLayerItem,
  getFeatureServiceItem,
  detectDataTypeFromHeader,
  detectDataTypeFromExtension,
  pingUrl,
  pingFeatureService,
} from "../../src/resources/_internal/_validate-url-helpers";

describe("_validate-url-helpers", () => {
  it("shouldHaveDataUrl", () => {
    ["Feature Service", "Document Link"].forEach((type) => {
      expect(shouldHaveDataUrl(type)).toBeFalsy();
    });
    expect(shouldHaveDataUrl("Image")).toBeTruthy();
  });

  it("getFileName", () => {
    // If the URL does not have a pathname then it returns hostname.
    let url = "https://hubqa.arcgis.com";
    expect(getFileName(url)).toBe("hubqa.arcgis.com");
    // Otherwise it does return the pathname.
    url = "https://hubqa.arcgis.com/item-test/test.csv";
    expect(getFileName(url)).toBe("test.csv");
    // Throws error
    try {
      getFileName("test");
    } catch (e) {
      expect(e.message).toBe("Error getting file name from data url");
    }
  });

  it("isUrl", () => {
    expect(isUrl("https://hubqa.arcgis.com")).toBeTruthy("valid url passes");
    // invalid url
    expect(isUrl("test")).toBeFalsy("Invalid url returns false");
  });

  it("isFeatureService", () => {
    expect(
      isFeatureService(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/FeatureServer"
      )
    ).toBeTruthy("valid FS returns true");
    // Image server fails.
    expect(
      isFeatureService(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/ImageServer"
      )
    ).toBeFalsy("Image server rejects");
    // Map server fails
    expect(
      isFeatureService(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/MapServer"
      )
    ).toBeFalsy("Map server rejects");
  });

  it("isService", () => {
    const servers = [
      "https://test.com/FeatureServer",
      "https://test.com/MapServer",
      "https://test.com/ImageServer",
    ];
    servers.forEach((server) => {
      expect(isService(server)).toBeTruthy("Servers pass");
    });
    expect(isService("https://test.com/test")).toBeFalsy(
      "non server does not pass"
    );
  });

  it("isFeatureLayer", () => {
    expect(
      isFeatureLayer(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/FeatureServer/0"
      )
    ).toBeTruthy("It has a layer");
    // no layer
    expect(
      isFeatureLayer(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/FeatureServer"
      )
    ).toBeFalsy("It does not have a layer");
    // Not feature service
    expect(
      isFeatureLayer(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/MapServer/0"
      )
    ).toBeFalsy("It is not a FeatureSErvice");
  });

  it("getFeatureServiceTitle", () => {
    expect(
      getFeatureServiceTitle(
        "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/FeatureServer"
      )
    ).toBe("2016_Crashes_Florida_view");
  });

  it("getFeatureLayerItem", () => {
    const url =
      "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/FeatureServer/0";
    const extent: IExtent = {
      // autocasts as new Extent()
      xmin: -9177811,
      ymin: 4247000,
      xmax: -9176791,
      ymax: 4247784,
      spatialReference: {
        wkid: 102100,
      },
    };
    const body: Partial<ILayerDefinition> = {
      name: "test",
      description: "this is a test",
      extent,
    };
    const result: any = {
      title: "test",
      description: "this is a test",
      extent,
      url,
    };
    expect(getFeatureLayerItem(url, body)).toEqual(result);
  });

  it("getFeatureServiceItem", () => {
    const url =
      "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/FeatureServer/0";
    const extent: IExtent = {
      // autocasts as new Extent()
      xmin: -9177811,
      ymin: 4247000,
      xmax: -9176791,
      ymax: 4247784,
      spatialReference: {
        wkid: 102100,
      },
    };

    const body: Partial<IFeatureServiceDefinition> = {
      serviceDescription: "This is a test",
      fullExtent: extent,
    };
    expect(getFeatureServiceItem(url, body)).toEqual({
      title: "2016_Crashes_Florida_view",
      description: "This is a test",
      extent,
      url,
    });

    const secondBody: Partial<IFeatureServiceDefinition> = {
      description: "This is a test",
      initialExtent: extent,
    };
    expect(getFeatureServiceItem(url, secondBody)).toEqual({
      title: "2016_Crashes_Florida_view",
      description: "This is a test",
      extent,
      url,
    });
  });

  it("detectDataTypeFromheader", () => {
    // if there's no content type....
    const noContentTypeHeaders = new Headers();
    expect(detectDataTypeFromHeader(noContentTypeHeaders)).toBeFalsy();
    // run through expected types.
    const types = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/geo+json",
      "application/test",
    ];
    types.forEach((type) => {
      const headers = new Headers();
      headers.append("Content-Type", type);
      const result = detectDataTypeFromHeader(headers);
      expect(result).toBe(ItemType[result]);
    });
  });

  it("detectDataTypeFromExtension", () => {
    const urls = [
      "https://notrealurl.com/test.csv",
      "https://notrealurl.com/test.xls",
      "https://notrealurl.com/test.xlsx",
      "https://notrealurl.com/test.pdf",
      "https://notrealurl.com/test.jpeg",
      "https://notrealurl.com/test.jpg",
      "https://notrealurl.com/test.png",
      "https://notrealurl.com/test.geojson",
    ];
    urls.forEach((url) => {
      expect(detectDataTypeFromExtension(url)).toBeTruthy();
    });
    // ensure one not in the list doesn't get through
    expect(
      detectDataTypeFromExtension("https://notrealurl.com/test.kml")
    ).toBeFalsy();
  });

  describe("ping url and ping feature service", () => {
    const response = { ok: true };
    beforeEach(() => {
      fetchMock.mock("*", { status: 200, body: response });
    });
    afterEach(fetchMock.restore);

    it("pingUrl", async () => {
      const result = await pingUrl("https://notrealurl.com/test.csv");
      expect(result.ok).toBeTruthy();
    });

    it("pingFeatureService response fails", async () => {
      fetchMock.reset();
      fetchMock.mock("*", { status: 400, body: { ok: false } });
      const result = await pingFeatureService(
        "https://notrealurl.com/services/test/FeatureServer"
      );
      expect(result.ok).toBeFalsy();
    });

    it("pingFeatureService status 200 bbut really a failure", async () => {
      fetchMock.reset();
      fetchMock.mock("*", { status: 200, body: { ok: true, error: {} } });
      const result = await pingFeatureService(
        "https://notrealurl.com/services/test/FeatureServer"
      );
      expect(result.ok).toBeFalsy();
    });

    it("pingFeatureService works for feature layers", async () => {
      const url = "https://notrealurl.com/services/test/FeatureServer/0";
      const extent: IExtent = {
        // autocasts as new Extent()
        xmin: -9177811,
        ymin: 4247000,
        xmax: -9176791,
        ymax: 4247784,
        spatialReference: {
          wkid: 102100,
        },
      };
      const body: Partial<ILayerDefinition> = {
        name: "test",
        description: "This is a test",
        extent,
      };
      fetchMock.reset();
      fetchMock.mock("*", {
        status: 200,
        body,
      });
      const result = await pingFeatureService(url);
      expect(result.ok).toBeTruthy();
      expect(result.item.title).toBe(body.name);
      expect(result.item.description).toBe(body.description);
      expect(result.item.extent).toEqual(extent);
      expect(result.item.url).toBe(url);
    });

    it("pingFeatureService works for feature servers", async () => {
      const url = "https://notrealurl.com/services/test/FeatureServer";
      const extent: IExtent = {
        // autocasts as new Extent()
        xmin: -9177811,
        ymin: 4247000,
        xmax: -9176791,
        ymax: 4247784,
        spatialReference: {
          wkid: 102100,
        },
      };
      const body: Partial<IFeatureServiceDefinition> = {
        serviceDescription: "This is a test",
        fullExtent: extent,
      };
      fetchMock.reset();
      fetchMock.mock("*", {
        status: 200,
        body,
      });
      const result = await pingFeatureService(url);
      expect(result.ok).toBeTruthy();
      expect(result.item.title).toBe("test");
      expect(result.item.description).toBe(body.serviceDescription);
      expect(result.item.extent).toEqual(extent);
      expect(result.item.url).toBe(url);
    });
  });
});
