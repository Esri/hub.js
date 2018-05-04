/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-common-types";
import { getItem, getItemData } from "@esri/arcgis-rest-items";
import { IInitiative, IInitiativeItem } from "@esri/hub-common-types";
import { getHubUrl } from "@esri/hub-initiatives";

/**
 * Fetch the domains associated with a Hub Site.
 * @param siteId - Identifier of the Hub Site
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function fetchDomain(
  siteId: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  const apiUrl = getHubUrl(requestOptions);
  const url = `${apiUrl}/utilities/domains`;

  const options: IRequestOptions = {
    params: { siteId },
    httpMethod: "GET",
    ...requestOptions
  };

  return request(url, options).then(result => {
    return result;
  });
}
