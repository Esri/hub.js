import { JobRecordStatus } from "../../src/content/enums/jobRecordStatus";
import { JobRecordType } from "../../src/content/enums/jobRecordType";
import { fetchItemJobRecords } from "../../src/content/fetchItemJobRecords";
import {
  IHubDownloadJobRecord,
  IHubJobRecord,
  IHubJobRecordRequestOptions,
} from "../../src/content/types";
import type { IArcGISContext } from "../../src/types/IArcGISContext";
import * as fetchMock from "fetch-mock";
import { describe, it, expect, afterEach } from "vitest";

describe("fetchItemJobRecords", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it("throws an error when an unimplemented option is specified", async () => {
    const id = "123";
    const options: IHubJobRecordRequestOptions = {
      context: {
        hubUrl: "https://hub.arcgis.com",
      } as unknown as IArcGISContext,
      statuses: [JobRecordStatus.ERROR],
    };

    try {
      await fetchItemJobRecords(id, options);
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        "The following options are not yet implemented: types, statuses"
      );
      expect(fetchMock.calls().length).toBe(0);
    }
  });
  it("fetches job records", async () => {
    const id = "123";
    const options: IHubJobRecordRequestOptions = {
      context: {
        hubUrl: "https://hub.arcgis.com",
      } as unknown as IArcGISContext,
    };
    const expectedRecords: IHubJobRecord[] = [
      {
        type: JobRecordType.DOWNLOAD,
        message: "Download failed",
        created: 1577836800000,
        layerId: "456",
        // implement the rest of the fields once the API supports them
        id: null,
        status: null,
        messageId: null,
        modified: null,
      } as unknown as IHubDownloadJobRecord,
    ];
    fetchMock.once("https://hub.arcgis.com/api/download/v1/items/123/errors", {
      errors: [
        {
          timestamp: "2020-01-01T00:00:00Z",
          layerId: "456",
          message: "Download failed",
        },
      ],
    });
    const records = await fetchItemJobRecords(id, options);
    expect(records).toEqual(expectedRecords);
    expect(fetchMock.calls().length).toBe(1);
  });
  it("refines a records search with query params", async () => {
    const id = "123";
    const options: IHubJobRecordRequestOptions = {
      context: {
        hubUrl: "https://hub.arcgis.com",
      } as unknown as IArcGISContext,
      from: "2020-01-01T00:00:00Z",
      to: "2020-01-02T00:00:00Z",
      limit: 1,
    };
    const expectedRecords: IHubJobRecord[] = [
      {
        type: JobRecordType.DOWNLOAD,
        message: "Download failed",
        created: 1577836800000,
        layerId: "456",
        // implement the rest of the fields once the API supports them
        id: null,
        status: null,
        messageId: null,
        modified: null,
      } as unknown as IHubDownloadJobRecord,
    ];
    fetchMock.once(
      "https://hub.arcgis.com/api/download/v1/items/123/errors?fromDate=2020-01-01T00%3A00%3A00Z&toDate=2020-01-02T00%3A00%3A00Z&limit=1",
      {
        errors: [
          {
            timestamp: "2020-01-01T00:00:00Z",
            layerId: "456",
            message: "Download failed",
          },
        ],
      }
    );
    const records = await fetchItemJobRecords(id, options);
    expect(records).toEqual(expectedRecords);
    expect(fetchMock.calls().length).toBe(1);
  });
});
