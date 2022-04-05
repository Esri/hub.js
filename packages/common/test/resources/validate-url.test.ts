import { IExtent } from "@esri/arcgis-rest-types";
import * as fetchMock from "fetch-mock";
import { validateUrl } from "../../src";

describe("validateUrl", () => {
  const response = { ok: true };
  beforeEach(() => {
    fetchMock.mock("*", { status: 200, body: response });
  });
  afterEach(fetchMock.restore);

  it("rejects if invalid url", async () => {
    const result = await validateUrl("test");
    expect(result.pass).toBeFalsy();
    expect(result.error).toBe("invalidFormat");
  });

  it("rejects if null input", async () => {
    const result = await validateUrl("");
    expect(result.pass).toBeFalsy();
    expect(result.error).toBe("invalidFormat");
  });

  it("rejects for map service", async () => {
    const result = await validateUrl(
      "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/MapServer"
    );
    expect(result.pass).toBeFalsy();
    expect(result.error).toBe("invalidFormat");
  });

  it("rejects for image service", async () => {
    const result = await validateUrl(
      "https://test.com/test/arcgis/rest/services/2016_Crashes_Florida_view/ImageServer"
    );
    expect(result.pass).toBeFalsy();
    expect(result.error).toBe("invalidFormat");
  });

  it("rejects if the response fails", async () => {
    fetchMock.reset();
    fetchMock.mock("*", { status: 400, body: { ok: false } });
    const result = await validateUrl(
      "https://notrealurl.com/services/test/FeatureServer"
    );
    expect(result.pass).toBeFalsy();
    expect(result.error).toBe("invalidUrl");
  });

  it("rejects if the service status 200 but really a failure", async () => {
    fetchMock.reset();
    fetchMock.mock("*", { status: 200, body: { ok: true, error: {} } });
    const result = await validateUrl(
      "https://notrealurl.com/services/test/FeatureServer"
    );
    expect(result.pass).toBeFalsy();
    expect(result.error).toBe("invalidUrl");
  });

  it("Passes through if error is thrown fetching url (could be cors issue)", async () => {
    fetchMock.reset();
    fetchMock.mock("*", () => {
      throw new Error("Fake CORS err");
    });
    const result = await validateUrl(
      "https://notrealurl.com/services/test/FeatureServer"
    );
    expect(result.pass).toBeTruthy();
    expect(result.item).toEqual({
      title: "FeatureServer",
      type: "Feature Service",
      url: "https://notrealurl.com/services/test/FeatureServer",
    });
  });

  it("returns pass===true for data url with headers", async () => {
    fetchMock.reset();
    fetchMock.mock("*", {
      headers: {
        "Content-Type": "application/pdf",
      },
      status: 200,
    });
    const result = await validateUrl("https://notrealurl.com");
    expect(result.pass).toBeTruthy();
    expect(result.error).toBeFalsy();
    expect(result.type).toBe("PDF");

    expect(result.item).toEqual({
      title: "notrealurl.com",
      url: "https://notrealurl.com",
      type: "PDF",
      dataUrl: "https://notrealurl.com",
    });
  });

  it("returns pass === true for data url without headers", async () => {
    fetchMock.reset();
    fetchMock.mock("*", { status: 200, body: response });
    const result = await validateUrl("https://notrealurl.com/test.csv");
    expect(result.pass).toBeTruthy();
    expect(result.error).toBeFalsy();
    expect(result.type).toBe("CSV");

    expect(result.item).toEqual({
      title: "test.csv",
      url: "https://notrealurl.com/test.csv",
      type: "CSV",
      dataUrl: "https://notrealurl.com/test.csv",
    });
  });

  it("returns pass === true for data url without headers and with unknown type", async () => {
    fetchMock.reset();
    fetchMock.mock("*", { status: 200, body: response });
    const result = await validateUrl("https://notrealurl.com/test.kml");
    expect(result.pass).toBeTruthy();
    expect(result.error).toBeFalsy();

    expect(result.item).toEqual({
      title: "test.kml",
      url: "https://notrealurl.com/test.kml",
    });
  });

  it("can get item metadata from a feature service", async () => {
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
    fetchMock.reset();
    fetchMock.mock("*", {
      body: {
        description: "This is a test",
        fullExtent: extent,
      },
      status: 200,
    });
    const result = await validateUrl(url);
    expect(result.pass).toBeTruthy();
    expect(result.error).toBeFalsy();
    expect(result.type).toBe("Feature Service");

    expect(result.item).toEqual({
      title: "test",
      description: "This is a test",
      url,
      type: "Feature Service",
      extent,
    });
  });

  it("can get item metadata from a feature layer", async () => {
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
    fetchMock.reset();
    fetchMock.mock("*", {
      body: {
        name: "Test test",
        description: "This is a test",
        extent,
      },
      status: 200,
    });
    const result = await validateUrl(url);
    expect(result.pass).toBeTruthy();
    expect(result.error).toBeFalsy();
    expect(result.type).toBe("Feature Service");

    expect(result.item).toEqual({
      title: "Test test",
      description: "This is a test",
      url,
      type: "Feature Service",
      extent,
    });
  });
});
