import { describe, it, expect, afterEach } from "vitest";
import { fetchHubTranslation } from "../../src/i18n/fetch-hub-translation";
import { IPortal } from "@esri/arcgis-rest-portal";
import * as fetchMock from "fetch-mock";

describe("fetchHubTranslation", function () {
  afterEach(() => {
    fetchMock.restore();
  });

  it("fetches a translation", async function () {
    const portal: IPortal = {
      name: "My Portal",
      id: "portal-id",
      isPortal: false,
      portalHostname: "devext.foo.bar",
    };

    const locale = "es";

    fetchMock.get(`end:/locales/${locale}.json`, { foo: { bar: "baz" } });

    const translation = await fetchHubTranslation("es", portal);

    expect(fetchMock.done()).toBeTruthy();
    expect(translation.foo.bar).toEqual("baz");
  });

  it("allows you to set mode", async function () {
    const portal: IPortal = {
      name: "My Portal",
      id: "portal-id",
      isPortal: false,
      portalHostname: "devext.foo.bar",
    };

    const locale = "es";

    fetchMock.get(`end:/locales/${locale}.json`, { foo: { bar: "baz" } });

    const translation = await fetchHubTranslation("es", portal, "same-origin");

    expect(fetchMock.calls()[0][1].mode).toBe("same-origin");
    expect(translation.foo.bar).toEqual("baz");
  });

  it("throws an error when it fails", async function () {
    const portal: IPortal = {
      name: "My Portal",
      id: "portal-id",
      isPortal: false,
      portalHostname: "devext.foo.bar",
    };

    const locale = "es";

    fetchMock.get(`end:/locales/${locale}.json`, { status: 400 });

    await expect(fetchHubTranslation("es", portal)).rejects.toThrow(
      /Attempt to fetch locale/
    );
  });
});
