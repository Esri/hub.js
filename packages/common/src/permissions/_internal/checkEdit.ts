import { IArcGISContext } from "../../ArcGISContext";
import { getWithDefault } from "../../objects";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate entityEdit policy
 * @param policy
 * @param context
 * @param _entity
 * @returns
 */
export function checkEdit(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];

  // Only return a check if the policy is defined
  if (policy.hasOwnProperty("entityEdit")) {
    let response: PolicyResponse = "granted";
    if (!_entity) {
      // fail b/c no entity
      response = "entity-required";
    } else {
      if (policy.entityEdit && !_entity.canEdit) {
        response = "no-edit-access";
      } else if (!policy.entityEdit && _entity.canEdit) {
        response = "edit-access";
      }
    }

    // create the check
    const check: IPolicyCheck = {
      name: "entity edit required",
      value: `entity.canEdit: ${getWithDefault(_entity, "canEdit", false)}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }

  return checks;
}
