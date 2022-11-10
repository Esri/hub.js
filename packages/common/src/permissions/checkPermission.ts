import { IArcGISContext } from "../ArcGISContext";
import { HubEntity, IEntityPermissionPolicy } from "../core";
import { getProp, getWithDefault } from "../objects";
import { checkLicense } from "./_internal/checkLicense";
import { getPermissionPolicy } from "./HubPermissionPolicies";
import {
  IAccessResponse,
  Permission,
  isPermission,
  IPolicyCheck,
  IPermissionPolicy,
  PolicyResponse,
} from "./types";
import { getPolicyResponseCode } from "./_internal/getPolicyResponseCode";
import { checkAuthentication } from "./_internal/checkAuthentication";
import { checkOwner } from "./_internal/checkOwner";
import { checkEdit } from "./_internal/checkEdit";
import { checkPrivileges } from "./_internal/checkPrivileges";
import { IGroup } from "@esri/arcgis-rest-portal";

export function checkPermission(
  permission: Permission,
  context: IArcGISContext,
  entity?: HubEntity
): IAccessResponse {
  // Early Exit: Is this even a valid permission?
  if (!isPermission(permission)) {
    return {
      permission,
      access: false,
      response: "invalid-permission",
      code: getPolicyResponseCode("invalid-permission"),
      checks: [],
    } as IAccessResponse;
  }

  // Get the system policy for this permission
  const systemPolicy = getPermissionPolicy(permission);

  // Default to granted
  const response: IAccessResponse = {
    permission,
    access: false,
    response: "granted",
    code: getPolicyResponseCode("granted"),
    checks: [],
  };

  // reduce over the check functions and collect all the checks
  const checks = [
    checkAuthentication,
    checkLicense,
    checkPrivileges,
    checkEdit,
    checkOwner,
  ].reduce((acc: IPolicyCheck[], fn) => {
    acc = [...acc, ...fn(systemPolicy, context)];
    return acc;
  }, []);

  // For system policies, all conditions must be met, so we can
  // iterate through the checks and set the response to the first failure
  // while still returning all the checks for observability
  checks.forEach((check) => {
    if (check.response !== "granted" && response.response === "granted") {
      response.response = check.response;
      response.code = check.code;
      response.access = false;
    }
  });

  response.checks = checks;

  // Entity policies are treated as "grants" so we only need to pass one
  if (entity) {
    const entityPolicies: IEntityPermissionPolicy[] = getWithDefault(
      entity,
      "policies",
      []
    );
    const entityPermissionPolicies =
      entityPolicies.filter((e) => e.permission === permission) || [];
    // Entity Policies are "grants" in that only one needs to pass
    // but we still want each check returned so we can see why they
    // got access or got denied
    const entityChecks = entityPermissionPolicies.map((policy) => {
      return checkEntityPolicy(policy, context);
    });
    // Process them to see if any grant access
    const grantedCheck = entityChecks.find((e) => e.response === "granted");
    // If we did not find a check that grants access, AND we've passed
    // all the system checks, then we set the response to "not-granted"
    // and set the access to false
    if (
      entityChecks.length &&
      !grantedCheck &&
      response.response === "granted"
    ) {
      response.access = false;
      response.response = "not-granted";
    }
    // Merge in the entity checks...
    response.checks = [...response.checks, ...entityChecks];
  }
  // return the response
  return response;
}

export function checkEntityPolicy(
  policy: IEntityPermissionPolicy,
  context: IArcGISContext
): IPolicyCheck {
  const user = context.currentUser;
  const userGroups = user.groups || ([] as IGroup[]);
  let response: PolicyResponse = "not-granted";
  const type = policy.collaborationType;
  const id = policy.collaborationId;

  if (type === "user") {
    if (id === user.username) {
      response = "granted";
    } else {
      response = "not-granted";
    }
  }

  if (type === "org") {
    if (id === user.orgId) {
      response = "granted";
    } else {
      response = "not-org-member";
    }
  }

  if (type === "group") {
    if (userGroups.find((g: IGroup) => g.id === id)) {
      response = "granted";
    } else {
      response = "not-group-member";
    }
  }

  if (type === "group-admin") {
    const group = userGroups.find((g: IGroup) => g.id === id);
    if (getProp(group, "userMembership.memberType") === "admin") {
      response = "granted";
    } else {
      response = "not-group-admin";
    }
  }

  const check: IPolicyCheck = {
    name: "entity:policy",
    value: `${policy.collaborationType}:${policy.collaborationId}`,
    response,
    code: getPolicyResponseCode(response),
  };
  return check;
}
