/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  getItemData,
  getUser,
  IGetUserOptions
} from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import {
  HubType,
  IHubContent,
  IHubRequestOptions,
  IModel,
  includes,
  cloneObject,
  getProp,
  stringToBlob
} from "@esri/hub-common";
import { IGetContentOptions, getContentFromHub } from "./hub";
import {
  getContentFromPortal,
  _fetchContentProperties,
  IContentPropertyRequests
} from "./portal";
import { isSlug, parseDatasetId } from "./slugs";

function shouldFetchData(hubType: HubType) {
  // TODO: we probably want to fetch data by default for other types of data
  return includes(["template", "solution"], hubType);
}

function isHubCreatedContent(content: IHubContent) {
  const hubTypeKeywords = ["Enterprise Sites", "ArcGIS Hub"];
  const contentTypeKeywords = content.typeKeywords || [];
  // currently Hub only creates web maps, so
  // we may want to remove or modify this type check later
  return (
    content.type === "Web Map" &&
    contentTypeKeywords.some(
      typeKeyword => hubTypeKeywords.indexOf(typeKeyword) > -1
    )
  );
}

function shouldFetchOrgId(content: IHubContent) {
  return !content.orgId && isHubCreatedContent(content);
}

function getOwnerOrgId(
  content: IHubContent,
  requestOptions: IHubRequestOptions
): Promise<string> {
  const options: IGetUserOptions = {
    username: content.owner,
    ...requestOptions
  };
  return getUser(options).then(user => user.orgId);
}

function getContentData(
  content: IHubContent,
  requestOptions: IHubRequestOptions
) {
  return getItemData(content.id, requestOptions);
}

interface IMetadataPaths {
  updateFrequency: string;
  metadataUpdateFrequency: string;
  metadataUpdatedDate: string;
  reviseDate: string;
  pubDate: string;
  createDate: string;
}

/**
 * The possible values for updateFrequency
 *
 * @enum {string}
 */
export enum UpdateFrequency {
  Continual = "continual",
  Daily = "daily",
  Weekly = "weekly",
  Fortnightly = "fortnightly",
  Monthly = "monthly",
  Quarterly = "quarterly",
  Biannually = "biannually",
  Annually = "annually",
  AsNeeded = "as-needed",
  Irregular = "irregular",
  NotPlanned = "not-planned",
  Unknown = "unknown",
  Semimonthly = "semimonthly"
}

function getMetadataPath(identifier: keyof IMetadataPaths) {
  // NOTE: i have verified that this will work regardless of the "Metadata Style" set on the org
  const metadataPaths: IMetadataPaths = {
    updateFrequency:
      "metadata.metadata.dataIdInfo.resMaint.maintFreq.MaintFreqCd.@_value",
    reviseDate: "metadata.metadata.dataIdInfo.idCitation.date.reviseDate",
    pubDate: "metadata.metadata.dataIdInfo.idCitation.date.pubDate",
    createDate: "metadata.metadata.dataIdInfo.idCitation.date.createDate",
    metadataUpdateFrequency:
      "metadata.metadata.mdMaint.maintFreq.MaintFreqCd.@_value",
    metadataUpdatedDate: "metadata.metadata.mdDateSt"
  };
  return metadataPaths[identifier];
}

function getValueFromMetadata(
  content: IHubContent,
  identifier: keyof IMetadataPaths
) {
  const path = getMetadataPath(identifier);
  return path && getProp(content, path);
}

function isValidDate(dateString: string): boolean {
  // dates that come from metadata could be any string - there is no validation in the ui
  const date = new Date(dateString);
  return !Number.isNaN(date.getDate());
}

/**
 * Enriches the content with additional date-related information
 * Note that this is exported to facilitate testing but it should be considered private
 *
 * @private
 * @param {IHubContent} content - the IHubContent object
 * @returns {IHubContent}
 */
export function _enrichDates(content: IHubContent): IHubContent {
  const newContent = cloneObject(content);

  const updateFrequencyMap = {
    "001": UpdateFrequency.Continual,
    "002": UpdateFrequency.Daily,
    "003": UpdateFrequency.Weekly,
    "004": UpdateFrequency.Fortnightly,
    "005": UpdateFrequency.Monthly,
    "006": UpdateFrequency.Quarterly,
    "007": UpdateFrequency.Biannually,
    "008": UpdateFrequency.Annually,
    "009": UpdateFrequency.AsNeeded,
    "010": UpdateFrequency.Irregular,
    "011": UpdateFrequency.NotPlanned,
    "012": UpdateFrequency.Unknown,
    "013": UpdateFrequency.Semimonthly
  } as { [index: string]: UpdateFrequency };

  // updateFrequency:
  const updateFrequencyValue = getValueFromMetadata(
    newContent,
    "updateFrequency"
  );
  if (updateFrequencyValue) {
    newContent.updateFrequency = updateFrequencyMap[updateFrequencyValue];
  }

  // metadataUpdateFrequency
  const metadataUpdateFrequencyValue = getValueFromMetadata(
    newContent,
    "metadataUpdateFrequency"
  );
  if (metadataUpdateFrequencyValue) {
    newContent.metadataUpdateFrequency =
      updateFrequencyMap[metadataUpdateFrequencyValue];
  }

  // metadataUpdatedDate & metadataUpdatedDateSource:
  // updatedDate is set to item.modified
  const metadataUpdatedDate = getValueFromMetadata(
    newContent,
    "metadataUpdatedDate"
  );
  if (isValidDate(metadataUpdatedDate)) {
    newContent.metadataUpdatedDate = metadataUpdatedDate;
    newContent.metadataUpdatedDateSource = getMetadataPath(
      "metadataUpdatedDate"
    );
  } else {
    newContent.metadataUpdatedDate = newContent.updatedDate;
    newContent.metadataUpdatedDateSource = newContent.updatedDateSource;
  }

  // updatedDate & updatedDateSource:
  // updatedDate is already set to item.modified, we will override that if we have reviseDate in metadata or lastEditDate
  const reviseDate = getValueFromMetadata(newContent, "reviseDate");
  const lastEditDate = getProp(
    newContent,
    "server.changeTrackingInfo.lastSyncDate"
  );
  if (isValidDate(reviseDate)) {
    newContent.updatedDate = reviseDate;
    newContent.updatedDateSource = getMetadataPath("reviseDate");
  } else if (lastEditDate) {
    newContent.updatedDate = new Date(lastEditDate);
    newContent.updatedDateSource = "server.changeTrackingInfo.lastSyncDate";
  }

  // publishedDate & publishedDateSource:
  // publishedDate is already set to item.created, we will override that if we have pubDate or createdDate in metadata
  const pubDate = getValueFromMetadata(newContent, "pubDate");
  const createDate = getValueFromMetadata(newContent, "createDate");
  if (isValidDate(pubDate)) {
    newContent.publishedDate = pubDate;
    newContent.publishedDateSource = getMetadataPath("pubDate");
  } else if (isValidDate(createDate)) {
    newContent.publishedDate = createDate;
    newContent.publishedDateSource = getMetadataPath("createDate");
  }

  return newContent;
}

/**
 * Adds extra goodies to the content.
 * @param content - the IHubContent object
 * @param options - request options that may include authentication
 */
function enrichContent(
  content: IHubContent,
  options?: IGetContentOptions
): Promise<IHubContent> {
  // see if there are additional properties to fetch based on content type
  const propertiesToFetch: IContentPropertyRequests = {};
  if (!content.data && shouldFetchData(content.hubType)) {
    propertiesToFetch.data = getContentData;
  }
  if (shouldFetchOrgId(content)) {
    propertiesToFetch.orgId = getOwnerOrgId;
  }

  const fetchContentPropertiesPromise: Promise<IHubContent> =
    Object.keys(propertiesToFetch).length === 0
      ? Promise.resolve(content)
      : _fetchContentProperties(propertiesToFetch, content, options);

  return fetchContentPropertiesPromise.then(_enrichDates);
}

/**
 * Fetch content by ID using either the Hub API or the ArcGIS REST API
 * @param identifier - Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 */
function getContentById(
  identifier: string,
  options?: IGetContentOptions
): Promise<IHubContent> {
  let getContentPromise: Promise<IHubContent>;
  // first fetch and format the content from the Hub or portal API
  if (options && options.isPortal) {
    const { itemId } = parseDatasetId(identifier);
    getContentPromise = getContentFromPortal(itemId, options);
  } else {
    getContentPromise = getContentFromHub(identifier, options).catch(e => {
      // dataset is not in index (i.e. might be a private item)
      if (!isSlug(identifier)) {
        // try fetching from portal instead
        return getContentFromPortal(identifier, options);
      }
      return Promise.reject(e);
    });
  }
  return getContentPromise.then(content => enrichContent(content, options));
}

/**
 * Get content either from an IModel or an ID.
 * @param idOrModel - An IModel (with our without data), or Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 */
export function getContent(
  idOrModel: string | IModel,
  options?: IGetContentOptions
): Promise<IHubContent> {
  let getContentPromise: Promise<IHubContent>;

  if (typeof idOrModel === "string") {
    getContentPromise = getContentById(idOrModel, options);
  } else {
    const { item, data } = idOrModel;
    getContentPromise = getContentFromPortal(item, options).then(content =>
      enrichContent({ ...content, data }, options)
    );
  }

  return getContentPromise;
}
