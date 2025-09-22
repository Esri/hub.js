import { IModel } from "../hub-types";
import { cloneObject } from "../util";
import { AccessLevel } from "../core";

/**
 * Log a comparison of access1 vs access2 (private < shared < org < public)
 * @param access1 access level 1
 * @param access2 access level 2
 * @returns true if access1 exceeds access2
 */
export function logAccessComparison(
  access1: AccessLevel,
  access2: AccessLevel
): boolean {
  const order: AccessLevel[] = ["private", "shared", "org", "public"];
  const rank = (lvl: AccessLevel): number => order.indexOf(lvl);
  return rank(access1) > rank(access2);
}

/**
 * Ensure assistant access does not exceed site access.
 * If assistant is more permissive, it is downgraded to private.
 * @param model model
 * @param siteAccess Siteaccess level
 * @returns Updated (cloned) model
 */
export function updateHubAssistantAccessLevel(
  model: IModel,
  siteAccess: AccessLevel
): IModel {
  const updatedModel = cloneObject(model);
  if (!updatedModel.data.assistant) return updatedModel;

  const assistantAccess = updatedModel.data.assistant.access as AccessLevel;

  // if assistant access exceeds site access, downgrade to private
  if (logAccessComparison(assistantAccess, siteAccess)) {
    updatedModel.data.assistant.access = "private";
  }

  return updatedModel;
}
