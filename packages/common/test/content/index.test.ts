import { isProxiedCSV, getProxyUrl, IHubRequestOptions } from "../../src";
import { IItem } from "@esri/arcgis-rest-portal";

describe("isProxiedCSV", () => {
  it("returns false when in a portal environment", () => {
    const item = {
      access: "public",
      type: "CSV",
      size: 9001,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: true,
    };

    expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
  });

  it("returns false when access is not public", () => {
    const item = {
      access: "private",
      type: "CSV",
      size: 9001,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
    };

    expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
  });

  it("returns false when type is not CSV", () => {
    const item = {
      access: "public",
      type: "Feature Service",
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
    };

    expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
  });

  it("returns false when size is greater than the max allowed", () => {
    const item = {
      access: "public",
      type: "CSV",
      size: 5000001,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
    };

    expect(isProxiedCSV(item, requestOptions)).toBeFalsy();
  });

  it("returns true when the item is a proxied csv", () => {
    const item = {
      access: "public",
      type: "CSV",
      size: 500000,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
    };

    expect(isProxiedCSV(item, requestOptions)).toBeTruthy();
  });
});

describe("getProxyUrl", () => {
  it("returns undefined when item cannot be a proxied csv", () => {
    const item = {
      access: "private",
      type: "CSV",
      size: 500000,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "https://opendata.arcgis.com",
    };

    const url = getProxyUrl(item, requestOptions);
    expect(url).toBeUndefined();
  });

  it("returns url when item is a proxied csv", () => {
    const item = {
      access: "public",
      type: "CSV",
      size: 500000,
      id: 0,
    } as unknown as IItem;

    const requestOptions: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "https://opendata.arcgis.com",
    };

    const url = getProxyUrl(item, requestOptions);
    expect(url).toBe(
      "https://opendata.arcgis.com/datasets/0_0/FeatureServer/0"
    );
  });
});
