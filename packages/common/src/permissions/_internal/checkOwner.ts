import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate entityOwner policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkOwner(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  // if (policy.entityOwner) {
  //   let response: PolicyResponse = "granted";
  //   let name = "entity owner required";
  //   if (!entity) {
  //     // fail b/c no entity
  //     response = "entity-required";
  //   } else {
  //     name = `entity owner required: ${entity.owner}`;
  //     if (entity.owner !== context.currentUser.username) {
  //       response = "not-owner";
  //     }
  //   }

  //   // create the check
  //   const check: IPolicyCheck = {
  //     name,
  //     value: `current user: ${context.currentUser.username}`,
  //     code: getPolicyResponseCode(response),
  //     response,
  //   };
  //   checks.push(check);
  // }

  return checks;
}
