import { fetchHubTranslation } from "../../src/i18n/fetch-hub-translation";
import { IPortal } from "@esri/arcgis-rest-portal";
import * as fetchMock from "fetch-mock";

describe("fetchHubTranslation", function() {
  it("fetches a translation", async function() {
    const portal: IPortal = {
      name: "My Portal",
      id: "portal-id",
      isPortal: false,
      portalHostname: "devext.foo.bar"
    };

    const locale = "es";

    fetchMock.get(`end:/locales/${locale}.json`, { foo: { bar: "baz" } });

    const translation = await fetchHubTranslation("es", portal);

    expect(fetchMock.done()).toBeTruthy(
      "fetch called the expected number of times"
    );
    expect(translation.foo.bar).toEqual(
      "baz",
      "translation fetched successfully"
    );
  });

  it("throws an error when it fails", async function() {
    const portal: IPortal = {
      name: "My Portal",
      id: "portal-id",
      isPortal: false,
      portalHostname: "devext.foo.bar"
    };

    const locale = "es";

    fetchMock.get(`end:/locales/${locale}.json`, { status: 400 });

    try {
      await fetchHubTranslation("es", portal);
      fail(Error("translation fetch should not have succeeded"));
    } catch (err) {
      expect(err).toBeDefined("threw error");
      expect(err.message).toContain("Attempt to fetch locale");
    }
  });
});
