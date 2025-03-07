import { IHubChannel } from "../../core/types/IHubChannel";
import { AclCategory, AclSubCategory, Role } from "../../discussions/api/types";
import { transformAclPermissionToEntityPermissionPolicy } from "./transformAclPermissionToEntityPermissionPolicy";

/**
 * @private
 * Builds a partial IHubChannel object with default values
 * @param orgId the currently authenticated user's orgId
 * @returns a partial IHubChannel object
 */
export function buildDefaultChannel(orgId: string): Partial<IHubChannel> {
  return {
    name: "",
    blockWords: [],
    allowAsAnonymous: false,
    permissions: [
      transformAclPermissionToEntityPermissionPolicy({
        category: AclCategory.ORG,
        subCategory: AclSubCategory.ADMIN,
        role: Role.MANAGE,
        key: orgId,
      }),
    ],
  };
}
