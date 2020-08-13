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

  describe("feature-service items", () => {
    it("no layer id, no lastEditDate, not cached", async done => {
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
              'type:"CSV" AND typekeywords:"export:abcdef0123456789abcdef0123456789,spatialRefId:undefined"',
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

    it("no lastEditDate, not cached", async done => {
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
              'type:"CSV" AND typekeywords:"export:abcdef0123456789abcdef0123456789_0,spatialRefId:undefined"',
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

    it("no lastEditDate, cached, ready (unknown)", async done => {
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

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({});
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
              'type:"CSV" AND typekeywords:"export:abcdef0123456789abcdef0123456789,spatialRefId:undefined"',
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

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
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
          lastEditDate: "2020-03-17T13:14:36.000Z",
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
              'type:"CSV" AND typekeywords:"export:abcdef0123456789abcdef0123456789_0,spatialRefId:undefined"',
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

        const getLayerSpy = spyOn(featureLayer, "getLayer").and.returnValue(
          new Promise(resolve => {
            resolve({
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
          lastEditDate: "2020-03-17T13:14:36.000Z",
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
              'type:"CSV" AND typekeywords:"export:abcdef0123456789abcdef0123456789_0,spatialRefId:undefined"',
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
        datasetId: "abcdef0123456789abcdef0123456789_0",
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
            'type:"CSV" AND typekeywords:"export:abcdef0123456789abcdef0123456789_0,spatialRefId:4326"',
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
