import { IFeature } from "@esri/arcgis-rest-common-types";

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
    }
  ]
};
