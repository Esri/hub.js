import { IHubChannel } from "../../core/types/IHubChannel";
import { AclCategory } from "../../discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../discussions/api/enums/aclSubCategory";
import { Role } from "../../discussions/api/enums/role";
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
    canEdit: true,
    canDelete: true,
    permissions: [
      transformAclPermissionToEntityPermissionPolicy({
        category: AclCategory.ORG,
        subCategory: AclSubCategory.ADMIN,
        role: Role.OWNER,
        key: orgId,
      }),
    ],
  };
}
