import { ResourceObject } from "jsonapi-typescript";
import { IArcGISContext } from "../ArcGISContext";
import { IHubRequestOptions } from "../types";
import { ItemOrServerEnrichment } from "../items/_enrichments";

/**
 * JSONAPI dataset resource returned by the Hub API
 */
export type DatasetResource = ResourceObject<
  "dataset",
  {
    // TODO: actually define the attributes?
    // what is the syntax? adding the following causes errors
    // owner: string;
    [k: string]: any;
  }
>;

export enum JobRecordType {
  DOWNLOAD = "download",
  UPDATE = "update",
}

export enum JobRecordStatus {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

/**
 * Represents a job record from the Hub API
 */
export interface IHubJobRecord {
  /** Unique entry id */
  id: string;
  /** Type of job record */
  type: JobRecordType;
  /** Status of the job record */
  status: JobRecordStatus;
  /** wellknown message id */
  messageId: string;
  /** untranslated plaintext message */
  message: string;
  /** Timestamp of when the job record was created */
  created: number;
  /** Timestamp of when the job record was last modified */
  modified: number;
}

/**
 * Represents a download job record from the Hub API
 */
export interface IHubDownloadJobRecord extends IHubJobRecord {
  type: JobRecordType.DOWNLOAD;
  /** The layer associated with the download */
  layerId?: string;
}

/**
 * Request options for fetching job records
 */
export interface IHubJobRecordRequestOptions {
  /** Context object from consuming application */
  context: IArcGISContext;
  /** Job types to be included in the results */
  types?: JobRecordType[];
  /** Job statuses to be included in the results */
  statuses?: JobRecordStatus[];
  /** ISO Date string indicating the start date for the search */
  from?: string;
  /** ISO Date string indicating the end date of the search */
  to?: string;
  /** Total number of records to return */
  limit?: number;
}

// START of epic types -- https://devtopia.esri.com/dc/hub/issues/10590
export type IHubContentStatus =
  | IHubServiceBackedContentStatus
  | IHubOtherContentStatus;
export interface IHubBaseContentStatus {
  kind: "service" | "other";
}
export interface IHubServiceBackedContentStatus extends IHubBaseContentStatus {
  kind: "service";
  service: {
    availability: "available" | "slow" | "unavailable";
    // TODO: expand in the future if needed
  };
}
export interface IHubOtherContentStatus extends IHubBaseContentStatus {
  kind: "other";
  // TODO: expand in the future if needed
}
// END of epic types -- https://devtopia.esri.com/dc/hub/issues/10590
