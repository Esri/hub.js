/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IResourceObject } from "../../src/search";

export const annoQueryResponseEmpty = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  features: [] as any
};

export const annoQueryResponse = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  // fields: [],
  features: [
    {
      attributes: {
        OBJECTID: 1,
        author: "casey",
        source: null as any,
        status: "pending",
        target: "something",
        description: "this is where the comments go",
        created_at: 1349395200000,
        updated_at: null,
        dataset_id: "sgj432"
      }
    },
    {
      attributes: {
        OBJECTID: 2,
        author: "jones",
        source: null as any,
        status: "pending",
        target: "something",
        description: "this is where the comments go",
        created_at: 1349395200001,
        updated_at: null as any,
        dataset_id: "xds466"
      }
    },
    {
      attributes: {
        OBJECTID: 3,
        author: "casey",
        source: null as any,
        status: "pending",
        target: "something",
        data: "i like to hear myself talk",
        created_at: 1349395200002,
        updated_at: null as any,
        dataset_id: "xds466"
      }
    }
  ]
};

export const userResponseCasey = {
  username: "casey",
  fullName: "Casey Shaft",
  firstName: "Casey",
  lastName: "Shaft",
  description: "Neogeographer and purveyor of personal storytelling.",
  tags: [
    "websux",
    "never",
    "hubInitiativeId|d603b719ba9b4060baa6731b531abf08",
    "hubEventGroupId|bkrWlSKcjUDFDtgw|a4647526b8ea44a38cada61210144a15"
  ],
  culture: "en",
  cultureFormat: null as any,
  region: "WO",
  units: "english",
  thumbnail: "Andrew_Turner_-_DC_Social_Meetup_-_Square.jpg",
  created: 1346876642000,
  modified: 1513802298000,
  provider: "arcgis"
};

export const userResponseJones = {
  username: "jones",
  fullName: "Casey Shaft",
  firstName: "Casey",
  lastName: "Shaft",
  description: "Neogeographer and purveyor of personal storytelling.",
  tags: [
    "websux",
    "never",
    "hubInitiativeId|d603b719ba9b4060baa6731b531abf08",
    "hubEventGroupId|bkrWlSKcjUDFDtgw|a4647526b8ea44a38cada61210144a15"
  ],
  culture: "en",
  cultureFormat: null as any,
  region: "WO",
  units: "english",
  thumbnail: "Andrew_Turner_-_DC_Social_Meetup_-_Square.jpg",
  created: 1346876642000,
  modified: 1513802298000,
  provider: "arcgis"
};

const data = [
  {
    id: "casey",
    type: "annotations",
    attributes: {
      OBJECTID: 1,
      author: "casey",
      source: null as any,
      status: "pending",
      target: "something",
      description: "this is where the comments go",
      created_at: 1349395200000,
      updated_at: null,
      dataset_id: "sgj432"
    }
  },
  {
    id: "jones",
    type: "annotations",
    attributes: {
      OBJECTID: 2,
      author: "jones",
      source: null as any,
      status: "pending",
      target: "something",
      description: "this is where the comments go",
      created_at: 1349395200001,
      updated_at: null as any,
      dataset_id: "xds466"
    }
  },
  {
    id: "casey",
    type: "annotations",
    attributes: {
      OBJECTID: 3,
      author: "casey",
      source: null as any,
      status: "pending",
      target: "something",
      data: "i like to hear myself talk",
      created_at: 1349395200002,
      updated_at: null as any,
      dataset_id: "xds466"
    }
  }
] as IResourceObject[];

export const annoResponseEmpty = {
  // data: [] as Array<IResourceObject>,
  // included: [] as Array<IResourceObject>
  data: [] as IResourceObject[],
  included: [] as IResourceObject[]
};

export const annoResponse = {
  data,
  included: [
    {
      id: userResponseCasey.username,
      type: "users",
      attributes: userResponseCasey
    },
    {
      id: userResponseJones.username,
      type: "users",
      attributes: userResponseJones
    }
  ] as IResourceObject[]
};
