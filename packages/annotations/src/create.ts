/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession, IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { ILayerDefinition, IExtent } from "@esri/arcgis-rest-common-types";
import { setItemAccess } from "@esri/arcgis-rest-sharing";
import { searchItems, updateItem, protectItem } from "@esri/arcgis-rest-items";

import {
  createFeatureService,
  addToServiceDefinition,
  IAddToServiceDefinitionRequestOptions
} from "@esri/arcgis-rest-feature-service-admin";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";

const defaultExtent: IExtent = {
  xmin: -180,
  ymin: -90,
  xmax: 180,
  ymax: 90,
  spatialReference: {
    wkid: 4326
  }
};

const editorTrackingInfo = {
  enableEditorTracking: true,
  enableOwnershipAccessControl: true,
  allowOthersToUpdate: false,
  allowOthersToDelete: false,
  allowOthersToQuery: true,
  allowAnonymousToUpdate: false,
  allowAnonymousToDelete: false
};

const annotationServiceDefinition: ILayerDefinition = {
  allowGeometryUpdates: true,
  capabilities: "Create,Delete,Query,Update,Editing",
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
      name: "author",
      type: "esriFieldTypeString",
      alias: "author",
      length: 256,
      nullable: false,
      editable: true,
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
      name: "created_at",
      type: "esriFieldTypeDate",
      alias: "created_at",
      length: 0,
      nullable: false,
      editable: true,
      domain: null,
      defaultValue: null
    },
    {
      name: "updated_at",
      type: "esriFieldTypeDate",
      alias: "updated_at",
      length: 0,
      nullable: true,
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
          author: "",
          data: null,
          description: "",
          status: "",
          source: null,
          target: "",
          created_at: null,
          updated_at: null,
          edits: null,
          parent_id: null,
          dataset_id: null,
          feature_id: null,
          attribute: null
        }
      }
    }
  ],
  type: "Feature Layer",
  typeIdField: "",
  types: [],
  timeInfo: {},
  editFieldsInfo: {
    creationDateField: "",
    creatorField: "",
    editDateField: "",
    editorField: ""
  }
};

export interface ICreateAnnoRequestOptions extends IUserRequestOptions {
  /**
   * The organization that will host the annotation service if it doesn't already exist.
   */
  orgId?: string;
}

/**
 * ```js
 * import { createAnnotationService } from "@esri/hub-annotations";
 * createAnnotationService({
 *   orgId: "abc123",
 *   authentication
 * })
 *   .then(response => // url);
 * ```
 * Add an annotation to ArcGIS Hub. Uses authentication to derive authorship, appends a timestamp and sets a default status of "pending" to new comments by default.
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with response from the service after attempting to add one or more new annotations.
 */
export function createAnnotationService(
  requestOptions: ICreateAnnoRequestOptions
): Promise<any> {
  /*
    use orgid to determine whether an annotation service already exists
    if it doesnt, create from a template
    after the item is created, update the layer definition using a template
    make the item public
    set the typeKeyword for search
    protect the item

    to do:
    define response signature
    (tweaked) url
    more metadata?
    indication of whether it was created or already existed?
  */

  const session = requestOptions.authentication as UserSession;

  return searchItems({
    searchForm: {
      q: `typekeywords:hubAnnotationLayer AND orgid:${requestOptions.orgId}`
    },
    authentication: session
  }).then(searchResponse => {
    if (searchResponse.results.length > 0) {
      // if the org already has a hosted annotations feature service, dont create another one
      return new Promise(resolve => resolve(searchResponse.results[0]));
    } else {
      const description = `Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.`;

      // const options:ICreateServiceRequestOptions (no workee)
      const options = {
        authentication: session,
        item: {
          name: "hub_annotations",
          description,
          serviceDescription: description,
          copyrightText: "CC0",
          capabilities: "Create,Delete,Query,Update,Editing",
          spatialReference: defaultExtent.spatialReference,
          xssPreventionInfo: {
            xssPreventionEnabled: true,
            xssPreventionRule: "InputOutput",
            xssInputRule: "sanitizeInvalid"
          },
          maxRecordCount: 2000,
          hasStaticData: false,
          units: "meters",
          editorTrackingInfo
        }
      };

      return createFeatureService(options).then(createResponse => {
        if (!createResponse.success) {
          throw new ArcGISRequestError(
            `Failure to create service. One common cause is the presence of an existing hosted feature service that shares the same name.`
          );
        }
        return addToServiceDefinition(createResponse.serviceurl, {
          authentication: session,
          layers: [annotationServiceDefinition]
        } as IAddToServiceDefinitionRequestOptions).then(() => {
          // sometimes TS likes session, sometimes it likes options.authentication
          return updateItem({
            authentication: session,
            item: {
              id: createResponse.itemId,
              typeKeywords: [
                "ArcGIS Server",
                "Data",
                "Feature Access",
                "Feature Service",
                "Service",
                "Singlelayer",
                "Hosted Service",
                "hubAnnotationLayer"
              ],
              title: "Hub Annotations",
              snippet: options.item.serviceDescription
            }
          }).then(() => {
            return protectItem({
              id: createResponse.itemId,
              authentication: session
            }).then(() => {
              return setItemAccess({
                id: createResponse.itemId,
                access: "public",
                authentication: session
              });
            });
          });
        });

        // firing off  all the requests at once would be preferable, but the sharing isnt updated consistently when we do that
        // return Promise.all([ ... ])
      });
    }
  });
}
