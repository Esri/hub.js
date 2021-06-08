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
  getProp
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

export function getOwnerOrgId(
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

enum DatePrecision {
  Year = "year",
  Month = "month",
  Day = "day",
  Time = "time"
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
/**
 * Parses an ISO8601 date string into a date and a precision.
 * This is because a) if somone entered 2018, we want to respect that and not treat it as the same as 2018-01-01
 * and b) you cannot naively call new Date with an ISO 8601 string that does not include time information
 * For example, when I, here in mountain time, do new Date('2018').getFullYear() I get "2017".
 * This is because when you do not provide time or timezone info, UTC is assumed, so new Date('2018') is 2018-01-01T00:00:00 in UTC
 * which is actually 7 hours earlier here in mountain time.
 *
 * @param {string} isoString
 * @return { date: Date, precision: DatePrecision }
 */
export function parseISODateString(isoString: string) {
  isoString = `${isoString}`;
  let date;
  let precision;
  if (/^\d{4}$/.test(isoString)) {
    // yyyy
    date = new Date(+isoString, 0, 1);
    precision = DatePrecision.Year;
  } else if (/^\d{4}-\d{1,2}$/.test(isoString)) {
    // yyyy-mm
    const parts = isoString.split("-");
    date = new Date(+parts[0], +parts[1] - 1, 1);
    precision = DatePrecision.Month;
  } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(isoString)) {
    // yyyy-mm-dd
    const parts = isoString.split("-");
    date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    precision = DatePrecision.Day;
  } else if (!Number.isNaN(Date.parse(isoString))) {
    // any other string parsable to a valid date
    date = new Date(isoString);
    precision = isoString.includes("T")
      ? DatePrecision.Time
      : DatePrecision.Day;
  }
  return date && precision && { date, precision };
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
  const metadataUpdatedDate = parseISODateString(
    getValueFromMetadata(newContent, "metadataUpdatedDate")
  );
  if (metadataUpdatedDate) {
    newContent.metadataUpdatedDate = metadataUpdatedDate.date;
    newContent.metadataUpdatedDatePrecision = metadataUpdatedDate.precision;
    newContent.metadataUpdatedDateSource = getMetadataPath(
      "metadataUpdatedDate"
    );
  } else {
    newContent.metadataUpdatedDate = newContent.updatedDate;
    newContent.metadataUpdatedDatePrecision = DatePrecision.Day;
    newContent.metadataUpdatedDateSource = newContent.updatedDateSource;
  }

  // updatedDate & updatedDateSource:
  // updatedDate is already set to item.modified, we will override that if we have reviseDate in metadata or lastEditDate
  const reviseDate = parseISODateString(
    getValueFromMetadata(newContent, "reviseDate")
  );
  const layerLastEditDate = getProp(
    newContent,
    "layer.editingInfo.lastEditDate"
  );
  const serverLastEditDate = getProp(
    newContent,
    "server.editingInfo.lastEditDate"
  );
  newContent.updatedDatePrecision = DatePrecision.Day;
  if (reviseDate) {
    newContent.updatedDate = reviseDate.date;
    newContent.updatedDatePrecision = reviseDate.precision;
    newContent.updatedDateSource = getMetadataPath("reviseDate");
  } else if (layerLastEditDate) {
    newContent.updatedDate = new Date(layerLastEditDate);
    newContent.updatedDateSource = "layer.editingInfo.lastEditDate";
  } else if (serverLastEditDate) {
    newContent.updatedDate = new Date(serverLastEditDate);
    newContent.updatedDateSource = "server.editingInfo.lastEditDate";
  }

  // publishedDate & publishedDateSource:
  // publishedDate is already set to item.created, we will override that if we have pubDate or createdDate in metadata
  const pubDate = parseISODateString(
    getValueFromMetadata(newContent, "pubDate")
  );
  const createDate = parseISODateString(
    getValueFromMetadata(newContent, "createDate")
  );
  newContent.publishedDatePrecision = DatePrecision.Day;
  if (pubDate) {
    newContent.publishedDate = pubDate.date;
    newContent.publishedDatePrecision = pubDate.precision;
    newContent.publishedDateSource = getMetadataPath("pubDate");
  } else if (createDate) {
    newContent.publishedDate = createDate.date;
    newContent.publishedDatePrecision = createDate.precision;
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
