import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

export function checkPrivileges(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: HubEntity
): IPolicyCheck[] {
  const privs = policy.privileges || [];

  const checks = privs.map((privilege) => {
    let response: PolicyResponse = "granted";
    if (!context.currentUser.privileges.includes(privilege)) {
      response = "privilege-required";
    }
    return {
      name: "platform:privilege",
      value: privilege,
      response,
      code: getPolicyResponseCode(response),
    } as IPolicyCheck;
  });
  return checks;
}
