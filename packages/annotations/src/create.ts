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
  const session = requestOptions.authentication;

  // check to see if an annotation service has already been created in the organization
  return searchItems({
    q: `typekeywords:hubAnnotationLayer AND orgid:${requestOptions.orgId}`,
    authentication: session
  }).then(searchResponse => {
    if (searchResponse.results.length > 0) {
      // if the org already has a hosted annotations service, dont create another one
      return searchResponse.results[0];
    } 

    return getPortal(requestOptions.orgId, {
      authentication: requestOptions.authentication
    }).then(portalResponse => {
      const clonedServiceDefinition = cloneObject(annotationServiceDefinition);

      // use the default extent of the organization for the new service
      if (portalResponse.defaultExtent) {
        clonedServiceDefinition.extent = portalResponse.defaultExtent;
      }

      // if one isn't yet present, create a new one
      return initializeFeatureService(session, clonedServiceDefinition.capabilities).then((createResponse: any) => {
        const itemId = createResponse.itemId

        // next, update the layer definition (using a template)
        return addLayersToService(session, createResponse.serviceurl, clonedServiceDefinition).then(() => {
          // sometimes TS likes session, sometimes it likes options.authentication
          return updateItemDefinition(session, itemId).then(() => {
            return preventAccidentalDeletion(session, itemId).then(() => {
              return makeItemPublic(session, itemId).then(success(itemId));
            });
          });
        });
      });
    });    
  });
}

// TODO: this should use @esri/hub-common once the imports are sorted out
function cloneObject (obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

function initializeFeatureService (session: UserSession, capabilities: any) {
  const description = 'Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.';

  // const options:ICreateServiceOptions (no workee)
  const options = {
    authentication: session,
    item: {
      // NOTE: this will also be the item title (until we update it in a few seconds)
      name: "hub_annotations",
      description,
      serviceDescription: description,
      copyrightText: "",
      capabilities,
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


  return new Promise((resolve, reject) => {
    createFeatureService(options).then(createResponse => {
      if (!createResponse.success) {
        return reject(new ArcGISRequestError(
          `Failure to create service. One common cause is the presence of an existing service that shares the same name.`
        ))
      }
  
      return resolve(createResponse)
    })  
  });
}

function addLayersToService (session: UserSession, serviceUrl: string, clonedServiceDefinition: any) {
  const serviceDefinitionOptions = {
    authentication: session,
    layers: [clonedServiceDefinition]
  }

  return addToServiceDefinition(serviceUrl, serviceDefinitionOptions)
}

function updateItemDefinition (session: UserSession, id: string) {
  const snippet = 'Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.';

  const updateItemOptions = {
    authentication: session,
    item: {
      id,
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
      snippet
    }
  }

  return updateItem(updateItemOptions)
}

function preventAccidentalDeletion (session: UserSession, id: string) {
  return protectItem({
    id,
    authentication: session
  })
}

function makeItemPublic (session: UserSession, id: string) {
  // share the item publically
  return setItemAccess({
    id,
    access: "public",
    authentication: session
  })
}

function success (itemId: string) {
  return () => {
    return new Promise(resolve =>
      resolve({
        success: true,
        itemId
      })
    );  
  }
}