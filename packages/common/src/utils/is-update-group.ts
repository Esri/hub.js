/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroup } from "@esri/arcgis-rest-types";

/**
 * Determines if a given IGroup is an update group
 * @param {IGroup} group The group to evaluate
 */
export const isUpdateGroup = (
  group: IGroup
): boolean => group.capabilities.indexOf("updateitemcontrol") > -1;
