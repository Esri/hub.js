import * as fetchMock from "fetch-mock";
import { UserSession } from "@esri/arcgis-rest-auth";
import { requestDownloadMetadata } from "../src/request-download-metadata";

describe("requestDownloadMetadata", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("handle hub download", async (done) => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/downloads?spatialRefId=4326&formats=csv",
        {
          status: 200,
          body: {
            data: [
              {
                id: "dd4580c810204019a7b8eb3e0b329dd6_0",
                type: "downloads",
                attributes: {
                  spatialRefId: "4326",
                  format: "CSV",
                  contentLength: 1391454,
                  lastModified: "2020-06-17T13:04:28.000Z",
                  contentLastModified: "2020-06-17T01:16:01.933Z",
                  cacheTime: 13121,
                  status: "stale",
                  featureSet: "full",
                  source: {
                    type: "Feature Service",
                    url: "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0?f=json",
                    supportsExtract: true,
                    lastEditDate: "2020-06-18T01:17:31.492Z",
                    spatialRefId: "4326",
                  },
                },
                links: {
                  content:
                    "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv",
                },
              },
            ],
          },
        }
      );

      const result = await requestDownloadMetadata({
        host: "http://hub.com/",
        datasetId: "dd4580c810204019a7b8eb3e0b329dd6_0",
        spatialRefId: "4326",
        format: "CSV",
      });

      expect(result).toEqual({
        downloadId:
          "dd4580c810204019a7b8eb3e0b329dd6_0:CSV:4326:undefined:undefined",
        contentLastModified: "2020-06-17T01:16:01.933Z",
        lastEditDate: "2020-06-18T01:17:31.492Z",
        lastModified: "2020-06-17T13:04:28.000Z",
        status: "stale",
        errors: [],
        downloadUrl:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv",
        contentLength: 1391454,
        cacheTime: 13121,
      });
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });

  it("handle portal download", async (done) => {
    const host = `http://portal.com`;
    const authentication = new UserSession({
      username: "portal-user",
      portal: `${host}/sharing/rest`,
      token: "123",
    });
    authentication.getToken = () =>
      new Promise((resolve) => {
        resolve("123");
      });

    try {
      fetchMock.mock(
        "http://portal.com/sharing/rest/content/items/00cportalItemId?f=json&token=123",
        {
          status: 200,
          body: {
            type: "Feature Service",
            created: 1592360698651,
            modified: 1592360698651,
            url: "https://feature-service.com/FeatureServer",
          },
        }
      );

      fetchMock.post("https://feature-service.com/FeatureServer", {
        status: 200,
        body: {},
      });

      fetchMock.mock(
        "http://portal.com/sharing/rest/search?f=json&q=(typekeywords%3A%22exportItem%3A00cportalItemId%22%20AND%20typekeywords%3A%22exportLayer%3Anull%22)%20AND%20(%20(type%3A%22Shapefile%22%20AND%20typekeywords%3A%22spatialRefId%3A2227%22))&num=1&sortField=modified&sortOrder=DESC&token=123",
        {
          status: 200,
          body: {
            results: [],
          },
        }
      );

      fetchMock.mock(
        "http://portal.com/sharing/rest/search?f=json&q=type%3A%22CSV%20Collection%22%20AND%20typekeywords%3A%22exportItem%3A00cportalItemId%2CexportLayer%3Anull%2CspatialRefId%3A2227%22&num=1&sortField=modified&sortOrder=DESC&token=123",
        {
          status: 200,
          body: {
            results: [],
          },
        }
      );

      const result = await requestDownloadMetadata({
        datasetId: "00cportalItemId",
        format: "Shapefile",
        host,
        authentication,
        target: "portal",
        spatialRefId: "2227",
      });

      expect(result).toEqual({
        downloadId: "00cportalItemId:Shapefile:2227:undefined:undefined",
        lastEditDate: undefined,
        status: "not_ready",
      });
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle enterprise download", async (done) => {
    const host = "https://my-enterprise-box.portal.com";
    const authentication = new UserSession({
      username: "portal-user",
      portal: `${host}/sharing/rest`,
      token: "123",
    });
    authentication.getToken = () =>
      new Promise((resolve) => {
        resolve("123");
      });

    try {
      fetchMock.mock(
        "https://my-enterprise-box.portal.com/sharing/rest/content/items/00fEnterpriseItemId?f=json&token=123",
        {
          status: 200,
          body: {
            type: "Feature Service",
            created: 1592360698651,
            modified: 1592360698651,
            url: "https://feature-service.com/FeatureServer",
          },
        }
      );

      fetchMock.post("https://feature-service.com/FeatureServer", {
        status: 200,
        body: {},
      });

      fetchMock.mock(
        "https://my-enterprise-box.portal.com/sharing/rest/search?f=json&q=(typekeywords%3A%22exportItem%3A00fEnterpriseItemId%22%20AND%20typekeywords%3A%22exportLayer%3Anull%22)%20AND%20(%20(type%3A%22Shapefile%22%20AND%20typekeywords%3A%22spatialRefId%3A2227%22))&num=1&sortField=modified&sortOrder=DESC&token=123",
        {
          status: 200,
          body: {
            results: [],
          },
        }
      );

      fetchMock.mock(
        "https://my-enterprise-box.portal.com/sharing/rest/search?f=json&q=type%3A%22CSV%20Collection%22%20AND%20typekeywords%3A%22exportItem%3A00fEnterpriseItemId%2CspatialRefId%3A2227%22&num=1&sortField=modified&sortOrder=DESC&token=123",
        {
          status: 200,
          body: {
            results: [],
          },
        }
      );

      const result = await requestDownloadMetadata({
        datasetId: "00fEnterpriseItemId",
        format: "Shapefile",
        authentication,
        host,
        target: "enterprise",
        spatialRefId: "2227",
      });

      expect(result).toEqual({
        downloadId: "00fEnterpriseItemId:Shapefile:2227:undefined:undefined",
        lastEditDate: undefined,
        status: "not_ready",
      });
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });
});
