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
  page?: number;
  q: string;
  region?: string;
  sector?: string;
  sort?: string;
  source?: string;
  tags?: string;
  type?: string;
  [key: string]: any;
}
