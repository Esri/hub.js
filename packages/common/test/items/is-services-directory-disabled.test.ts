import { isServicesDirectoryDisabled } from "../../src/items/is-services-directory-disabled";
import { IItem } from "@esri/arcgis-rest-types";
import * as fetchMock from "fetch-mock";
import * as restPortal from "@esri/arcgis-rest-portal";
import {
  IAuthenticationManager,
  IRequestOptions,
} from "@esri/arcgis-rest-request";

describe("isServicesDirectoryDisabled", function () {
  const url =
    "https://maps.bouldercounty.org/arcgis/rest/services/PublicSafety/POLICE_STATIONS/MapServer";
  let item: IItem;
  let requestOptions: IRequestOptions;
  let getItemSpy: jasmine.Spy;

  beforeEach(() => {
    item = {
      id: "abc",
      url,
    } as IItem;

    requestOptions = {} as IRequestOptions;

    getItemSpy = spyOn(restPortal, "getItem").and.returnValue(
      Promise.resolve(item)
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it("should resolve true when an error occurs", async () => {
    getItemSpy.and.returnValue(Promise.reject(new Error("fail")));
    const result = await isServicesDirectoryDisabled(item.id, requestOptions);
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith(item.id, requestOptions);
    expect(result).toBe(true);
  });

  it("should resolve true when the item has no url", async () => {
    delete item.url;
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should fetch the item when given an id", async () => {
    fetchMock.get(url, 200);
    const result = await isServicesDirectoryDisabled(item.id, requestOptions);
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith(item.id, requestOptions);
    expect(result).toBe(false);
  });

  it("should resolve true when the status is not 200", async () => {
    fetchMock.get(url, 403);
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should append the token when access is not public and user has a session", async () => {
    const token = "token123";
    const getTokenSpy = jasmine.createSpy().and.returnValue(token);
    requestOptions.authentication = {
      getToken: getTokenSpy,
    } as any as IAuthenticationManager;
    fetchMock.get(`${url}?token=${token}`, 200);
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("should not append the token when a token is not returned", async () => {
    const getTokenSpy = jasmine.createSpy().and.returnValue(null);
    requestOptions.authentication = {
      getToken: getTokenSpy,
    } as any as IAuthenticationManager;
    fetchMock.get(url, 200);
    const result = await isServicesDirectoryDisabled(item, requestOptions);
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
