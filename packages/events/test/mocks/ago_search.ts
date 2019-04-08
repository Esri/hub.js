import { ISearchResult } from "@esri/arcgis-rest-items";
import { IItem } from "@esri/arcgis-rest-common-types";

const adminItem: IItem = {
  id: "xyz123",
  owner: "admin_user",
  created: 1498571469000,
  modified: 1533053014000,
  guid: null,
  name: "Hub Events",
  title: "Hub Events",
  type: "Feature Service",
  typeKeywords: [
    "ArcGIS Server",
    "Data",
    "Feature Access",
    "Feature Service",
    "hubEventsLayer",
    "Service",
    "Singlelayer",
    "Hosted Service"
  ],
  description:
    "Feature service generated by Hub for Hub events. DO NOT DELETE THIS SERVICE. It stores the Hub events for your organization.",
  tags: [],
  snippet: "Feature service for Hub events",
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [
    [-8589300.590117617, 40.36926825227528],
    [-73.96624645399964, 4722244.554455302]
  ],
  categories: [],
  spatialReference: null,
  accessInformation: "null",
  licenseInfo: "null",
  culture: "en-us",
  properties: {
    schemaVersion: "2.0"
  },
  url:
    "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events/FeatureServer",
  proxyFilter: null,
  access: "shared",
  size: -1,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 86,
  scoreCompleteness: 68,
  groupDesignations: null,
  // TODO: make this optional in IItem?
  protected: true
};

const orgItem: IItem = {
  id: "abc123",
  owner: "admin_user",
  created: 1498571478000,
  modified: 1533053018000,
  guid: null,
  name: "Hub Events (org)",
  title: "Hub Events (org)",
  type: "Feature Service",
  typeKeywords: [
    "ArcGIS Server",
    "Data",
    "Feature Access",
    "Feature Service",
    "hubEventsLayer",
    "Service",
    "Singlelayer",
    "Hosted Service",
    "View Service"
  ],
  description:
    "Feature service generated by Hub for organization Hub events. DO NOT DELETE THIS SERVICE. It stores the organization Hub events for your organization.",
  tags: [],
  snippet: "Feature service for organization Hub events",
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [
    [-8589300.590117617, 40.36926825227528],
    [-73.96624645399964, 4722244.554455302]
  ],
  categories: [],
  spatialReference: null,
  accessInformation: "null",
  licenseInfo: "null",
  culture: null,
  properties: {
    schemaVersion: "2.0"
  },
  url:
    "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events (org)/FeatureServer",
  proxyFilter: null,
  access: "org",
  size: -1,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 10,
  scoreCompleteness: 70,
  groupDesignations: null,
  protected: true
};

const publicItem: IItem = {
  id: "abc124",
  owner: "admin_user",
  created: 1498571489000,
  modified: 1533053016000,
  guid: null,
  name: "Hub Events (public)",
  title: "Hub Events (public)",
  type: "Feature Service",
  typeKeywords: [
    "ArcGIS Server",
    "Data",
    "Feature Access",
    "Feature Service",
    "hubEventsLayer",
    "Service",
    "Singlelayer",
    "Hosted Service",
    "View Service"
  ],
  description:
    "Feature service generated by Hub for public Hub events. DO NOT DELETE THIS SERVICE. It stores the public Hub events for your organization.",
  tags: [],
  snippet: "Feature service for public Hub events",
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [
    [-8589300.590117617, 40.36926825227528],
    [-73.96624645399964, 4722244.554455302]
  ],
  categories: [],
  spatialReference: null,
  accessInformation: "null",
  licenseInfo: "null",
  culture: null,
  properties: {
    schemaVersion: "2.0"
  },
  url:
    "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events (public)/FeatureServer",
  proxyFilter: null,
  access: "public",
  size: -1,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 21,
  scoreCompleteness: 70,
  groupDesignations: null,
  protected: true
};

const publicItemWithNoUrl: IItem = {
  id: "abc124",
  owner: "admin_user",
  created: 1498571489000,
  modified: 1533053016000,
  guid: null,
  name: "Hub Events (public)",
  title: "Hub Events (public)",
  type: "Feature Service",
  typeKeywords: [
    "ArcGIS Server",
    "Data",
    "Feature Access",
    "Feature Service",
    "hubEventsLayer",
    "Service",
    "Singlelayer",
    "Hosted Service",
    "View Service"
  ],
  description:
    "Feature service generated by Hub for public Hub events. DO NOT DELETE THIS SERVICE. It stores the public Hub events for your organization.",
  tags: [],
  snippet: "Feature service for public Hub events",
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [
    [-8589300.590117617, 40.36926825227528],
    [-73.96624645399964, 4722244.554455302]
  ],
  categories: [],
  spatialReference: null,
  accessInformation: "null",
  licenseInfo: "null",
  culture: null,
  properties: {
    schemaVersion: "2.0"
  },
  url: null,
  proxyFilter: null,
  access: "public",
  size: -1,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 21,
  scoreCompleteness: 70,
  groupDesignations: null,
  protected: true
};

/* For an admin user, there are usually three event items returned. 
  One item consists of the hosted feature service, while the other
  two are event view services at org and public access privileges */
export const adminEventSearchResponse: ISearchResult = {
  query: "typekeywords:hubEventsLayer AND orgid:5bc",
  total: 3,
  start: 1,
  num: 10,
  nextStart: -1,
  results: [adminItem, orgItem, publicItem]
};

/* For an org user, there are usually two event items returned. 
 These items are view services at org and public access privileges
 of the hosted event feature service */
export const orgEventSearchResponse: ISearchResult = {
  query: "typekeywords:hubEventsLayer AND orgid:5bc",
  total: 2,
  start: 1,
  num: 10,
  nextStart: -1,
  results: [orgItem, publicItem]
};

/* For a public user, there is usually one event item returned. 
 This item is a view service with public access privileges
 of the hosted event feature service */
export const publicEventSearchResponse: ISearchResult = {
  query: "typekeywords:hubEventsLayer AND orgid:5bc",
  total: 1,
  start: 1,
  num: 10,
  nextStart: -1,
  results: [publicItem]
};

/* When events have not been enabled, there are no items returned */
export const emptyEventSearchResponse: ISearchResult = {
  query: "typekeywords:hubEventsLayer AND orgid:h7c",
  total: 1,
  start: 1,
  num: 10,
  nextStart: -1,
  results: []
};

/* When events have been enabled but corrupted, there are  corrupt items returned */
export const noUrlEventSearchResponse: ISearchResult = {
  query: "typekeywords:hubEventsLayer AND orgid:h7c",
  total: 1,
  start: 1,
  num: 10,
  nextStart: -1,
  results: [publicItemWithNoUrl]
};
