/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ISearchOptions } from "@esri/arcgis-rest-portal";

export interface ISearchParams extends ISearchOptions {
  access?: string;
  agg?: { fields?: string; size?: number; mode?: string };
  bbox?: string;
  collection?: any;
  content?: any;
  downloadable?: string;
  groupIds?: string;
  hasApi?: string;
  hubType?: string;
  id?: string;
  isPortal?: string;
  location_name?: string;
  owner?: string;
  page?: {
    hub?: { start?: number; size?: number };
    ago?: { start?: number; size?: number };
  };
  q: string;
  region?: string;
  sector?: string;
  sort?: string;
  source?: string;
  tags?: string;
  type?: string;
  [key: string]: any;
}

export interface IHubResult {
  id?: string;
  type?: string;
  attributes?: {
    id?: string;
    name?: string;
    type?: string;
    hubType?: string;
    description?: string;
    tags?: string[];
    created?: number;
    [key: string]: any;
  };
}

export interface IHubResults {
  data?: IHubResult[];
  meta?: {
    queryParameters?: {
      filter?: any;
      agg?: any;
      [key: string]: any;
    };
    stats?: {
      totalCount?: number;
      count?: number;
      aggs?: any;
      [key: string]: any;
    };
    page?: {
      start?: number;
      size?: number;
      nextStart?: number;
    };
  };
}
