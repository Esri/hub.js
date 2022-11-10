import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

export function checkOwner(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: HubEntity
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  let response: PolicyResponse = "granted";

  // Only return a check if the policy is defined
  if (policy.entityOwner) {
    if (!entity) {
      // fail b/c no entity
      response = "entity-required";
    }
    // TODO: Chance to entiti.canEdit
    if (entity && entity.owner !== context.currentUser.username) {
      response = "not-owner";
    }
    // create the check
    const check: IPolicyCheck = {
      name: "entity:owner",
      value: `entity:${entity.owner}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }

  return checks;
}
