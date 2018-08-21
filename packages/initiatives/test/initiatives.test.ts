import * as Initiative from "../src/index";
import * as fetchMock from "fetch-mock";
import { IInitiativeModel, cloneObject } from "@esri/hub-common";

describe("get()", () => {
  const itemBaseUrl = "https://www.arcgis.com/sharing/rest/content/items";
  afterEach(fetchMock.restore);

  it("should make an item request w/o fetching data", done => {
    fetchMock.once(`${itemBaseUrl}/5cd?f=json`, {
      id: "5cd",
      title: "Fake initiative",
      type: "Hub Initiative"
    });
    Initiative.fetchInitiative("5cd", {
      data: false
    })
      .then(initiative => {
        expect(initiative.item.id).toBe("5cd");
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          `${itemBaseUrl}/5cd?f=json`
        );
        expect(url).toContain("f=json");
        expect(url).toContain("items/5cd");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  // it('should spy on a method', done => {
  //   let m = {} as IInitiativeModel;
  //   let chk = Initiative.upgradeSchema(m, 'https://foo.com');
  //   expect(upgradeSchemaSpy.calls.count()).toEqual(1);
  //   done();
  // })

  it("should make an item and data request", done => {
    const m = {
      item: {
        id: "3ef",
        title: "Fake initiative",
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

    Initiative.fetchInitiative("3ef")
      .then(model => {
        expect(model.item).toBeDefined();
        expect(model.item.properties.schemaVersion).toEqual(2);
        expect(model.data).toBeDefined();
        expect(fetchMock.done()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          `${itemBaseUrl}/3ef?f=json`
        );
        expect(url).toContain("f=json");
        expect(url).toContain("items/3ef");
        const [dataUrl, dataOptions]: [
          string,
          RequestInit
        ] = fetchMock.lastCall(`${itemBaseUrl}/3ef/data?f=json`);
        expect(dataUrl).toContain("f=json");
        expect(dataUrl).toContain("3ef/data");
        // expect(upgradeSchemaSpy.calls.count()).toEqual(1);
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
        title: "Fake initiative",
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
    Initiative.fetchInitiative("3ef")
      .then(model => {
        expect(model.item).toBeDefined();
        expect(model.data).toBeDefined();
        // this test is really checking that the schema upgrade
        // was NOT run... spyOn was not working reliably
        expect(model.data.assets).not.toBeDefined(
          "schemaUpgrade should not be run"
        );
        expect(fetchMock.done()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          `${itemBaseUrl}/3ef?f=json`
        );
        expect(url).toContain("f=json");
        expect(url).toContain("items/3ef");
        const [dataUrl, dataOptions]: [
          string,
          RequestInit
        ] = fetchMock.lastCall(`${itemBaseUrl}/3ef/data?f=json`);
        expect(dataUrl).toContain("f=json");
        expect(dataUrl).toContain("3ef/data");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});

describe("lookupSiteUrlByInitiative", () => {
  const itemBaseUrl = "https://www.arcgis.com/sharing/rest/content/items";
  afterEach(fetchMock.restore);
  it("should reject if initiative does not have a siteId", done => {
    fetchMock.once(`${itemBaseUrl}/3ef?f=json`, {
      id: "3ef",
      title: "Fake initiative",
      type: "Hub Initiative",
      properties: {}
    });

    Initiative.lookupSiteUrlByInitiative("3ef").catch(ex => {
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
    Initiative.lookupSiteUrlByInitiative("3ef").then(domain => {
      expect(domain).toBe("data.foo.com");
      // ensure all mocks were used
      expect(fetchMock.done()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall(
        `${itemBaseUrl}/3ef?f=json`
      );
      expect(url).toContain("f=json");
      expect(url).toContain("items/3ef");
      const [domainUrl, domainOptions]: [
        string,
        RequestInit
      ] = fetchMock.lastCall(
        "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
      );
      expect(domainUrl).toContain("siteId=5bc");
      done();
    });
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
      [{ domain: "org-beta.hub.arcgis.com" }, { domain: "org.hub.arcgis.com" }]
    );
    Initiative.lookupSiteUrlByInitiative("3ef").then(domain => {
      expect(domain).toBe("org-beta.hub.arcgis.com");
      // ensure all mocks were used
      expect(fetchMock.done()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall(
        `${itemBaseUrl}/3ef?f=json`
      );
      expect(url).toContain("f=json");
      expect(url).toContain("items/3ef");
      const [domainUrl, domainOptions]: [
        string,
        RequestInit
      ] = fetchMock.lastCall(
        "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
      );
      expect(domainUrl).toContain("siteId=5bc");
      done();
    });
  });
});
