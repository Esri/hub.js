import { getWithDefault } from "../../objects/get-with-default";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate entityDelete policy - delegates to the
 * entity's canDelete property
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkDelete(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];

  if (Object.prototype.hasOwnProperty.call(policy, "entityDelete")) {
    let response: PolicyResponse = "granted";
    if (!entity) {
      // fail b/c no entity
      response = "entity-required";
    } else {
      if (policy.entityDelete && !entity.canDelete) {
        response = "no-delete-access";
      } else if (!policy.entityDelete && entity.canDelete) {
        response = "delete-access";
      }
    }

    const canDelete = getWithDefault(entity, "canDelete", false) as boolean;

    // create the check
    const check: IPolicyCheck = {
      name: "entity delete required",
      value: `entity.canDelete: ${canDelete.toString()}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }

  return checks;
}
