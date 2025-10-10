import * as fetchMock from "fetch-mock";
import { hubRequestDatasetExport } from "../../src/hub/hub-request-dataset-export";

describe("hubRequestDatasetExport", () => {
  afterEach(() => fetchMock.restore());

  it("handle remote server 502 error", async (done) => {
    try {
      fetchMock.post(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads",
        {
          status: 502,
        },
        {
          body: {
            spatialRefId: "4326",
            format: "csv",
          },
        }
      );

      await hubRequestDatasetExport({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        spatialRefId: "4326",
        format: "CSV",
      });
    } catch (err) {
      const error = err as { message?: string; status?: number; url?: string };
      const { message, status, url } = error;
      expect(message).toEqual("Bad Gateway");
      expect(status).toEqual(502);
      expect(url).toEqual(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads"
      );
    } finally {
      done();
    }
  });

  it("success", async (done) => {
    try {
      fetchMock.post(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads",
        {
          status: 200,
          body: {},
        },
        {
          body: {
            spatialRefId: "4326",
            format: "csv",
          },
        }
      );

      const json: any = await hubRequestDatasetExport({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        spatialRefId: "4326",
        format: "CSV",
      });
      expect(json.downloadId).toEqual(
        "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined"
      );
    } catch (err) {
      const error = err as { message?: string; status?: number; url?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });

  it("success with a host that has trailing slash", async (done) => {
    try {
      fetchMock.post(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads",
        {
          status: 200,
          body: {},
        },
        {
          body: {
            spatialRefId: "4326",
            format: "csv",
          },
        }
      );

      const json: any = await hubRequestDatasetExport({
        host: "http://hub.com/",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        spatialRefId: "4326",
        format: "CSV",
      });
      expect(json.downloadId).toEqual(
        "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined"
      );
    } catch (err) {
      const error = err as { message?: string; status?: number; url?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });
});
