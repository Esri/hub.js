import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate privilege policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkPrivileges(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const privs = policy.privileges || [];

  const checks = privs.map((privilege) => {
    let response: PolicyResponse = "granted";
    let value = "privilege present";
    if (!context.currentUser.privileges.includes(privilege)) {
      response = "privilege-required";
      value = "privilege missing";
    }
    return {
      name: `privilege required: ${privilege}`,
      value,
      response,
      code: getPolicyResponseCode(response),
    } as IPolicyCheck;
  });
  return checks;
}
