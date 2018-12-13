import { ILayerDefinition, IExtent } from "@esri/arcgis-rest-common-types";

/**
 * @private
 */
export const defaultExtent: IExtent = {
  xmin: -180,
  ymin: -90,
  xmax: 180,
  ymax: 90,
  spatialReference: {
    wkid: 4326
  }
};

/**
 * @private
 */
export const editorTrackingInfo = {
  enableEditorTracking: true,
  enableOwnershipAccessControl: true,
  allowOthersToQuery: true,
  allowOthersToUpdate: false,
  allowOthersToDelete: false,
  allowAnonymousToQuery: true,
  allowAnonymousToUpdate: false,
  allowAnonymousToDelete: false
};

/**
 * @private
 */
export const annotationServiceDefinition: ILayerDefinition = {
  allowGeometryUpdates: true,
  capabilities: "Query,Editing,Create,Update",
  copyrightText: "",
  defaultVisibility: true,
  description: "",
  drawingInfo: {
    transparency: 0,
    labelingInfo: null,
    renderer: {
      type: "simple",
      symbol: {
        color: [20, 158, 206, 70],
        outline: {
          color: [255, 255, 255, 229],
          width: 2.25,
          type: "esriSLS",
          style: "esriSLSSolid"
        },
        type: "esriSFS",
        style: "esriSFSSolid"
      }
    }
  },
  extent: defaultExtent,
  fields: [
    {
      name: "OBJECTID",
      type: "esriFieldTypeOID",
      alias: "OBJECTID",
      nullable: false,
      editable: false,
      domain: null,
      defaultValue: null
    },
    {
      name: "created_at",
      type: "esriFieldTypeDate",
      alias: "created_at",
      length: 8,
      nullable: true,
      editable: false,
      domain: null,
      defaultValue: null
    },
    {
      name: "author",
      type: "esriFieldTypeString",
      alias: "author",
      length: 128,
      nullable: true,
      editable: false,
      domain: null,
      defaultValue: null
    },
    {
      name: "updated_at",
      type: "esriFieldTypeDate",
      alias: "updated_at",
      length: 8,
      nullable: true,
      editable: false,
      domain: null,
      defaultValue: null
    },
    {
      name: "updater",
      type: "esriFieldTypeString",
      alias: "updater",
      length: 128,
      nullable: true,
      editable: false,
      domain: null,
      defaultValue: null
    },
    {
      name: "data",
      type: "esriFieldTypeString",
      alias: "data",
      length: 4000,
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "description",
      type: "esriFieldTypeString",
      alias: "description",
      length: 4000,
      nullable: false,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "status",
      type: "esriFieldTypeString",
      alias: "status",
      length: 256,
      nullable: false,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "source",
      type: "esriFieldTypeString",
      alias: "source",
      length: 2000,
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "target",
      type: "esriFieldTypeString",
      alias: "target",
      length: 2000,
      nullable: false,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "edits",
      type: "esriFieldTypeString",
      alias: "edits",
      length: 4000,
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "parent_id",
      type: "esriFieldTypeInteger",
      alias: "parent_id",
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "dataset_id",
      type: "esriFieldTypeString",
      alias: "dataset_id",
      length: 256,
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "feature_id",
      type: "esriFieldTypeInteger",
      alias: "feature_id",
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "attribute",
      type: "esriFieldTypeString",
      alias: "attribute",
      length: 256,
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "value",
      type: "esriFieldTypeInteger",
      alias: "value",
      nullable: true,
      editable: true,
      domain: null,
      defaultValue: null
    }
  ],
  geometryType: "esriGeometryPolygon",
  hasAttachments: true,
  hasZ: false,
  hasStaticData: false,
  htmlPopupType: "esriServerHTMLPopupTypeNone",
  isDataVersioned: false,
  name: "hub_annotations",
  objectIdField: "OBJECTID",
  relationships: [],
  supportsAdvancedQueries: true,
  supportsRollbackOnFailureParameter: true,
  supportsStatistics: true,
  templates: [
    {
      name: "New Feature",
      description: "",
      drawingTool: "esriFeatureEditToolPolygon",
      prototype: {
        attributes: {
          description: "",
          status: "",
          target: ""
        }
      }
    }
  ],
  type: "Feature Layer",
  typeIdField: "",
  types: [],
  timeInfo: {},
  editFieldsInfo: {
    creationDateField: "created_at",
    creatorField: "author",
    editDateField: "updated_at",
    editorField: "updater"
  }
};
