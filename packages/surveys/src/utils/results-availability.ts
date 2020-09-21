/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { getProp, cloneObject, IGetSurveyModelsResponse } from "@esri/hub-common";
import { queryFeatures, IQueryResponse } from '@esri/arcgis-rest-feature-layer';

type IResultsAvailability =
  | "after"
  | "always";

export interface IFormItemProperties {
  settings: {
    resultsAvailability: IResultsAvailability
  }
};

export interface IFormItem extends IItem {
  id: string;
  type: "Form";
  properties?: IFormItemProperties;
};

export interface IStakeholderItem extends IItem {
  id: string;
  type: "Feature Service";
  typeKeyworkds: [
    "StakeholderView",
    "Survey123",
    "Survey123 Hub"
  ];
  url: string
};

/**
 * check if Hub should link to results view of survey
 * @param {IFormItem} formItem survey form item json
 * @param {IStakeholderItem | null} stakeholderItem survey stakeholder view item json
 * @param {string} username the username to check for survey responses
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<boolean>}
 */
export const shouldDisplayResults = (
  formItem: IFormItem,
  stakeholderItem: IStakeholderItem | null,
  username: string,
  requestOptions: IRequestOptions): Promise<boolean> => {
  let res = Promise.resolve(false);
  if (stakeholderItem) {
    if (getProp(formItem, "properties.settings.resultsAvailability") === "after") {
      res = hasUserResponded(stakeholderItem.url, username, requestOptions);
    } else {
      res = Promise.resolve(true);
    }
  }
  return res;
};

/**
 * check is provided user has any survey submissions
 * @param {IStakeholderItem.url} _url feature service url
 * @param {string} username the username to check for survey responses
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<boolean>}
 */
export const hasUserResponded = (
  _url: IStakeholderItem["url"],
  username: string,
  requestOptions: IRequestOptions): Promise<boolean> => {
  const url = `${_url}/0`;
  const params = {
    where: `Creator = '${username}'`,
    returnCountOnly: true
  };
  return queryFeatures(Object.assign({ url, params }, requestOptions)).then(({ count }: IQueryResponse) => count > 0);
}


/**
 * Populate form item properties is missing
 * @param {IGetSurveyModelsResponse} _models
 * @returns {IGetSurveyModelsResponse}
 */
export const migrateAddResultsAvailabilitySetting = (
  _models: IGetSurveyModelsResponse): IGetSurveyModelsResponse => {
  const models = cloneObject(_models);
  if (!getProp(models.form, "item.properties")) {
    models.form.item.properties = {};
  }
  if (!getProp(models.form, "item.properties.settings")) {
    models.form.item.properties.settings = { resultsAvailability: "always" };
  }
  return models;
};
