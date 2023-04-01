/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroup } from "@esri/arcgis-rest-portal";

/**
 * Determines if a given IGroup is an update group
 * @param {IGroup} group The group to evaluate
 */
export function isUpdateGroup(group: IGroup): boolean {
  return group.capabilities.includes("updateitemcontrol");
}
