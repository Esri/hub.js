/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IEventResourceObject } from "../../src/search";
import { IGeometry, IItem, IField } from "@esri/arcgis-rest-common-types";
import { IQueryFeaturesResponse } from "@esri/arcgis-rest-feature-service";
import { ISearchResult } from "@esri/arcgis-rest-items";

export const eventQueryResponseEmpty = {
  objectIdFieldName: "OBJECTID",
  uniqueIdField: {
    name: "OBJECTID",
    isSystemMaintained: true
  },
  globalIdFieldName: "",
  geometryType: "esriGeometryPoint",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  fields: [
    {
      name: "OBJECTID",
      type: "esriFieldTypeOID",
      alias: "OBJECTID",
      domain: null,
      defaultValue: null
    },
    {
      name: "title",
      type: "esriFieldTypeString",
      alias: "title",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "location",
      type: "esriFieldTypeString",
      alias: "location",
      length: 2000,
      domain: null,
      defaultValue: null
    },
    {
      name: "description",
      type: "esriFieldTypeString",
      alias: "description",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "startDate",
      type: "esriFieldTypeDate",
      alias: "startDate",
      length: 0,
      domain: null,
      defaultValue: null
    },
    {
      name: "endDate",
      type: "esriFieldTypeDate",
      alias: "endDate",
      length: 0,
      domain: null,
      defaultValue: null
    },
    {
      name: "organizerId",
      type: "esriFieldTypeString",
      alias: "organizerId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "organizerName",
      type: "esriFieldTypeString",
      alias: "organizerName",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "organizerEmail",
      type: "esriFieldTypeString",
      alias: "organizerEmail",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "url",
      type: "esriFieldTypeString",
      alias: "url",
      length: 2000,
      domain: null,
      defaultValue: null
    },
    {
      name: "pageId",
      type: "esriFieldTypeString",
      alias: "pageId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "capacity",
      type: "esriFieldTypeInteger",
      alias: "capacity",
      domain: null,
      defaultValue: null
    },
    {
      name: "attendance",
      type: "esriFieldTypeInteger",
      alias: "attendance",
      domain: null,
      defaultValue: null
    },
    {
      name: "status",
      type: "esriFieldTypeString",
      alias: "status",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "isCancelled",
      type: "esriFieldTypeInteger",
      alias: "isCancelled",
      domain: null,
      defaultValue: null
    },
    {
      name: "groupId",
      type: "esriFieldTypeString",
      alias: "groupId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "siteId",
      type: "esriFieldTypeString",
      alias: "siteId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "initiativeId",
      type: "esriFieldTypeString",
      alias: "initiativeId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "surveyId",
      type: "esriFieldTypeString",
      alias: "surveyId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "CreationDate",
      type: "esriFieldTypeDate",
      alias: "CreationDate",
      length: 8,
      domain: null,
      defaultValue: null
    },
    {
      name: "Creator",
      type: "esriFieldTypeString",
      alias: "Creator",
      length: 50,
      domain: null,
      defaultValue: null
    },
    {
      name: "EditDate",
      type: "esriFieldTypeDate",
      alias: "EditDate",
      length: 8,
      domain: null,
      defaultValue: null
    },
    {
      name: "Editor",
      type: "esriFieldTypeString",
      alias: "Editor",
      length: 50,
      domain: null,
      defaultValue: null
    },
    {
      name: "schemaVersion",
      type: "esriFieldTypeDouble",
      alias: "schemaVersion",
      domain: null,
      defaultValue: null
    },
    {
      name: "organizers",
      type: "esriFieldTypeString",
      alias: "organizers",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "sponsors",
      type: "esriFieldTypeString",
      alias: "sponsors",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "onlineLocation",
      type: "esriFieldTypeString",
      alias: "onlineLocation",
      length: 2000,
      domain: null,
      defaultValue: null
    },
    {
      name: "venue",
      type: "esriFieldTypeString",
      alias: "venue",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "address1",
      type: "esriFieldTypeString",
      alias: "address1",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "address2",
      type: "esriFieldTypeString",
      alias: "address2",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "isAllDay",
      type: "esriFieldTypeInteger",
      alias: "isAllDay",
      domain: null,
      defaultValue: null
    },
    {
      name: "timeZone",
      type: "esriFieldTypeString",
      alias: "timeZone",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "appIds",
      type: "esriFieldTypeString",
      alias: "appIds",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "imageAttributes",
      type: "esriFieldTypeString",
      alias: "imageAttributes",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "videoUrl",
      type: "esriFieldTypeString",
      alias: "videoUrl",
      length: 2000,
      domain: null,
      defaultValue: null
    }
  ] as IField[],
  features: [] as any
};

export const eventQueryResponse: IQueryFeaturesResponse = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPoint",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  fields: [
    {
      name: "OBJECTID",
      type: "esriFieldTypeOID",
      alias: "OBJECTID",
      domain: null,
      defaultValue: null
    },
    {
      name: "title",
      type: "esriFieldTypeString",
      alias: "title",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "location",
      type: "esriFieldTypeString",
      alias: "location",
      length: 2000,
      domain: null,
      defaultValue: null
    },
    {
      name: "description",
      type: "esriFieldTypeString",
      alias: "description",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "startDate",
      type: "esriFieldTypeDate",
      alias: "startDate",
      length: 0,
      domain: null,
      defaultValue: null
    },
    {
      name: "endDate",
      type: "esriFieldTypeDate",
      alias: "endDate",
      length: 0,
      domain: null,
      defaultValue: null
    },
    {
      name: "organizerId",
      type: "esriFieldTypeString",
      alias: "organizerId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "organizerName",
      type: "esriFieldTypeString",
      alias: "organizerName",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "organizerEmail",
      type: "esriFieldTypeString",
      alias: "organizerEmail",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "url",
      type: "esriFieldTypeString",
      alias: "url",
      length: 2000,
      domain: null,
      defaultValue: null
    },
    {
      name: "pageId",
      type: "esriFieldTypeString",
      alias: "pageId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "capacity",
      type: "esriFieldTypeInteger",
      alias: "capacity",
      domain: null,
      defaultValue: null
    },
    {
      name: "attendance",
      type: "esriFieldTypeInteger",
      alias: "attendance",
      domain: null,
      defaultValue: null
    },
    {
      name: "status",
      type: "esriFieldTypeString",
      alias: "status",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "isCancelled",
      type: "esriFieldTypeInteger",
      alias: "isCancelled",
      domain: null,
      defaultValue: null
    },
    {
      name: "groupId",
      type: "esriFieldTypeString",
      alias: "groupId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "siteId",
      type: "esriFieldTypeString",
      alias: "siteId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "initiativeId",
      type: "esriFieldTypeString",
      alias: "initiativeId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "surveyId",
      type: "esriFieldTypeString",
      alias: "surveyId",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "CreationDate",
      type: "esriFieldTypeDate",
      alias: "CreationDate",
      length: 8,
      domain: null,
      defaultValue: null
    },
    {
      name: "Creator",
      type: "esriFieldTypeString",
      alias: "Creator",
      length: 50,
      domain: null,
      defaultValue: null
    },
    {
      name: "EditDate",
      type: "esriFieldTypeDate",
      alias: "EditDate",
      length: 8,
      domain: null,
      defaultValue: null
    },
    {
      name: "Editor",
      type: "esriFieldTypeString",
      alias: "Editor",
      length: 50,
      domain: null,
      defaultValue: null
    },
    {
      name: "schemaVersion",
      type: "esriFieldTypeDouble",
      alias: "schemaVersion",
      domain: null,
      defaultValue: null
    },
    {
      name: "organizers",
      type: "esriFieldTypeString",
      alias: "organizers",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "sponsors",
      type: "esriFieldTypeString",
      alias: "sponsors",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "onlineLocation",
      type: "esriFieldTypeString",
      alias: "onlineLocation",
      length: 2000,
      domain: null,
      defaultValue: null
    },
    {
      name: "venue",
      type: "esriFieldTypeString",
      alias: "venue",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "address1",
      type: "esriFieldTypeString",
      alias: "address1",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "address2",
      type: "esriFieldTypeString",
      alias: "address2",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "isAllDay",
      type: "esriFieldTypeInteger",
      alias: "isAllDay",
      domain: null,
      defaultValue: null
    },
    {
      name: "timeZone",
      type: "esriFieldTypeString",
      alias: "timeZone",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "appIds",
      type: "esriFieldTypeString",
      alias: "appIds",
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: "imageAttributes",
      type: "esriFieldTypeString",
      alias: "imageAttributes",
      length: 4000,
      domain: null,
      defaultValue: null
    },
    {
      name: "videoUrl",
      type: "esriFieldTypeString",
      alias: "videoUrl",
      length: 2000,
      domain: null,
      defaultValue: null
    }
  ],
  features: [
    {
      attributes: {
        OBJECTID: 5,
        title: "Event 1",
        location: "",
        description: "this is my description",
        startDate: 1543696200000,
        endDate: 1543707000000,
        organizerId: null,
        organizerName: null,
        organizerEmail: null,
        url: "event-1",
        pageId: null,
        capacity: null,
        attendance: null,
        status: "public",
        isCancelled: null,
        groupId: "f0cd3",
        siteId: "71a58",
        initiativeId: "515f9",
        surveyId: null,
        CreationDate: 1538678006635,
        Creator: "admin",
        EditDate: 1539694751580,
        Editor: "admin",
        schemaVersion: 2,
        organizers: '[{"name":"The Organizer","contact":"organizers@org.com"}]',
        sponsors: "[]",
        onlineLocation: "",
        venue: "Gotham City Clothing",
        address1: "391 Millburn Ave, Millburn, New Jersey, 07041",
        address2: "",
        isAllDay: 0,
        timeZone: null,
        appIds: null,
        imageAttributes: null,
        videoUrl: null
      },
      geometry: {
        x: -74.310680054965559,
        y: 40.723010058860787
      } as IGeometry
    },
    {
      attributes: {
        OBJECTID: 6,
        title: "Event 2",
        location: "",
        description: "test",
        startDate: 1647370800000,
        endDate: 1647381600000,
        organizerId: null,
        organizerName: null,
        organizerEmail: null,
        url: "event-2",
        pageId: null,
        capacity: null,
        attendance: null,
        status: "public",
        isCancelled: null,
        groupId: "bffde",
        siteId: "7c395",
        initiativeId: "bd9a1",
        surveyId: null,
        CreationDate: 1542048436283,
        Creator: "admin",
        EditDate: 1542119050017,
        Editor: "admin",
        schemaVersion: 2,
        organizers: '[{"name":"admin","contact":"admin@ad.com"}]',
        sponsors: "[]",
        onlineLocation: "",
        venue: "White House",
        address1:
          "1600 Pennsylvania Ave NW, Washington, District of Columbia, 20500",
        address2: "",
        isAllDay: 0,
        timeZone: null,
        appIds: null,
        imageAttributes:
          '{"raw":251,"crop":252,"props":{"transformAxis":"x","position":{"x":0,"y":0},"scale":{"current":0,"original":0},"container":{"width":858,"height":429,"left":54,"top":27},"natural":{"width":700,"height":700},"output":{"width":750,"height":375},"version":2,"rendered":{"width":858,"height":858}}}',
        videoUrl: null
      },
      geometry: {
        x: -77.036430054965564,
        y: 38.897929948352669
      } as IGeometry
    },
    {
      attributes: {
        OBJECTID: 7,
        title: "Event 3",
        location: "",
        description: "This is my description",
        startDate: 1546378200000,
        endDate: 1546389000000,
        organizerId: null,
        organizerName: null,
        organizerEmail: null,
        url: "event-3",
        pageId: null,
        capacity: null,
        attendance: null,
        status: "public",
        isCancelled: null,
        groupId: "df55",
        siteId: "71a58",
        initiativeId: "515f9",
        surveyId: null,
        CreationDate: 1539025611029,
        Creator: "dcadminqa",
        EditDate: 1539281121923,
        Editor: "admin",
        schemaVersion: 2,
        organizers: '[{"name":"John Smith","contact":"john_smith@e.com"}]',
        sponsors: "[]",
        onlineLocation: "",
        venue: "Rosslyn Metro Center 1",
        address1: "1700 N Moore St, Arlington, Virginia, 22209",
        address2: "",
        isAllDay: 0,
        timeZone: null,
        appIds: null,
        imageAttributes:
          '{"raw":251,"props":{"transformAxis":"x","position":{"x":0,"y":0},"scale":{"current":0,"original":0},"container":{"width":858,"height":429,"left":54,"top":27},"natural":{"width":700,"height":700},"output":{"width":750,"height":375},"version":2,"rendered":{"width":858,"height":858}}}',
        videoUrl: ""
      },
      geometry: {
        x: -77.071490000576887,
        y: 38.895170069969296
      } as IGeometry
    }
  ]
};

export const siteResponse71a58 = {
  id: "71a58",
  owner: "john_smith",
  orgId: "97KL",
  created: 1538677682000,
  modified: 1538677694000,
  guid: null,
  name: null,
  title: "Hub Site 1",
  type: "Hub Site Application",
  typeKeywords: [
    "Hub",
    "hubSite",
    "hubSolution",
    "JavaScript",
    "Map",
    "Mapping Site",
    "Online Map",
    "OpenData",
    "Web Map",
    "Registered App"
  ],
  description:
    "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the ArcGIS Hub application. To make changes to this site, please visit https://hub.arcgis.com/admin/",
  tags: ["Hub Site"],
  snippet: "Open Data Site",
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [],
  categories: [],
  spatialReference: null,
  accessInformation: "null",
  licenseInfo: "null",
  culture: "en-us",
  url: "http://a-new-hub-site.hub.arcgis.com",
  proxyFilter: null,
  access: "public",
  size: 83893,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  commentsEnabled: true,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 8916,
  scoreCompleteness: 73,
  groupDesignations: null
} as IItem;

export const siteResponse7c395 = {
  id: "7c395",
  owner: "john_smith",
  orgId: "97KL",
  created: 1538677682000,
  modified: 1538677694000,
  guid: null,
  name: null,
  title: "Hub Site 2",
  type: "Hub Site Application",
  typeKeywords: [
    "Hub",
    "hubSite",
    "hubSolution",
    "JavaScript",
    "Map",
    "Mapping Site",
    "Online Map",
    "OpenData",
    "Web Map",
    "Registered App"
  ],
  description:
    "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the ArcGIS Hub application. To make changes to this site, please visit https://hub.arcgis.com/admin/",
  tags: ["Hub Site"],
  snippet: "Open Data Site",
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [],
  categories: [],
  spatialReference: null,
  accessInformation: "null",
  licenseInfo: "null",
  culture: "en-us",
  url: "http://another-hub-site.hub.arcgis.com",
  proxyFilter: null,
  access: "public",
  size: 83893,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  commentsEnabled: true,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 8916,
  scoreCompleteness: 73,
  groupDesignations: null
} as IItem;

export const siteSearchResponse = {
  query: "",
  total: 10795,
  start: 1,
  num: 1,
  nextStart: 2,
  results: [siteResponse71a58, siteResponse7c395]
} as ISearchResult;

const cacheBust = new Date().getTime();
const data = [
  {
    id: 5,
    type: "events",
    attributes: {
      imageUrl: null,
      ...eventQueryResponse.features[0].attributes
    },
    geometry: eventQueryResponse.features[0].geometry
  },
  {
    id: 6,
    type: "events",
    attributes: {
      imageUrl:
        `https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events (public)/FeatureServer/0/6/attachments/252?v=` +
        { cacheBust } +
        `&token=FAKE-TOKEN`,
      ...eventQueryResponse.features[1].attributes
    },
    geometry: eventQueryResponse.features[1].geometry
  },
  {
    id: 7,
    type: "events",
    attributes: {
      imageUrl: null,
      ...eventQueryResponse.features[2].attributes
    },
    geometry: eventQueryResponse.features[2].geometry
  }
] as IEventResourceObject[];

export const eventResponseEmpty = {
  data: [] as IEventResourceObject[],
  included: [] as IEventResourceObject[]
};

export const eventResponse = {
  data,
  included: [
    {
      id: siteResponse71a58.id,
      type: "sites",
      attributes: {
        id: siteResponse71a58.id,
        url: siteResponse71a58.url
      }
    },
    {
      id: siteResponse7c395.id,
      type: "sites",
      attributes: {
        id: siteResponse7c395.id,
        url: siteResponse7c395.url
      }
    }
  ] as IEventResourceObject[]
};
