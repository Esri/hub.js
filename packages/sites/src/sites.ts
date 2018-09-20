/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubUrl } from "@esri/hub-domains";

/**
 * Deprecated. Please use getDomains
 * @protected
 */
/* istanbul ignore next no need to have coverage on deprecated functions */
export function fetchDomains(siteId: string, requestOptions?: IRequestOptions) {
  // tslint:disable-next-line
  console.warn(
    `fetchDomains has been deprecated. Please use getDomains instead.`
  );
  return getDomains(siteId, requestOptions);
}

/**
 * Get the domains associated with a Hub Site.
 * @param siteId - Identifier of the Hub Site
 * @param requestOptions - request options that may include authentication
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function getDomains(
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

  return request(url, options);
}

/**
 * Deprecated. Please use getDomain
 * @protected
 */
/* istanbul ignore next no need to have coverage on deprecated functions */
export function fetchDomain(siteId: string, requestOptions?: IRequestOptions) {
  // tslint:disable-next-line
  console.warn(
    `fetchDomain has been deprecated. Please use getDomain instead.`
  );
  return getDomain(siteId, requestOptions);
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
        if (!entry.domain.includes("arcgis.com")) {
          acc = entry;
        }
        return acc;
      }, null);
      if (customEntry) {
        // return the custom domain
        return customEntry.domain;
      } else {
        // just pick the first one
        return response[0].domain;
      }
    } else {
      // there is only 1, so return it
      return response[0].domain;
    }
  });
}
