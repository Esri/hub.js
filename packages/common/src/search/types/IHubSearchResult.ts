import { IHubGeography } from "../..";

export interface IHubSearchResult {
  // item/group/user id
  id: string;
  // hubType is used to determine enrichments and the card-component used to render the result
  hubType: string;
  // Hub Family: "Content" vs "Document" etc
  family: string;
  // backing type - Group vs User vs Feature Layer vs Web Map vs Event
  type: string;
  // derived from title/name/username
  name: string;
  owner: string;

  summary: string; // sanitized regardless where it's from
  // enriched dates
  createdDate: Date;
  createdDateSource: string;
  updatedDate: Date;
  updatedDateSource: string;
  thumbnailUrl: string;
  // unless overridden using computeUrlCallback, will be the canonical url for the result
  // TODO: ergonomics of passing site in are limiting; could this use window.location.origin instead?
  url?: string;
  // Wide type allowing everything from a simple extent to complex geometry
  // Do we have a consistent property name for this?
  // used to draw the result on a map
  geometry?: IHubGeography;
  // Additional type specific metadata
  // Label and format are not required, but are available for customization
  metadata?: {
    key: string;
    value: number | string | Date;
    label?: string;
    format?: Record<string, any>;
  }[];

  // TODO
  source?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
