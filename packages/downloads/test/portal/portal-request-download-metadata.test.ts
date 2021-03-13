import * as fetchMock from "fetch-mock";
import * as portal from "@esri/arcgis-rest-portal";
import * as featureLayer from "@esri/arcgis-rest-feature-layer";
import { UserSession } from "@esri/arcgis-rest-auth";
import { portalRequestDownloadMetadata } from "../../src/portal/portal-request-download-metadata";

describe("portalRequestDownloadMetadata", () => {
  const authentication = new UserSession({
    username: "portal-user",
    portal: `http://portal.com/sharing/rest`,
    token: "123"
  });
  authentication.getToken = () =>
    new Promise(resolve => {
      resolve("123");
    });
  afterEach(() => fetchMock.restore());

  describe("portal errors", () => {
    it("handle remote server 502 error", async done => {
      try {
        fetchMock.mock(
          "http://portal.com/sharing/rest/content/items/abcdef0123456789abcdef0123456789?f=json&token=123",
          {
            status: 502
          }
        );

        await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });
      } catch (err) {
        expect(err.code).toEqual("HTTP 502");
      } finally {
        done();
      }
    });

    it("handle missing invalid token", async done => {
      try {
        fetchMock.mock(
          "http://portal.com/sharing/rest/content/items/abcdef0123456789abcdef0123456789?f=json&token=123",
          {
            status: 200,
            body: {
              error: {
                code: 498,
                message: "Invalid token.",
                details: []
              }
            }
          }
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual(undefined);
      } catch (err) {
        expect(err.message).toEqual("498: Invalid token.");
      } finally {
        done();
      }
    });
  });

  describe("non-service item", () => {
    it("not cached", async done => {
      try {
        spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "CSV",
              modified: new Date(1593450876000).getTime()
            });
          })
        );

        spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: "2020-06-29T17:14:36.000Z",
          status: "not_ready"
        });
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("cached, stale", async done => {
      try {
        spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "CSV",
              modified: new Date(1593450876000).getTime()
            });
          })
        );

        spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1583450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: "2020-06-29T17:14:36.000Z",
          status: "stale",
          contentLastModified: "2020-03-05T23:27:56.000Z",
          lastModified: "2020-03-05T23:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("cached, ready", async done => {
      try {
        spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "CSV",
              modified: new Date(1593450876000).getTime()
            });
          })
        );

        spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1594450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: "2020-06-29T17:14:36.000Z",
          status: "ready",
          contentLastModified: "2020-07-11T07:01:16.000Z",
          lastModified: "2020-07-11T07:01:16.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });

  describe("feature-service items, format CSV", () => {
    it("no layer id, single-layer, no lastEditDate, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({ id: 0 });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, no lastEditDate, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({ id: 0 });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, has lastEditDate, not cached", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: elevenMinsAgo.toISOString(),
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, has lastEditDate within 10 mins, not cached, targets hub", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: nineMinutesAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, has lastEditDate within 10 mins, not cached, targets portal", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: nineMinutesAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          target: "portal"
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "locked"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, has lastEditDate within 10 mins, not cached, targets enterprise", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );
        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: nineMinutesAgo.getTime() }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          target: "enterprise"
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, has recent lastEditDate, not cached, item download disabled", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadsConfig: {
                  enabled: false
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: nineMinutesAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "disabled"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, single-layer, has lastEditDate, not cached, format download disabled", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadsConfig: {
                  enabled: true,
                  formats: {
                    csv: {
                      enabled: false
                    }
                  }
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: nineMinutesAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "disabled"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, no layers, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({});
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({});
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(0);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, no lastEditDate, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({ id: 0 });
          }),
          new Promise(resolve => {
            resolve({ id: 1 });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("layer id, multi-layer, no lastEditDate, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayer = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({ id: 0 });
          }),
          new Promise(resolve => {
            resolve({ id: 1 });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789_0:CSV:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayer.calls.count()).toEqual(2);
        expect(getLayer.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayer.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, has lastEditDate, not cached", async done => {
      const twelveMinsAgo = new Date(new Date().getTime() - 12 * 60 * 1000);
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: twelveMinsAgo.getTime() }
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: elevenMinsAgo.toISOString(),
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, has lastEditDate within 10 mins, not cached, targets hub", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );
        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1,
              editingInfo: { lastEditDate: nineMinsAgo.getTime() }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });
        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, has lastEditDate within 10 mins, not cached, targets portal", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1,
              editingInfo: { lastEditDate: nineMinsAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication,
          target: "portal"
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "locked"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, has lastEditDate within 10 mins, not cached, targets enterprise", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );
        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1,
              editingInfo: { lastEditDate: nineMinsAgo.getTime() }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication,
          target: "enterprise"
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, has lastEditDate, not cached, item download disabled", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadsConfig: {
                  enabled: false
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1,
              editingInfo: { lastEditDate: nineMinsAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "disabled"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, multi-layer, has lastEditDate, not cached, format download disabled", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadsConfig: {
                  formats: {
                    csv: {
                      enabled: false
                    }
                  }
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: { lastEditDate: elevenMinsAgo.getTime() }
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1,
              editingInfo: { lastEditDate: nineMinsAgo.getTime() }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:CSV:undefined:undefined:undefined",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "disabled"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("no layer id, single-layer, no lastEditDate, cached, ready (unknown)", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({ id: 0 });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1594450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: undefined,
          status: "ready_unknown",
          contentLastModified: "2020-07-11T07:01:16.000Z",
          lastModified: "2020-07-11T07:01:16.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate, cached, ready", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: new Date(1584450876000).getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1594450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: new Date(1584450876000).toISOString(),
          status: "ready",
          contentLastModified: "2020-07-11T07:01:16.000Z",
          lastModified: "2020-07-11T07:01:16.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate within last 10 mins, cached, ready, targets hub", async done => {
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: nineMinsAgo.getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );
        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinsAgo.getTime()
              }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: nineMinsAgo.getTime()
                }
              ]
            });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });
        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "ready",
          contentLastModified: nineMinsAgo.toISOString(),
          lastModified: nineMinsAgo.toISOString(),
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate within last 10 mins, cached, ready, targets portal", async done => {
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: nineMinsAgo.getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinsAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: nineMinsAgo.getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          target: "portal"
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "ready",
          contentLastModified: nineMinsAgo.toISOString(),
          lastModified: nineMinsAgo.toISOString(),
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate within last 10 mins, cached, ready, targets enterprise", async done => {
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: nineMinsAgo.getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinsAgo.getTime()
              }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: nineMinsAgo.getTime()
                }
              ]
            });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          target: "enterprise"
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "ready",
          contentLastModified: nineMinsAgo.toISOString(),
          lastModified: nineMinsAgo.toISOString(),
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate, cached, ready, item download disabled", async done => {
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: nineMinsAgo.getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadsConfig: {
                  enabled: false
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinsAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: nineMinsAgo.getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "disabled",
          contentLastModified: nineMinsAgo.toISOString(),
          lastModified: nineMinsAgo.toISOString(),
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate, cached, ready, format download disabled", async done => {
      const nineMinsAgo = new Date(new Date().getTime() - 9 * 60 * 1000);

      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: nineMinsAgo.getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadsConfig: {
                  formats: {
                    csv: {
                      enabled: false
                    }
                  }
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinsAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: nineMinsAgo.getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinsAgo.toISOString(),
          status: "disabled",
          contentLastModified: nineMinsAgo.toISOString(),
          lastModified: nineMinsAgo.toISOString(),
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate, cached, stale", async done => {
      const elevenMinsAgo = new Date(new Date().getTime() - 11 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1573450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: elevenMinsAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1574450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: elevenMinsAgo.toISOString(),
          status: "stale",
          contentLastModified: "2019-11-22T19:27:56.000Z",
          lastModified: "2019-11-22T19:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate within last 10 minutes, cached, stale, targets hub", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1573450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );
        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinutesAgo.getTime()
              }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1574450876000).getTime()
                }
              ]
            });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });
        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "stale",
          contentLastModified: "2019-11-22T19:27:56.000Z",
          lastModified: "2019-11-22T19:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate within last 10 minutes, cached, stale, targets portal", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1573450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinutesAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1574450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          target: "portal"
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "stale_locked",
          contentLastModified: "2019-11-22T19:27:56.000Z",
          lastModified: "2019-11-22T19:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate within last 10 minutes, cached, stale, targets enterprise", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1573450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );
        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinutesAgo.getTime()
              }
            });
          })
        );
        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1574450876000).getTime()
                }
              ]
            });
          })
        );
        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          target: "enterprise"
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "stale",
          contentLastModified: "2019-11-22T19:27:56.000Z",
          lastModified: "2019-11-22T19:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate, cached, stale, item download disabled", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1573450876).getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadConfig: {
                  enabled: false
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinutesAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1574450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "stale",
          contentLastModified: "2019-11-22T19:27:56.000Z",
          lastModified: "2019-11-22T19:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("has lastEditDate, cached, stale, format download disabled", async done => {
      const nineMinutesAgo = new Date(new Date().getTime() - 9 * 60 * 1000);
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1573450876).getTime(),
              url: "http://feature-service.com/FeatureServer",
              properties: {
                downloadConfig: {
                  formats: {
                    csv: {
                      enabled: false
                    }
                  }
                }
              }
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [
                {
                  id: 0
                }
              ]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
              id: 0,
              editingInfo: {
                lastEditDate: nineMinutesAgo.getTime()
              }
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1574450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: nineMinutesAgo.toISOString(),
          status: "stale",
          contentLastModified: "2019-11-22T19:27:56.000Z",
          lastModified: "2019-11-22T19:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(1);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:00,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });

  describe("feature-service items, format Shapefile", () => {
    it("no layer id, multi-layer, no lastEditDate, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "KML",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:KML:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"KML Collection" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });

  describe("feature-service items, format KML", () => {
    it("no layer id, multi-layer, no lastEditDate, not cached", async done => {
      try {
        const getItemSpy = spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "Feature Service",
              modified: new Date(1593450876).getTime(),
              url: "http://feature-service.com/FeatureServer"
            });
          })
        );

        const getServiceSpy = spyOn(featureLayer, "getService").and.returnValue(
          new Promise(resolve => {
            resolve({
              layers: [{ id: 0 }, { id: 1 }]
            });
          })
        );

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValues(
          new Promise(resolve => {
            resolve({
              id: 0
            });
          }),
          new Promise(resolve => {
            resolve({
              id: 1
            });
          })
        );

        const searchItemsSpy = spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({ results: [] });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "Shapefile",
          authentication
        });

        expect(result).toEqual({
          downloadId:
            "abcdef0123456789abcdef0123456789:Shapefile:undefined:undefined:undefined",
          lastEditDate: undefined,
          status: "not_ready"
        });

        expect(getItemSpy.calls.count()).toEqual(1);
        expect(getItemSpy.calls.argsFor(0)).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);
        expect(getServiceSpy.calls.count()).toEqual(1);
        expect(getServiceSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.count()).toEqual(2);
        expect(getLayerSpy.calls.argsFor(0)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/0",
            authentication
          }
        ]);
        expect(getLayerSpy.calls.argsFor(1)).toEqual([
          {
            url: "http://feature-service.com/FeatureServer/1",
            authentication
          }
        ]);
        expect(searchItemsSpy.calls.count()).toEqual(1);
        expect(searchItemsSpy.calls.argsFor(0)).toEqual([
          {
            authentication,
            num: 1,
            q:
              'type:"Shapefile" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:undefined"',
            sortField: "modified",
            sortOrder: "DESC"
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });

  describe("CSV items", () => {
    it("with spatialRefId", async done => {
      try {
        spyOn(portal, "getItem").and.returnValue(
          new Promise(resolve => {
            resolve({
              type: "CSV",
              modified: new Date(1593450876000).getTime()
            });
          })
        );

        spyOn(portal, "searchItems").and.returnValue(
          new Promise(resolve => {
            resolve({
              results: [
                {
                  id: "abcdef",
                  created: new Date(1583450876000).getTime()
                }
              ]
            });
          })
        );

        const result = await portalRequestDownloadMetadata({
          datasetId: "abcdef0123456789abcdef0123456789",
          format: "CSV",
          spatialRefId: "4326",
          authentication
        });

        expect(result).toEqual({
          downloadId: "abcdef",
          lastEditDate: "2020-06-29T17:14:36.000Z",
          status: "stale",
          contentLastModified: "2020-03-05T23:27:56.000Z",
          lastModified: "2020-03-05T23:27:56.000Z",
          downloadUrl:
            "http://portal.com/sharing/rest/content/items/abcdef/data?token=123"
        });

        expect(portal.getItem).toHaveBeenCalledTimes(1);
        expect((portal.getItem as any).calls.first().args).toEqual([
          "abcdef0123456789abcdef0123456789",
          {
            authentication
          }
        ]);

        expect(portal.searchItems).toHaveBeenCalledTimes(1);
        expect((portal.searchItems as any).calls.first().args).toEqual([
          {
            q:
              'type:"CSV" AND typekeywords:"exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,spatialRefId:4326"',
            num: 1,
            sortField: "modified",
            sortOrder: "DESC",
            authentication
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });
});
