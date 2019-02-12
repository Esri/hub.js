/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IVoteResourceObject, IResourceObject } from "../../src/search";
import { IGeometry, IFeature, IField } from "@esri/arcgis-rest-common-types";

export const annoQueryResponseEmpty = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  features: [] as IFeature[]
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
        source: null as string,
        status: "pending",
        target: "something",
        description: "this is where the comments go",
        created_at: 1349395200000,
        updated_at: 1349395200000,
        dataset_id: "sgj432"
      },
      geometry: {
        rings: [
          [
            [-12694713.8080383, 5934781.92803049],
            [-12691159.4862231, 5936119.57602548],
            [-12691159.4862231, 5932527.03569609],
            [-12694713.8080383, 5934781.92803049]
          ]
        ]
      } as IGeometry
    },
    {
      attributes: {
        OBJECTID: 2,
        author: "jones",
        source: null as string,
        status: "pending",
        target: "something",
        description: "this is where the comments go",
        created_at: 1349395200001,
        updated_at: 1349395200001,
        dataset_id: "xds466"
      }
    },
    {
      attributes: {
        OBJECTID: 3,
        author: "casey",
        source: null as string,
        status: "pending",
        target: "something",
        data: "i like to hear myself talk",
        created_at: 1349395200002,
        updated_at: 1349395200002,
        dataset_id: "xds466"
      }
    },
    {
      attributes: {
        OBJECTID: 4,
        author: "",
        source: null as string,
        status: "pending",
        target: "something",
        data: "i like to hear myself talk",
        created_at: 1349395200002,
        updated_at: 1349395200002,
        dataset_id: "xds466"
      }
    }
  ]
};

// search is specifically for previous votes on an annotation by the same user, so only one feature returned
export const annoQueryVoteResponse = {
  objectIdFieldName: "OBJECTID",
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  features: [
    {
      attributes: {
        OBJECTID: 2,
        author: "casey",
        source: "hub.js",
        status: "approved",
        target: "something",
        description: null as string,
        created_at: 1349395200001,
        updated_at: 1349395200001,
        dataset_id: "xds466",
        vote: -1
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
    id: 1,
    type: "annotations",
    attributes: {
      OBJECTID: 1,
      author: "casey",
      source: null as string,
      status: "pending",
      target: "something",
      description: "this is where the comments go",
      created_at: 1349395200000,
      updated_at: 1349395200000,
      dataset_id: "sgj432"
    },
    geometry: {
      rings: [
        [
          [-12694713.8080383, 5934781.92803049],
          [-12691159.4862231, 5936119.57602548],
          [-12691159.4862231, 5932527.03569609],
          [-12694713.8080383, 5934781.92803049]
        ]
      ]
    } as IGeometry
  },
  {
    id: 2,
    type: "annotations",
    attributes: {
      OBJECTID: 2,
      author: "jones",
      source: null as string,
      status: "pending",
      target: "something",
      description: "this is where the comments go",
      created_at: 1349395200001,
      updated_at: 1349395200001,
      dataset_id: "xds466"
    }
  },
  {
    id: 3,
    type: "annotations",
    attributes: {
      OBJECTID: 3,
      author: "casey",
      source: null as string,
      status: "pending",
      target: "something",
      data: "i like to hear myself talk",
      created_at: 1349395200002,
      updated_at: 1349395200002,
      dataset_id: "xds466"
    }
  },
  {
    id: 4,
    type: "annotations",
    attributes: {
      OBJECTID: 4,
      author: "",
      source: null as string,
      status: "pending",
      target: "something",
      data: "i like to hear myself talk",
      created_at: 1349395200002,
      updated_at: 1349395200002,
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

export const annoVoteQueryResponseEmpty = {
  objectIdFieldName: "OBJECTID",
  uniqueIdField: {
    name: "OBJECTID",
    isSystemMaintained: true
  },
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4269,
    latestWkid: 4269
  },
  fields: [
    {
      name: "value",
      type: "esriFieldTypeDouble",
      alias: "value",
      domain: null,
      defaultValue: null
    },
    {
      name: "value_count",
      type: "esriFieldTypeInteger",
      alias: "value_count",
      domain: null,
      defaultValue: null
    }
  ] as IField[],
  features: [] as IFeature[]
};

export const annoVoteQueryResponse = {
  objectIdFieldName: "OBJECTID",
  uniqueIdField: {
    name: "OBJECTID",
    isSystemMaintained: true
  },
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4269,
    latestWkid: 4269
  },
  fields: [
    {
      name: "value",
      type: "esriFieldTypeDouble",
      alias: "value",
      domain: null,
      defaultValue: null
    },
    {
      name: "value_count",
      type: "esriFieldTypeInteger",
      alias: "value_count",
      domain: null,
      defaultValue: null
    }
  ] as IField[],
  features: [
    {
      attributes: {
        value: 1,
        value_count: 6
      }
    },
    {
      attributes: {
        value: -1,
        value_count: 3
      }
    },
    {
      attributes: {
        value: 0,
        value_count: 1
      }
    }
  ] as IFeature[]
};

export const annoFeature = {
  id: 1,
  type: "annotations",
  attributes: {
    OBJECTID: 1,
    author: "jones",
    source: null as string,
    status: "pending",
    target: "something",
    description: "this is where the comments go",
    created_at: 1349395200000,
    updated_at: 1349395200000,
    dataset_id: "sgj432"
  },
  geometry: {
    rings: [
      [
        [-12694713.8080383, 5934781.92803049],
        [-12691159.4862231, 5936119.57602548],
        [-12691159.4862231, 5932527.03569609],
        [-12694713.8080383, 5934781.92803049]
      ]
    ]
  } as IGeometry
};

export const invalidIdAnnoFeature = {
  id: -1,
  type: "annotations",
  attributes: {
    OBJECTID: -1,
    author: "jones",
    source: null as string,
    status: "pending",
    target: "something",
    description: "this is where the comments go",
    created_at: 1349395200000,
    updated_at: 1349395200000,
    dataset_id: "sgj432"
  },
  geometry: {
    rings: [
      [
        [-12694713.8080383, 5934781.92803049],
        [-12691159.4862231, 5936119.57602548],
        [-12691159.4862231, 5932527.03569609],
        [-12694713.8080383, 5934781.92803049]
      ]
    ]
  } as IGeometry
};

export const missingIdAnnoFeature = {
  id: -1,
  type: "annotations",
  attributes: {
    author: "jones",
    source: null as string,
    status: "pending",
    target: "something",
    description: "this is where the comments go",
    created_at: 1349395200000,
    updated_at: 1349395200000,
    dataset_id: "sgj432"
  },
  geometry: {
    rings: [
      [
        [-12694713.8080383, 5934781.92803049],
        [-12691159.4862231, 5936119.57602548],
        [-12691159.4862231, 5932527.03569609],
        [-12694713.8080383, 5934781.92803049]
      ]
    ]
  } as IGeometry
};

export const annoVoteResponseEmpty = {
  data: [
    {
      id: 1,
      type: "votes",
      attributes: {
        upVotes: 0,
        downVotes: 0
      }
    }
  ] as IVoteResourceObject[]
};

export const annoVoteResponseInvalid = {
  data: [] as IVoteResourceObject[]
};

export const annoVoteResponse = {
  data: [
    {
      id: 1,
      type: "votes",
      attributes: {
        upVotes: 6,
        downVotes: 3
      }
    }
  ] as IVoteResourceObject[]
};

export const allAnnoVoteQueryResponseEmpty = {
  objectIdFieldName: "OBJECTID",
  uniqueIdField: {
    name: "OBJECTID",
    isSystemMaintained: true
  },
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4269,
    latestWkid: 4269
  },
  fields: [
    {
      name: "parent_id",
      type: "esriFieldTypeDouble",
      alias: "parent_id",
      domain: null,
      defaultValue: null
    },
    {
      name: "count",
      type: "esriFieldTypeInteger",
      alias: "count",
      domain: null,
      defaultValue: null
    }
  ] as IField[],
  features: [] as IFeature[]
};

export const allAnnoUpVoteQueryResponse = {
  objectIdFieldName: "OBJECTID",
  uniqueIdField: {
    name: "OBJECTID",
    isSystemMaintained: true
  },
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4269,
    latestWkid: 4269
  },
  fields: [
    {
      name: "parent_id",
      type: "esriFieldTypeDouble",
      alias: "parent_id",
      domain: null,
      defaultValue: null
    },
    {
      name: "count",
      type: "esriFieldTypeInteger",
      alias: "count",
      domain: null,
      defaultValue: null
    }
  ] as IField[],
  features: [
    {
      attributes: {
        parent_id: 1,
        count: 6
      }
    }
  ] as IFeature[]
};

export const allAnnoDownVoteQueryResponse = {
  objectIdFieldName: "OBJECTID",
  uniqueIdField: {
    name: "OBJECTID",
    isSystemMaintained: true
  },
  globalIdFieldName: "",
  geometryType: "esriGeometryPolygon",
  spatialReference: {
    wkid: 4269,
    latestWkid: 4269
  },
  fields: [
    {
      name: "parent_id",
      type: "esriFieldTypeDouble",
      alias: "parent_id",
      domain: null,
      defaultValue: null
    },
    {
      name: "count",
      type: "esriFieldTypeInteger",
      alias: "count",
      domain: null,
      defaultValue: null
    }
  ] as IField[],
  features: [
    {
      attributes: {
        parent_id: 1,
        count: 3
      }
    },
    {
      attributes: {
        parent_id: 2,
        count: 1
      }
    }
  ] as IFeature[]
};

export const allAnnoVoteResponseEmpty = {
  data: [] as IVoteResourceObject[]
};

export const allAnnoVoteResponse = {
  data: [
    {
      id: 1,
      type: "votes",
      attributes: {
        upVotes: 6,
        downVotes: 3
      }
    },
    {
      id: 2,
      type: "votes",
      attributes: {
        upVotes: 0,
        downVotes: 1
      }
    }
  ] as IVoteResourceObject[]
};
