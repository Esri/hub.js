/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { UserSession, IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  setItemAccess,
  getPortal,
  searchItems,
  updateItem,
  protectItem
} from "@esri/arcgis-rest-portal";
import {
  createFeatureService,
  addToServiceDefinition,
  IAddToServiceDefinitionOptions
} from "@esri/arcgis-rest-service-admin";
import {
  defaultExtent,
  editorTrackingInfo,
  annotationServiceDefinition
} from "./layer-definition";

export interface ICreateAnnoOptions extends IUserRequestOptions {
  /**
   * The organization that will host the annotation service if it doesn't already exist.
   */
  orgId?: string;
}

/**
 * ```js
 * import { createAnnotationService } from "@esri/hub-annotations";
 * //
 * createAnnotationService({
 *   orgId: "yb9",
 *   authentication
 * })
 *   .then(response => // { success: true, itemId: "fe3" } );
 * ```
 *
 * Create a new hosted annotation feature service for an organization if ArcGIS Hub hasn't already been enabled.
 * @param requestOptions - request options that include authentication
 * @returns A Promise that will resolve with the response from the service after attempting to create a new hosted annotation service.
 */
export function createAnnotationService(
  requestOptions: ICreateAnnoOptions
): Promise<any> {
  const session = requestOptions.authentication as UserSession;

  // check to see if an annotation service has already been created in the organization
  return searchItems({
    q: `typekeywords:hubAnnotationLayer AND orgid:${requestOptions.orgId}`,
    authentication: session
  }).then(searchResponse => {
    if (searchResponse.results.length > 0) {
      // if the org already has a hosted annotations service, dont create another one
      return searchResponse.results[0];
    } else {
      return getPortal(requestOptions.orgId, {
        authentication: requestOptions.authentication
      }).then(portalResponse => {
        const clonedServiceDefinition = JSON.parse(
          JSON.stringify(annotationServiceDefinition)
        );
        // use the default extent of the organization for the new service
        if (portalResponse.defaultExtent) {
          clonedServiceDefinition.extent = portalResponse.defaultExtent;
        }

        const description = `Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.`;

        // const options:ICreateServiceOptions (no workee)
        const options = {
          authentication: session,
          item: {
            // NOTE: this will also be the item title (until we update it in a few seconds)
            name: "hub_annotations",
            description,
            serviceDescription: description,
            copyrightText: "",
            capabilities: clonedServiceDefinition.capabilities,
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
            layers: [clonedServiceDefinition]
          } as IAddToServiceDefinitionOptions).then(() => {
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
                  // set the typeKeyword for later searches
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
                // share the item publically
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
        });
        /*
          firing off all the requests at once would be preferable, but in my own testing,
          the sharing wasn't updated consistently

          return Promise.all([ ... ])
        */
      });
    }
  });
}
