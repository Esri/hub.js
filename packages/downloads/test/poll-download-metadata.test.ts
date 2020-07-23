
import { UserSession } from '@esri/arcgis-rest-auth';
import { pollDownloadMetadata } from "../src/poll-download-metadata";
import * as hubPoller from '../src/hub/hub-poll-download-metadata';
import * as portalPoller from '../src/portal/portal-poll-export-job-status'
import * as EventEmitter from 'eventemitter3';

describe("pollDownloadMetadata", () => {
  it('handle hub polling', async done => {
    try {
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, 'emit');

      spyOn(hubPoller, 'hubPollDownloadMetadata').and.returnValue(
        new Promise((resolve, reject) => {
        resolve();
      }))

      pollDownloadMetadata({
        host: 'http://hub.com/',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV',
        downloadId: 'download-id',
        eventEmitter: mockEventEmitter,
        pollingInterval: 10
      });

      expect(hubPoller.hubPollDownloadMetadata as any).toHaveBeenCalledTimes(1)
      expect((hubPoller.hubPollDownloadMetadata as any).calls.first().args).toEqual([{
        host: 'http://hub.com/',
        downloadId: 'download-id',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        format: 'CSV',
        eventEmitter: mockEventEmitter,
        pollingInterval: 10,
        spatialRefId: '4326',
        geometry: undefined,
        where: undefined
      }])
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });

  it('handle portal download', async done => {
    const authentication = new UserSession({
      username: 'portal-user',
      portal: 'http://portal.com/sharing/rest',
      token: '123',
    });
    authentication.getToken = () => new Promise((resolve) => {
      resolve('123')
    });

    try {
      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, 'emit');

      spyOn(portalPoller, 'portalPollExportJobStatus').and.returnValue(
        new Promise((resolve, reject) => {
        resolve();
      }))

      pollDownloadMetadata({
        target: 'portal',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: '4326',
        format: 'CSV',
        downloadId: 'download-id',
        jobId: 'job-id',
        exportCreated: 1000,
        eventEmitter: mockEventEmitter,
        pollingInterval: 10,
        authentication
      });

      expect(portalPoller.portalPollExportJobStatus as any).toHaveBeenCalledTimes(1)
      expect((portalPoller.portalPollExportJobStatus as any).calls.first().args).toEqual([{
        downloadId: 'download-id',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        jobId: 'job-id',
        format: 'CSV',
        spatialRefId: '4326',
        eventEmitter: mockEventEmitter,
        pollingInterval: 10,
        authentication,
        exportCreated: 1000,
        geometry: undefined,
        where: undefined
      }])
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });
});