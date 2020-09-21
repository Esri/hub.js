/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";

type IResultsAvailability = "after" | "always";

export interface IFormItemProperties {
  [propName: string]: any;
  previewUrl?: string;
  parentId?: string;
  settings?: {
    resultsAvailability: IResultsAvailability;
  };
}

export interface IFormItem extends IItem {
  id: string;
  type: "Form";
  properties?: IFormItemProperties;
}

type IStakeholderItemTypeKeywords =
  | "StakeholderView"
  | "Survey123"
  | "Survey123 Hub"
  | string;

export interface IStakeholderItem extends IItem {
  id: string;
  type: "Feature Service";
  typeKeywords: IStakeholderItemTypeKeywords[];
  url: string;
}
