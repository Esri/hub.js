import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { _getHubUrlFromPortalHostname } from './urls/_get-hub-url-from-portal-hostname';
import { IHubRequestOptions } from "./types";

/**
 * ```js
 * import { getHubApiUrl() } from "@esri/hub-common";
 * //
 * getHubApiUrl({ portal: "https://custom.maps.arcgis.com/sharing/rest" })
 * >> "https://hub.arcgis.com"
 * ```
 * Retrieves the Hub API Url associated with a specific ArcGIS Online organization.
 * @param requestOptions - request options that may include authentication
 * @returns the associated Hub API Url as a string.
 */
export function getHubApiUrl(requestOptions: IRequestOptions): string {
  return _getHubUrlFromPortalHostname(getPortalUrl(requestOptions));
  
}

export function getFromHubAPI(id:string, hubRequestOptions?: IHubRequestOptions): Promise<any> {
  let hubUrl = "https://hub.arcgis.com/api";
  let headers:any = {};

  if (hubRequestOptions !== undefined) {
    hubUrl = hubRequestOptions.hubApiUrl;
    headers['Authorization'] =  hubRequestOptions.authentication.token;
  }
  
  const url = `${hubUrl}/v3/datasets/${id}`;
  const opts = {
    method: "GET",
    mode: "cors",
    headers
  } as RequestInit;

  // TODO: handle Hub missing content by ID
  return fetch(url, opts)
    .then(response => {
      if (!response.ok) {
        // TODO: handle passing up enumerated Hub API error codes
        throw Error(response);
      }
      return response.json()
    )
    .then(contentData => {
      return contentData;
    })
    .catch(err => {
      throw Error(
        `getFromHubAPI: Error requesting from Hub API: ${err}`
      );
    }); 
}
