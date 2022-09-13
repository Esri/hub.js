import { isSafeRedirectUrl } from "../../src/urls/is-safe-redirect-url";
import * as domainExistsUtils from "../../src/sites/domains/domain-exists";

describe("isSafeRedirectUrl", function () {
  const externalUrl = "https://some.external.site.com";
  let domainExistsSpy;
  let hubRequestOptions;

  beforeEach(() => {
    hubRequestOptions = {};
    domainExistsSpy = spyOn(domainExistsUtils, "domainExists");
  });

  it("resolves true for whitelisted domains", async function () {
    const urls = [
      "http://arcgis.com/",
      "https://hubdev.arcgis.com/?a=b",
      "http://some-where2.hubdev.arcgis.com/?a=b&c=d",
      "http://esri.com/",
      "https://hubdev.esri.com/?a=b",
      "http://some-where2.hubdev.esri.com/?a=b&c=d",
    ];
    const results = await Promise.all(
      urls.map((url) => isSafeRedirectUrl({ url, ...hubRequestOptions }))
    );
    expect(results.every(Boolean)).toBe(true);
    expect(results).toEqual([true, true, true, true, true, true]);
    expect(domainExistsSpy).not.toHaveBeenCalled();
  });

  it("resolves true for non-whitelisted domains when domainExists resolves true", async function () {
    domainExistsSpy.and.returnValue(Promise.resolve(true));
    const results = await isSafeRedirectUrl({
      url: externalUrl,
      ...hubRequestOptions,
    });
    expect(results).toBe(true);
    expect(domainExistsSpy).toHaveBeenCalledTimes(1);
    expect(domainExistsSpy).toHaveBeenCalledWith(
      "some.external.site.com",
      hubRequestOptions
    );
  });

  it("resolves false for non-whitelisted domains when domainExists resolves false", async function () {
    domainExistsSpy.and.returnValue(Promise.resolve(false));
    const results = await isSafeRedirectUrl({
      url: externalUrl,
      ...hubRequestOptions,
    });
    expect(results).toBe(false);
    expect(domainExistsSpy).toHaveBeenCalledTimes(1);
    expect(domainExistsSpy).toHaveBeenCalledWith(
      "some.external.site.com",
      hubRequestOptions
    );
  });

  it("resolves false for non-whitelisted domains when an error occurs", async function () {
    domainExistsSpy.and.returnValue(Promise.reject(new Error("fail")));
    const results = await isSafeRedirectUrl({
      url: externalUrl,
      ...hubRequestOptions,
    });
    expect(results).toBe(false);
    expect(domainExistsSpy).toHaveBeenCalledTimes(1);
    expect(domainExistsSpy).toHaveBeenCalledWith(
      "some.external.site.com",
      hubRequestOptions
    );
  });

  it("resolves false invalid protocols", async function () {
    const url = "some://where.external.com";
    domainExistsSpy.and.returnValue(Promise.resolve(true));
    const results = await isSafeRedirectUrl({ url, ...hubRequestOptions });
    expect(results).toBe(false);
    expect(domainExistsSpy).not.toHaveBeenCalled();
  });
});
