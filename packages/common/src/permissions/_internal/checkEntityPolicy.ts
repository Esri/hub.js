import { IArcGISContext } from "../../ArcGISContext";
import { getProp, getWithDefault } from "../../objects";
import {
  IPolicyCheck,
  PolicyResponse,
  IEntityPermissionPolicy,
} from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";
import { IGroup, IUser } from "@esri/arcgis-rest-portal";

/**
 * Validate user meets entity policy
 * @param policy
 * @param context
 * @returns
 */
export function checkEntityPolicy(
  policy: IEntityPermissionPolicy,
  context: IArcGISContext
): IPolicyCheck {
  const user = context.currentUser || ({ groups: [] } as IUser);
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
    const memberType = getProp(group, "userMembership.memberType");
    if (["admin", "owner"].includes(memberType)) {
      response = "granted";
    } else {
      response = "not-group-admin";
    }
  }

  if (type === "authenticated") {
    if (context.isAuthenticated) {
      response = "granted";
    } else {
      response = "not-authenticated";
    }
  }

  if (type === "anonymous") {
    response = "granted";
  }

  const check: IPolicyCheck = {
    name: "entity:policy",
    value: `${policy.collaborationType}:${policy.collaborationId}`,
    response,
    code: getPolicyResponseCode(response),
  };
  return check;
}
