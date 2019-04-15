import { IRequestOptions } from "@esri/arcgis-rest-request";

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
* Apache-2.0 */

export interface ISearchParams extends IRequestOptions {
  access?: string;
  agg?: { fields: string[] };
  bbox?: string;
  catalog?: { groupIds: string[]; pageIds: string[] };
  catalogToggle?: boolean;
  collection?: any;
  content?: any;
  downloadable?: boolean;
  groupIds?: string;
  hasApi?: boolean;
  hubType?: string;
  location_name?: string;
  owner?: string;
  page?: number;
  q?: string;
  region?: string;
  sector?: string;
  sort?: string;
  source?: string;
  tags?: string;
  type?: string;
  [key: string]: any;
}
