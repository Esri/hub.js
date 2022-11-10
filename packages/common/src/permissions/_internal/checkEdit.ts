import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { getWithDefault } from "../../objects";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

export function checkEdit(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: HubEntity
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  let response: PolicyResponse = "granted";

  // Only return a check if the policy is defined
  if (policy.entityEdit) {
    if (!entity) {
      // fail b/c no entity
      response = "entity-required";
    }
    // TODO: Chance to entiti.canEdit
    if (!getWithDefault(entity, "canEdit", false)) {
      response = "no-edit-access";
    }
    // create the check
    const check: IPolicyCheck = {
      name: "entity edit required",
      value: `entity.canEdit: ${getWithDefault(entity, "canEdit", false)}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }

  return checks;
}
