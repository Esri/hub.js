// These Types and Functions can land in rest-js
// a friendly name for the scope of the resource
// the API deals with clientIds, which are
// listed here https://confluencewikidev.esri.com/pages/viewpage.action?pageId=50561461
// Generally speaking, the UserResourceScope is a downcased version of the
// clientId. Hub is unique b/c Sites have their own clientId,

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { failSafe } from "./fail-safe";
import { getObjectSize } from "./getObjectSize";

// AND (unlike other apps) we can exchange that for other Esri App clientIds.
export type UserResourceApp = "self" | "hubforarcgis" | "arcgisonline";

// Defines the access for the resource
export type UserResourceAccess =
  | "userappprivate" // default
  | "userprivateallapps" // readable by any platform app, private to user
  | "allorgusersprivateapp" // only if user is public or org
  | "public"; // only if user is public or org

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
 * @param portal
 * @param token
 * @param replace
 * @returns
 */
export async function setUserResource(
  resource: IAddUserResource,
  username: string,
  portal: string,
  token: string,
  replace: false
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
      portal,
      token
    );
    // extend current object witn updated object
    payload = { ...currentResource, ...resource.data };
  }
  const ro: IRequestOptions = {
    portal,
    httpMethod: "POST",
    params: {
      text: JSON.stringify(payload),
      access: resource.access,
      key: resource.key,
      token,
    },
  };
  // TODO Experiment w/ how we can make this call w/o creating a UserSession with the token
  return request(`${portal}/community/users/${username}/addResource`, ro);
}

/**
 * Gets a user resource.
 * If the resource does not exist, this will throw. This can be wrapped in `failSafe`
 * configured to return an empty object.
 * @param username
 * @param key
 * @param portal
 * @param token
 * @returns
 */
export function getUserResource(
  username: string,
  key: string,
  portal: string,
  token: string
): Promise<Record<string, any>> {
  const ro: IRequestOptions = {
    portal,
  };
  return request(
    `${portal}/community/users/${username}/resources/${key}?token=${token}`,
    ro
  );
}

/**
 * List user resources associated with
 * @param username
 * @param portal
 * @param token
 * @returns
 */
export function listUserResources(
  username: string,
  portal: string,
  token: string,
  returnAllApps?: false
): Promise<IUserResourceListResponse> {
  const ro: IRequestOptions = {
    portal,
  };
  return request(
    `${portal}/community/users/${username}/resources?token=${token}&returnAllApps=${returnAllApps}`,
    ro
  ) as Promise<IUserResourceListResponse>;
}
