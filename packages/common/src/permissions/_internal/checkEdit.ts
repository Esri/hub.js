import { getWithDefault } from "../../objects/get-with-default";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate entityEdit policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkEdit(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];

  // Only return a check if the policy is defined
  if (Object.prototype.hasOwnProperty.call(policy, "entityEdit")) {
    let response: PolicyResponse = "granted";
    if (!entity) {
      // fail b/c no entity
      response = "entity-required";
    } else {
      if (policy.entityEdit && !entity.canEdit) {
        response = "no-edit-access";
      } else if (!policy.entityEdit && entity.canEdit) {
        response = "edit-access";
      }
    }
    const canEdit = getWithDefault(entity, "canEdit", false) as boolean;

    // create the check
    const check: IPolicyCheck = {
      name: "entity edit required",
      value: `entity.canEdit: ${canEdit.toString()}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }

  return checks;
}
