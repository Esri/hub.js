import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

export function checkAuthentication(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: HubEntity
): IPolicyCheck[] {
  let response: PolicyResponse = "granted";

  // Only return a check if the policy is defined
  if (policy.authenticated && !context.isAuthenticated) {
    response = "not-authenticated";
  }

  // create the check
  const check: IPolicyCheck = {
    name: "authentication",
    value: `required: ${policy.authenticated}`,
    code: getPolicyResponseCode(response),
    response,
  };

  return [check];
}
