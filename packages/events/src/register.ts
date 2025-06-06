/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { joinGroup, leaveGroup } from "@esri/arcgis-rest-portal";

export interface IEventRegisterOptions extends IUserRequestOptions {
  /**
   * Identifier for the group associated with the ArcGIS Hub event.
   */
  groupId: string;
}
/**
 * ```js
 * import { registerForEvent } from "@esri/hub-events";
 * //
 * registerForEvent({
 *   groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Register for an ArcGIS Hub event.
 * @param requestOptions - request options that include authentication
 * @returns A Promise that will resolve with the response from the service.
 */
export function registerForEvent(
  requestOptions: IEventRegisterOptions
): Promise<{ success: boolean; groupId: string }> {
  return joinGroup({
    id: requestOptions.groupId,
    authentication: requestOptions.authentication,
  });
}

/**
 * ```js
 * import { unregisterForEvent } from "@esri/hub-events";
 * //
 * unregisterForEvent({
 *   groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Unregister for an ArcGIS Hub event.
 * @param requestOptions - request options that include authentication
 * @returns A Promise that will resolve with the response from the service.
 */
export function unregisterForEvent(
  requestOptions: IEventRegisterOptions
): Promise<{ success: boolean; groupId: string }> {
  return leaveGroup({
    id: requestOptions.groupId,
    authentication: requestOptions.authentication,
  });
}
