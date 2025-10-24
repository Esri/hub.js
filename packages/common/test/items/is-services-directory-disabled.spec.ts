import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getItem: vi.fn(),
}));
vi.mock("@esri/arcgis-rest-request", async (importOriginal) => ({
  ...(await importOriginal()),
  request: vi.fn(),
}));

import { isServicesDirectoryDisabled } from "../../src/items/is-services-directory-disabled";
import type { IItem } from "@esri/arcgis-rest-portal";
import * as fetchMock from "fetch-mock";
import * as restPortal from "@esri/arcgis-rest-portal";
import * as restRequest from "@esri/arcgis-rest-request";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

afterEach(() => {
  fetchMock.restore();
  vi.restoreAllMocks();
});

describe("isServicesDirectoryDisabled", () => {
  const url =
    "https://maps.bouldercounty.org/arcgis/rest/services/PublicSafety/POLICE_STATIONS/MapServer";
  let item: IItem;
  let requestOptions: any;

  beforeEach(() => {
    item = {
      id: "abc",
      url,
    } as IItem;

    requestOptions = {};

    vi.spyOn(restPortal as any, "getItem").mockResolvedValue(item);
  });

  it("should resolve true when an error occurs", async () => {
    (restPortal as any).getItem.mockRejectedValue(new Error("fail"));
    const result = await isServicesDirectoryDisabled(item.id, requestOptions);
    expect((restPortal as any).getItem).toHaveBeenCalledTimes(1);
    expect((restPortal as any).getItem).toHaveBeenCalledWith(
      item.id,
      requestOptions
    );
    expect(result).toBe(true);
  });

  it("should resolve true when the item has no url", async () => {
    delete item.url;
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect((restPortal as any).getItem).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should fetch the item when given an id", async () => {
    const requestSpy = vi
      .spyOn(restRequest as any, "request")
      .mockResolvedValue({ status: 200 });
    const result = await isServicesDirectoryDisabled(item.id, requestOptions);
    expect((restPortal as any).getItem).toHaveBeenCalledTimes(1);
    expect((restPortal as any).getItem).toHaveBeenCalledWith(
      item.id,
      requestOptions
    );
    expect(result).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(url, {
      ...requestOptions,
      rawResponse: true,
      httpMethod: "GET",
    });
  });

  it("should resolve true when the status is not 200", async () => {
    const requestSpy = vi
      .spyOn(restRequest as any, "request")
      .mockResolvedValue({ status: 403 });
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect((restPortal as any).getItem).not.toHaveBeenCalled();
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(url, {
      ...requestOptions,
      rawResponse: true,
      httpMethod: "GET",
    });
    expect(result).toBe(true);
  });

  it("should append the token when access is not public and user has a session", async () => {
    const token = "token123";
    const getTokenSpy = vi.fn().mockResolvedValue(token);

    requestOptions.authentication = {
      getToken: getTokenSpy,
    } as any as IAuthenticationManager;
    const requestSpy = vi
      .spyOn(restRequest as any, "request")
      .mockResolvedValue({ status: 200 });
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect((restPortal as any).getItem).not.toHaveBeenCalled();
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(`${url}?token=${token}`, {
      ...requestOptions,
      rawResponse: true,
      httpMethod: "GET",
    });
    expect(result).toBe(false);
  });

  it("should not append the token when a token is not returned", async () => {
    const getTokenSpy = vi.fn().mockResolvedValue("");
    requestOptions.authentication = {
      getToken: getTokenSpy,
    } as any as IAuthenticationManager;
    const requestSpy = vi
      .spyOn(restRequest as any, "request")
      .mockResolvedValue({ status: 200 });
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect((restPortal as any).getItem).not.toHaveBeenCalled();
    expect(result).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(url, {
      ...requestOptions,
      rawResponse: true,
      httpMethod: "GET",
    });
  });
});
