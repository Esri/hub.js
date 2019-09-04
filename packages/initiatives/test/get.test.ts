/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getInitiative, lookupSiteUrlByInitiative } from "../src/get";
import * as fetchMock from "fetch-mock";

describe("Initiatives :: ", () => {
  describe("getInitiative :: ", () => {
    const itemBaseUrl = "https://www.arcgis.com/sharing/rest/content/items";
    afterEach(fetchMock.restore);

    it("should make an item and data request", done => {
      const m = {
        item: {
          id: "3ef",
          title: "Fake initiative 1",
          type: "Hub Initiative",
          properties: {}
        },
        data: {
          source: "bc3",
          values: {}
        }
      };

      fetchMock.once(`${itemBaseUrl}/3ef?f=json`, m.item);
      fetchMock.once(`${itemBaseUrl}/3ef/data?f=json`, m.data);

      getInitiative("3ef")
        .then(model => {
          expect(model.item).toBeDefined();
          expect(model.item.properties.schemaVersion).toEqual(2.1);
          expect(model.data).toBeDefined();
          expect(fetchMock.done()).toBeTruthy();
          const [url]: [string, RequestInit] = fetchMock.lastCall(
            `${itemBaseUrl}/3ef?f=json`
          );
          expect(url).toContain("f=json");
          expect(url).toContain("items/3ef");
          const [dataUrl]: [string, RequestInit] = fetchMock.lastCall(
            `${itemBaseUrl}/3ef/data?f=json`
          );
          expect(dataUrl).toContain("f=json");
          expect(dataUrl).toContain("3ef/data");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should skip schema upgrade if on current version", done => {
      const m = {
        item: {
          id: "3ef",
          title: "Fake initiative 2",
          type: "Hub Initiative",
          properties: {
            schemaVersion: 2
          }
        },
        data: {
          source: "bc3",
          values: {}
        }
      };
      fetchMock.once(`${itemBaseUrl}/3ef?f=json`, m.item);
      fetchMock.once(`${itemBaseUrl}/3ef/data?f=json`, m.data);
      getInitiative("3ef")
        .then(model => {
          expect(model.item).toBeDefined("model.item should be defined");
          expect(model.data).toBeDefined("model.data should be defined");
          // this test is really checking that the schema upgrade
          // was NOT run... spyOn was not working reliably
          expect(model.data.assets).not.toBeDefined(
            "schemaUpgrade should not be run"
          );
          expect(fetchMock.done()).toBeTruthy();
          const [url]: [string, RequestInit] = fetchMock.lastCall(
            `${itemBaseUrl}/3ef?f=json`
          );
          expect(url).toContain("f=json");
          expect(url).toContain("items/3ef");
          const [dataUrl]: [string, RequestInit] = fetchMock.lastCall(
            `${itemBaseUrl}/3ef/data?f=json`
          );
          expect(dataUrl).toContain("f=json");
          expect(dataUrl).toContain("3ef/data");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe("lookupSiteUrlByInitiative :: ", () => {
    const itemBaseUrl = "https://www.arcgis.com/sharing/rest/content/items";
    afterEach(fetchMock.restore);
    it("should reject if initiative does not have a siteId", done => {
      fetchMock.once(`${itemBaseUrl}/3ef?f=json`, {
        id: "3ef",
        title: "Fake initiative",
        type: "Hub Initiative",
        properties: {}
      });

      lookupSiteUrlByInitiative("3ef").catch(ex => {
        expect(ex.message).toBe("Initiative does not have an associated site");
        done();
      });
    });

    it("should return custom domain if multiple entries exist", done => {
      fetchMock.once(`${itemBaseUrl}/3ef?f=json`, {
        id: "3ef",
        title: "Fake initiative",
        type: "Hub Initiative",
        properties: {
          siteId: "5bc"
        }
      });
      fetchMock.once(
        `https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc`,
        [{ domain: "data.foo.com" }, { domain: "org.hub.arcgis.com" }]
      );
      lookupSiteUrlByInitiative("3ef")
        .then(domain => {
          expect(domain).toBe("data.foo.com");
          // ensure all mocks were used
          expect(fetchMock.done()).toBeTruthy();
          const [url]: [string, RequestInit] = fetchMock.lastCall(
            `${itemBaseUrl}/3ef?f=json`
          );
          expect(url).toContain("f=json");
          expect(url).toContain("items/3ef");
          const [domainUrl]: [string, RequestInit] = fetchMock.lastCall(
            "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
          );
          expect(domainUrl).toContain("siteId=5bc");
          done();
        })
        .catch(() => fail());
    });
    it("should return first if multiple non-custom entries exist", done => {
      fetchMock.once(`${itemBaseUrl}/3ef?f=json`, {
        id: "3ef",
        title: "Fake initiative",
        type: "Hub Initiative",
        properties: {
          siteId: "5bc"
        }
      });
      fetchMock.once(
        `https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc`,
        [
          { domain: "org-beta.hub.arcgis.com" },
          { domain: "org.hub.arcgis.com" }
        ]
      );
      lookupSiteUrlByInitiative("3ef")
        .then(domain => {
          expect(domain).toBe("org-beta.hub.arcgis.com");
          // ensure all mocks were used
          expect(fetchMock.done()).toBeTruthy();
          const [url]: [string, RequestInit] = fetchMock.lastCall(
            `${itemBaseUrl}/3ef?f=json`
          );
          expect(url).toContain("f=json");
          expect(url).toContain("items/3ef");
          const [domainUrl]: [string, RequestInit] = fetchMock.lastCall(
            "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
          );
          expect(domainUrl).toContain("siteId=5bc");
          done();
        })
        .catch(() => fail());
    });
  });
});
