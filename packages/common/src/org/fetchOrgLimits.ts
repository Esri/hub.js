import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { request } from "@esri/arcgis-rest-request";

export type OrgLimitType =
  | "ScheduleTask"
  | "Collaboration"
  | "Community"
  | "Groups"
  | "Content";

/**
 * Definiton of the org limits response.
 */
export interface IOrgLimit {
  /**
   * Preset limit types
   */
  type: OrgLimitType;
  /**
   * Not constrained as there are too many to list
   */
  name: string;
  /**
   * value of the limit
   */
  limitValue: number;
}

/**
 * Generic function to fetch org limits
 * @param orgId
 * @param limitsType
 * @param limitName
 * @param options
 * @returns
 */
export function fetchOrgLimits(
  orgId: string,
  limitsType: OrgLimitType,
  limitName: string,
  options: IUserRequestOptions
): Promise<IOrgLimit> {
  const portal = options.authentication.portal;
  const url = `${portal}/portals/${orgId}/limits?limitsType=${limitsType}&limitName=${limitName}&f=json`;
  return request(url, options);
}

/**
 * Fetch the maximum number of groups a user can create in an org
 * @param orgId
 * @param options
 * @returns
 */
export function fetchMaxNumUserGroupsLimit(
  orgId: string,
  options: IUserRequestOptions
): Promise<number> {
  return fetchOrgLimits(orgId, "Groups", "MaxNumUserGroups", options)
    .then((response) => {
      return response.limitValue;
    })
    .catch((_) => {
      // it's possible that the org doesn't have this property set, and
      // the api will return a 500 error. So we just return the default value
      return 512;
    });
}
