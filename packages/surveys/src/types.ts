/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-types";

/*
 * possible values of formItem.properties.settings.resultsAvailability,
 * which is used in Hub to determine when it should render links to survey results
 */
type ResultsAvailability = "after" | "always";

export interface IFormItemProperties {
  previewUrl?: string;
  parentId?: string;
  settings?: {
    resultsAvailability: ResultsAvailability;
  };
  [propName: string]: any;
}

export interface IFormItem extends IItem {
  type: "Form";
  properties?: IFormItemProperties;
}

export interface IStakeholderItem extends IItem {
  type: "Feature Service";
  typeKeywords: string[];
  url: string;
}
