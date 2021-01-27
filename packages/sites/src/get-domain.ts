/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl, IHubRequestOptions } from "@esri/hub-common";
import { _getDomainServiceUrl } from "./domains";

/**
 * Get the domains associated with a Hub Site.
 * @param siteId - Identifier of the Hub Site
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function getDomains(
  siteId: string,
  requestOptions?: IRequestOptions | IHubRequestOptions
): Promise<any> {
  const url = _getDomainServiceUrl(getHubApiUrl(requestOptions));

  const options: IRequestOptions = {
    params: { siteId },
    httpMethod: "GET",
    ...requestOptions
  };

  return request(url, options);
}

/**
 * Get the domain associated with a Hub Site. Since a site may have a
 * custom domain, in addition to a default domain, we will return the
 * custom domain over the default domain.
 *
 * @param siteId - Identifier of the Hub Site
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function getDomain(
  siteId: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  return getDomains(siteId, requestOptions).then(response => {
    if (response.length > 1) {
      // ok - in this case, it's likely that we have a default domain and a custom domain...
      // we want the one that's custom... i.e. does not contain arcgis.com
      const customEntry = response.reduce((acc: any, entry: any) => {
        if (!entry.hostname.includes("arcgis.com")) {
          acc = entry;
        }
        return acc;
      }, null);
      if (customEntry) {
        // return the custom domain
        return customEntry.hostname;
      } else {
        // just pick the first one
        return response[0].hostname;
      }
    } else {
      // there is only 1, so return it
      return response[0].hostname;
    }
  });
}
