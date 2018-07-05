const annoQueryResponseEmptyFeatureless = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  }
};

export const annoQueryResponseEmpty = {
  ...annoQueryResponseEmptyFeatureless,
  features: [] as any
};

const data = [
  {
    attributes: {
      OBJECTID: 1,
      author: "casey",
      source: null as any,
      status: "pending",
      target: null as any,
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
      target: null as any,
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
      target: null as any,
      data: "i like to hear myself talk",
      created_at: 1349395200002,
      updated_at: null as any,
      dataset_id: "xds466"
    }
  }
];

export const annoQueryResponse = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  // fields: [],
  features: data
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

export const annoResponseEmpty = {
  data: [] as any,
  included: [] as any
};

export const annoResponse = {
  data,
  included: [
    {
      id: userResponseCasey.username,
      type: "user",
      attributes: userResponseCasey
    },
    {
      id: userResponseJones.username,
      type: "user",
      attributes: userResponseJones
    }
  ]
};
