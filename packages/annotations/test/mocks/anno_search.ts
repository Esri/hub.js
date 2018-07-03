export const annoQueryResponseEmpty = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  // fields: [],
  features: [] as any
};

const features = [
  {
    attributes: {
      OBJECTID: 1,
      author: "casey",
      data: "this is where the comments go",
      created_at: 1349395200000,
      dataset_id: "sgj432",
      Shape__Area: 1,
      Shape__Length: 1
    }
  },
  {
    attributes: {
      OBJECTID: 1,
      author: "jones",
      data: "this is where the comments go",
      created_at: 1349395200001,
      dataset_id: "xds466",
      Shape__Area: 1,
      Shape__Length: 1
    }
  },
  {
    attributes: {
      OBJECTID: 1,
      author: "casey",
      data: "i like to hear myself talk",
      created_at: 1349395200002,
      dataset_id: "xds466",
      Shape__Area: 1,
      Shape__Length: 1
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
  features
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
  features: [] as any,
  users: [] as any
};

export const annoResponse = {
  features,
  users: [userResponseCasey, userResponseJones]
};
