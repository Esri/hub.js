import { IArcGISContext } from "../../ArcGISContext";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate privilege policy
 * @param policy
 * @param context
 * @param _entity
 * @returns
 */
export function checkPrivileges(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.privileges?.length) {
    checks = policy.privileges.map((privilege) => {
      let response: PolicyResponse = "granted";
      let value = "privilege present";
      if (!context.isAuthenticated) {
        response = "not-authenticated";
        value = "not authenticated";
      } else if (!context.currentUser.privileges.includes(privilege)) {
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
  }

  return checks;
}
