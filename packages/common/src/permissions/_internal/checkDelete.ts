import { IArcGISContext } from "../../ArcGISContext";
import { getWithDefault } from "../../objects";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
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

  if (policy.hasOwnProperty("entityDelete")) {
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

    // create the check
    const check: IPolicyCheck = {
      name: "entity delete required",
      value: `entity.canDelete: ${getWithDefault(entity, "canDelete", false)}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }

  return checks;
}
