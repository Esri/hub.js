/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import { getSelf } from "@esri/arcgis-rest-portal";
import { getHubApiUrlFromPortal } from "../urls/get-hub-api-url-from-portal";
import { getPortalApiUrl } from "../urls/get-portal-api-url";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubRequestOptionsPortalSelf } from "../types";

export interface IGetHubRequestOptionsOptions extends IRequestOptions {
  token?: string;
  portalSelf?: IHubRequestOptionsPortalSelf;
}

/**
 * A utility method to create an IHubRequestOptions object
 * @param {Object} [options={}] An optional map of options
 * @param {UserSession} [options.authentication] An optional UserSession object
 * @param {string} [options.portal] An optional portal URL
 * @param {token} [options.token] An optional token
 * @param {portalSelf} [options.portalSelf] An optional IHubRequestOptionsPortalSelf object
 * @returns {Promise}
 */
export function getHubRequestOptions(
  options: IGetHubRequestOptionsOptions = {}
) {
  const { portal, token, portalSelf } = options;
  let authentication = options.authentication;
  if (!authentication) {
    if (token) {
      if (!portal && !portalSelf) {
        throw new Error(
          "Must provide portal or portalSelf when token is provided"
        );
      }

      authentication = new UserSession({
        token,
        portal: getPortalApiUrl(portalSelf || portal),
      });
    }
  }
  const promise = portalSelf
    ? Promise.resolve(portalSelf)
    : getSelf({ authentication });
  return promise.then((portalSelfResult) => ({
    isPortal: portalSelfResult.isPortal,
    hubApiUrl: getHubApiUrlFromPortal(portalSelfResult),
    portalSelf: portalSelfResult,
    authentication,
  }));
}
