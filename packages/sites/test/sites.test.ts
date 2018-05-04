import { fetchDomain } from "../src/index";
import * as fetchMock from "fetch-mock";

describe("lookupSiteUrlByInitiative", () => {
  afterEach(fetchMock.restore);

  it("should return a domain", done => {
    fetchMock.once(
      `https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc`,
      [{ domain: "data.foo.com" }]
    );

    fetchDomain("5bc").then(response => {
      expect(response[0].domain).toBe("data.foo.com");
      done();
    });
  });
});
