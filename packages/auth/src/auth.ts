/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Checks to see if login information is already stored in a cookie.
 * @returns A Promise that will resolve with the domains associated with the site.
 */
export function login(): string {
  return "yes!";
}
