// These Types and Functions can land in rest-js
// a friendly name for the scope of the resource
// the API deals with clientIds, which are
// listed here https://confluencewikidev.esri.com/pages/viewpage.action?pageId=50561461
// Generally speaking, the UserResourceScope is a downcased version of the
// clientId. Hub is unique b/c Sites have their own clientId,

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { failSafe } from "../fail-safe";
import { getObjectSize } from "../getObjectSize";

// Defines the access for the resource
// see the API details listed at the url in the comment above
export type UserResourceAccess =
  // Resource is available only to the user through the app from which resource was uploaded.
  | "userappprivate"
  // Resource is available only to the user that uploaded the resource through any app
  | "userprivateallapps"
  // resource is available to all members of the org as that of the resource owner and through
  // the app that uploaded. We allow adding resource with level only if the user's access is either public or org
  | "allorgusersprivateapp"
  // Resource is available to anyone (including anonymous access) through any app. We allow adding a
  // resource at public level only if the user's access is public and the canSharePublic flag of the org is set to true
  | "public";

/**
 * Add an User-App Resource
 */
export interface IAddUserResource {
  key: string; // aka filename
  data: Record<string, any>; // json object to store; will be stringified
  access: UserResourceAccess; // access level
}

// Returned when we get a list of resources for a user
export interface IUserResourceInfo {
  key: string;
  clientId: string;
  created: string;
  size: number;
  access: UserResourceAccess;
}

export interface IUserResourceListResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  userResources: IUserResourceInfo[];
}

/**
 * Set a User-App-Resource
 * By default this will fetch and merge with an existing resource.
 * Passing `true` as the last parameter,
 * @param resource
 * @param username
 * @param portalUrl
 * @param token
 * @param replace
 * @returns
 */
export async function setUserResource(
  resource: IAddUserResource,
  username: string,
  portalUrl: string,
  token: string,
  replace: boolean = false
): Promise<void> {
  // Ensure we are below 5MB max size
  if (getObjectSize(resource.data).megabytes > 4.95) {
    throw new Error(
      `User Resource is too large to store. Please ensure it is less than 5MB in size`
    );
  }

  let payload = resource.data;
  if (!replace) {
    const fsGetResource = failSafe(getUserResource, {});
    const currentResource = await fsGetResource(
      username,
      resource.key,
      portalUrl,
      token
    );
    // extend current object witn updated object
    payload = { ...currentResource, ...resource.data };
  }
  const ro: IRequestOptions = {
    portal: portalUrl,
    httpMethod: "POST",
    params: {
      text: JSON.stringify(payload),
      access: resource.access,
      key: resource.key,
      token,
    },
  };
  // TODO Experiment w/ how we can make this call w/o creating a UserSession with the token
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/addResource`,
    ro
  );
}

/**
 * Gets a user resource.
 * If the resource does not exist, this will throw. This can be wrapped in `failSafe`
 * configured to return an empty object.
 * @param username
 * @param key
 * @param portalUrl
 * @param token
 * @returns
 */
export function getUserResource(
  username: string,
  key: string,
  portalUrl: string,
  token: string
): Promise<Record<string, any>> {
  const ro: IRequestOptions = {
    portal: portalUrl,
  };
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/resources/${key}?token=${token}`,
    ro
  );
}

/**
 * Remove a resource
 * Used primarily in tests, but can be useful if you need to clean up
 * settings that are no longer used
 * @param username
 * @param key
 * @param portalUrl
 * @param token
 * @returns
 */
export function removeUserResource(
  username: string,
  key: string,
  portalUrl: string,
  token: string
): Promise<Record<string, any>> {
  const ro: IRequestOptions = {
    portal: portalUrl,
    httpMethod: "POST",
    params: {
      key,
      token,
    },
  };
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/removeResource`,
    ro
  );
}

/**
 * List user resources associated with
 * @param username
 * @param portalUrl
 * @param token
 * @returns
 */
export function listUserResources(
  username: string,
  portalUrl: string,
  token: string,
  returnAllApps: boolean = false
): Promise<IUserResourceListResponse> {
  const ro: IRequestOptions = {
    portal: portalUrl,
  };
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/resources?f=json&token=${token}&returnAllApps=${returnAllApps}`,
    ro
  ) as Promise<IUserResourceListResponse>;
}
