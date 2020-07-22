
import * as fetchMock from 'fetch-mock';
import { hubRequestDownloadMetadata } from "../../src/hub/hub-request-download-metadata";

const apiResponsefixture = {
  data: [
    {
      id: 'dd4580c810204019a7b8eb3e0b329dd6_0',
      type: 'downloads',
      attributes: {
        spatialRefId: '4326',
        format: 'CSV',
        contentLength: 1391454,
        lastModified: '2020-06-17T13:04:28.000Z',
        contentLastModified: '2020-06-17T01:16:01.933Z',
        cacheTime: 13121,
        status: 'stale',
        featureSet: 'full',
        source: {
          type: 'Feature Service',
          url: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0?f=json',
          supportsExtract: true,
          lastEditDate: '2020-06-18T01:17:31.492Z',
          spatialRefId: '4326'
        }
      },
      links: {
        content: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv'
      }
    }
  ]
};

describe("hubRequestDownloadMetadata", () => {

  afterEach(() => fetchMock.restore());

  it('handle remote server 502 error', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv', {
        status: 502
      });

      await hubRequestDownloadMetadata({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV'
      });
    } catch (err) {
      const { message, status, url } = err;
      expect(message).toEqual('Bad Gateway');
      expect(status).toEqual(502);
      expect(url).toEqual('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv');
    } finally {
      done();
    }
  });

  it('handle missing data property', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv', {
        status: 200,
        body: {}
      });

      const result = await hubRequestDownloadMetadata({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV'
      });

      expect(result).toEqual(undefined);
    } catch (err) {
      expect(err.message).toEqual('Unexpected API response; no "data" property.');
    } finally {
      done();
    }
  });

  it('handle data is not array', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv', {
        status: 200,
        body: { data: {} }
      });

      const result = await hubRequestDownloadMetadata({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV'
      });

      expect(result).toEqual(undefined);
    } catch (err) {
      expect(err.message).toEqual('Unexpected API response; "data" is not an array.');
    } finally {
      done();
    }
  });

  it('handle data array with more than one element', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?formats=csv', {
        status: 200,
        body: { data: [{}, {}] }
      });

      await hubRequestDownloadMetadata({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        format: 'CSV'
      });
    } catch (err) {
      expect(err.message).toEqual('Unexpected API response; "data" contains more than one download.');
    } finally {
      done();
    }
  });

  it('handle zero download results', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv', {
        status: 200,
        body: {
          data: []
        }
      });

      const result = await hubRequestDownloadMetadata({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV'
      });

      expect(result).toEqual({
        downloadId: 'abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined',
        status: 'not_ready'
      });
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it('handle downloaded result', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv', {
        status: 200,
        body: apiResponsefixture
      });

      const result = await hubRequestDownloadMetadata({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV'
      });

      expect(result).toEqual({
        downloadId: 'abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined',
        contentLastModified: '2020-06-17T01:16:01.933Z',
        lastEditDate: '2020-06-18T01:17:31.492Z',
        lastModified: '2020-06-17T13:04:28.000Z',
        status: 'stale',
        downloadUrl: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv',
        contentLength: 1391454,
        cacheTime: 13121
      });
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it('handle downloaded result with host including trailing slash', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv', {
        status: 200,
        body: apiResponsefixture
      });

      const result = await hubRequestDownloadMetadata({
        host: 'http://hub.com/',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV'
      });

      expect(result).toEqual({
        downloadId: 'abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined',
        contentLastModified: '2020-06-17T01:16:01.933Z',
        lastEditDate: '2020-06-18T01:17:31.492Z',
        lastModified: '2020-06-17T13:04:28.000Z',
        status: 'stale',
        downloadUrl: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv',
        contentLength: 1391454,
        cacheTime: 13121
      });
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

 it('handle downloaded result with geometry filter', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&formats=csv&geometry=%22%7B%5C%22xmin%5C%22%3A0%2C%5C%22xmax%5C%22%3A10%2C%5C%22ymin%5C%22%3A0%2C%5C%22ymax%5C%22%3A10%2C%5C%22spatialReference%5C%22%3A%7B%5C%22wkid%5C%22%3A4326%7D%7D%22', {
        status: 200,
        body: apiResponsefixture
      });

      const result = await hubRequestDownloadMetadata({
        host: 'http://hub.com/',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV',
        geometry: JSON.stringify({
          xmin: 0,
          xmax: 10,
          ymin: 0,
          ymax: 10,
          spatialReference: {
            wkid: 4326
          }
        })
      });

      expect(result).toEqual({
        downloadId: 'abcdef0123456789abcdef0123456789_0:CSV:4326:{"xmin":0,"xmax":10,"ymin":0,"ymax":10,"spatialReference":{"wkid":4326}}:undefined',
        contentLastModified: '2020-06-17T01:16:01.933Z',
        lastEditDate: '2020-06-18T01:17:31.492Z',
        lastModified: '2020-06-17T13:04:28.000Z',
        status: 'stale',
        downloadUrl: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv',
        contentLength: 1391454,
        cacheTime: 13121
      });
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });
});