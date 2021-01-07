import * as fetchMock from "fetch-mock";
import { hubPollDownloadMetadata } from "../../src/hub/hub-poll-download-metadata";
import * as EventEmitter from "eventemitter3";

function delay(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const exportFailed = {
  data: [
    {
      id: "dd4580c810204019a7b8eb3e0b329dd6_0",
      type: "downloads",
      attributes: {
        spatialRefId: "4326",
        format: "CSV",
        status: "error_creating",
        featureSet: "full",
        errors: [{ message: "Some error" }],
        source: {
          type: "Feature Service",
          url:
            "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0?f=json",
          supportsExtract: true,
          lastEditDate: "2020-06-18T01:17:31.492Z",
          spatialRefId: "4326"
        }
      },
      links: {
        content:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv"
      }
    }
  ]
};

const exportReady = {
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
        status: "ready",
        featureSet: "full",
        source: {
          type: "Feature Service",
          url:
            "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0?f=json",
          supportsExtract: true,
          lastEditDate: "2020-06-18T01:15:31.492Z",
          spatialRefId: "4326"
        }
      },
      links: {
        content:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv"
      }
    }
  ]
};

const exportReadyUnknown = {
  data: [
    {
      id: "dd4580c810204019a7b8eb3e0b329dd6_0",
      type: "downloads",
      attributes: {
        spatialRefId: "4326",
        format: "CSV",
        contentLength: 1391454,
        lastModified: "2020-06-17T13:04:28.000Z",
        contentLastModified: "2020-06-17T13:04:28.000Z",
        cacheTime: 13121,
        status: "ready_unknown",
        featureSet: "full",
        source: {
          type: "Feature Service",
          url:
            "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0?f=json",
          supportsExtract: true,
          spatialRefId: "4326"
        }
      },
      links: {
        content:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv"
      }
    }
  ]
};

describe("hubPollDownloadMetadata", () => {
  afterEach(() => fetchMock.restore());

  it("handle remote server 502 error", async done => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv",
        {
          status: 502
        }
      );
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = hubPollDownloadMetadata({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        downloadId: "test-id",
        spatialRefId: "4326",
        format: "CSV",
        eventEmitter: mockEventEmitter,
        pollingInterval: 10
      });
      await delay(100);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
        "test-idPollingError",
        {
          detail: {
            error: new Error("Bad Gateway"),
            metadata: { status: "error" }
          }
        }
      ]);
      expect(poller.pollTimer).toEqual(null);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle failed export", async done => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv",
        {
          status: 200,
          body: exportFailed
        }
      );
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = hubPollDownloadMetadata({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        downloadId: "test-id",
        spatialRefId: "4326",
        format: "CSV",
        eventEmitter: mockEventEmitter,
        pollingInterval: 10
      });
      await delay(50);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      const [
        topic,
        customEvent
      ] = (mockEventEmitter.emit as any).calls.first().args;
      expect(topic).toEqual("test-idExportError");
      expect(customEvent.detail.metadata).toEqual({
        downloadId:
          "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined",
        contentLastModified: undefined,
        lastEditDate: "2020-06-18T01:17:31.492Z",
        lastModified: undefined,
        errors: [{ message: "Some error" }],
        status: "error_creating",
        downloadUrl:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv",
        contentLength: undefined,
        cacheTime: undefined
      });
      expect(poller.pollTimer).toEqual(null);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle ready export", async done => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv",
        {
          status: 200,
          body: exportReady
        }
      );
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = hubPollDownloadMetadata({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        downloadId: "test-id",
        spatialRefId: "4326",
        format: "CSV",
        eventEmitter: mockEventEmitter,
        pollingInterval: 10
      });
      await delay(50);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      const [
        topic,
        customEvent
      ] = (mockEventEmitter.emit as any).calls.first().args;
      expect(topic).toEqual("test-idExportComplete");
      expect(customEvent.detail.metadata).toEqual({
        downloadId:
          "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined",
        contentLastModified: "2020-06-17T01:16:01.933Z",
        lastEditDate: "2020-06-18T01:15:31.492Z",
        lastModified: "2020-06-17T13:04:28.000Z",
        status: "ready",
        errors: [],
        downloadUrl:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv",
        contentLength: 1391454,
        cacheTime: 13121
      });
      expect(poller.pollTimer).toEqual(null);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle ready_unknown export (export complete)", async done => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv",
        {
          status: 200,
          body: exportReadyUnknown
        }
      );
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = hubPollDownloadMetadata({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        downloadId: "test-id",
        spatialRefId: "4326",
        format: "CSV",
        eventEmitter: mockEventEmitter,
        pollingInterval: 10,
        existingFileDate: "2020-06-15T13:04:28.000Z"
      });
      await delay(50);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      const [
        topic,
        customEvent
      ] = (mockEventEmitter.emit as any).calls.first().args;
      expect(topic).toEqual("test-idExportComplete");
      expect(customEvent.detail.metadata).toEqual({
        downloadId:
          "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined",
        contentLastModified: "2020-06-17T13:04:28.000Z",
        lastEditDate: undefined,
        lastModified: "2020-06-17T13:04:28.000Z",
        status: "ready_unknown",
        errors: [],
        downloadUrl:
          "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv",
        contentLength: 1391454,
        cacheTime: 13121
      });
      expect(poller.pollTimer).toEqual(null);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle ready_unknown export (export queued)", async done => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv",
        {
          status: 200,
          body: exportReadyUnknown
        }
      );
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = hubPollDownloadMetadata({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        downloadId: "test-id",
        spatialRefId: "4326",
        format: "CSV",
        eventEmitter: mockEventEmitter,
        pollingInterval: 10,
        existingFileDate: "2020-06-17T13:04:28.000Z"
      });
      await delay(50);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(0);
      expect(poller.pollTimer !== null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  }, 16000);

  it("handle multiple polls", async done => {
    try {
      fetchMock.mock(
        "http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv",
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
                  status: "updating",
                  featureSet: "full",
                  source: {
                    type: "Feature Service",
                    url:
                      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0?f=json",
                    supportsExtract: true,
                    lastEditDate: "2020-06-18T01:19:31.492Z",
                    spatialRefId: "4326"
                  }
                },
                links: {
                  content:
                    "https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv"
                }
              }
            ]
          }
        }
      );
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = hubPollDownloadMetadata({
        host: "http://hub.com",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        downloadId: "test-id",
        spatialRefId: "4326",
        format: "CSV",
        eventEmitter: mockEventEmitter,
        pollingInterval: 10
      });
      await delay(50);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(0);
      expect(poller.pollTimer !== null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  }, 16000);
});
