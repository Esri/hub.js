/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getInitiative } from "../src/get";
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
          const [url] = fetchMock.lastCall(`${itemBaseUrl}/3ef?f=json`);
          expect(url).toContain("f=json");
          expect(url).toContain("items/3ef");
          const [dataUrl] = fetchMock.lastCall(
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
          const [url] = fetchMock.lastCall(`${itemBaseUrl}/3ef?f=json`);
          expect(url).toContain("f=json");
          expect(url).toContain("items/3ef");
          const [dataUrl] = fetchMock.lastCall(
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
});
