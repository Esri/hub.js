/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";

/*
 * possible values of formItem.properties.settings.resultsAvailability,
 * which is used in Hub to determine when it should render links to survey results
 */
type IResultsAvailability = "after" | "always";

export interface IFormItemProperties {
  previewUrl?: string;
  parentId?: string;
  settings?: {
    resultsAvailability: IResultsAvailability;
  };
  [propName: string]: any;
}

export interface IFormItem extends IItem {
  id: string;
  type: "Form";
  properties?: IFormItemProperties;
}

type StakeholderItemTypeKeywords =
  | "StakeholderView"
  | "Survey123"
  | "Survey123 Hub"
  | string;

export interface IStakeholderItem extends IItem {
  id: string;
  type: "Feature Service";
  typeKeywords: StakeholderItemTypeKeywords[];
  url: string;
}
