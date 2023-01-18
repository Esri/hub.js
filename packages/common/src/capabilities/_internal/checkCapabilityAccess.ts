import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { checkPermission, IPermissionAccessResponse } from "../../permissions";
import { ICapabilityAccessResponse, ICapabilityPermission } from "../types";

/**
 * Check an individual capability access rule
 * @param rule
 * @param context
 * @param entity
 * @returns
 */
export function checkCapabilityAccess(
  rule: ICapabilityPermission,
  context: IArcGISContext,
  entity: HubEntity
): ICapabilityAccessResponse {
  // check if the capability is disabled for the entity; we default to false
  const value = entity.capabilities[rule.capability] || false;
  // if disabled, then access is denied
  if (!value) {
    return {
      capability: rule.capability,
      access: false,
      code: "disabled",
      response: "not-available",
      message: `Owner ${entity.owner} has disabled ${rule.capability} capability.`,
      responses: [],
    };
  } else {
    // check each permission in the rule
    const chks = rule.permissions.map((permission) => {
      return checkPermission(permission, context, entity);
    });
    // default to last check
    let accessCheck: IPermissionAccessResponse = chks[chks.length - 1];
    // if all checks are true, then access is granted
    const access = chks.every((chk) => chk.access);

    if (!access) {
      // get the first failed check and use it's values in the response
      accessCheck = chks.find((chk) => !chk.access);
    }
    // construct the response
    return {
      capability: rule.capability,
      access: accessCheck.access,
      code: accessCheck.code,
      response: accessCheck.response,
      message: accessCheck.message,
      responses: chks,
    };
  }
}
