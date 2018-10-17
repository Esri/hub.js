/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { UserSession, IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { setItemAccess } from "@esri/arcgis-rest-sharing";
import { searchItems, updateItem, protectItem } from "@esri/arcgis-rest-items";
import {
  createFeatureService,
  addToServiceDefinition,
  IAddToServiceDefinitionRequestOptions
} from "@esri/arcgis-rest-feature-service-admin";
import {
  defaultExtent,
  editorTrackingInfo,
  annotationServiceDefinition
} from "./layer-definition";

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
 *   orgId: "yb9",
 *   authentication
 * })
 *   .then(response => // { success: true, itemId: "fe3" } );
 * ```
 *
 * Create a new hosted annotation feature service for an organization if ArcGIS Hub hasn't already been enabled.
 * @param requestOptions - request options that include authentication
 * @returns A Promise that will resolve with response from the service after attempting to create a new hosted annotation service.
 */
export function createAnnotationService(
  requestOptions: ICreateAnnoRequestOptions
): Promise<any> {
  const session = requestOptions.authentication as UserSession;

  // check to see if an annotation service has already been created in the organization
  return searchItems({
    searchForm: {
      q: `typekeywords:hubAnnotationLayer AND orgid:${requestOptions.orgId}`
    },
    authentication: session
  }).then(searchResponse => {
    if (searchResponse.results.length > 0) {
      // if the org already has a hosted annotations service, abort
      return searchResponse.results[0];
    } else {
      const description = `Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.`;

      // const options:ICreateServiceRequestOptions (no workee)
      const options = {
        authentication: session,
        item: {
          // NOTE: this will also be the item title (until we update it)
          name: "hub_annotations",
          description,
          serviceDescription: description,
          copyrightText: "",
          capabilities: "Create,Delete,Query,Update,Editing",
          spatialReference: defaultExtent.spatialReference,
          xssPreventionInfo: {
            xssPreventionEnabled: true,
            xssPreventionRule: "InputOutput",
            xssInputRule: "sanitizeInvalid"
          },
          maxRecordCount: 2000,
          hasStaticData: false,
          units: "esriMeters",
          // anonymous users cant update or delete existing comments, only add new ones
          editorTrackingInfo
        }
      };

      // if one isnt yet present, create a new one
      return createFeatureService(options).then(createResponse => {
        if (!createResponse.success) {
          throw new ArcGISRequestError(
            `Failure to create service. One common cause is the presence of an existing service that shares the same name.`
          );
        }
        // next, update the layer definition (using a template)
        return addToServiceDefinition(createResponse.serviceurl, {
          authentication: session,
          layers: [annotationServiceDefinition]
        } as IAddToServiceDefinitionRequestOptions).then(() => {
          // sometimes TS likes session, sometimes it likes options.authentication
          return updateItem({
            authentication: session,
            item: {
              id: createResponse.itemId,
              // set the 'hubAnnotationLayer' typeKeyword for later searches
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
            // prevent the item from being accidentally deleted
            return protectItem({
              id: createResponse.itemId,
              authentication: session
            }).then(() => {
              // make the item public
              return setItemAccess({
                id: createResponse.itemId,
                access: "public",
                authentication: session
              }).then(() => {
                return new Promise(resolve =>
                  resolve({
                    success: true,
                    itemId: createResponse.itemId
                  })
                );
              });
            });
          });
        });

        // firing off all the requests at once would be preferable, but the sharing isnt updated consistently when we do that
        // return Promise.all([ ... ])
      });
    }
  });
}
