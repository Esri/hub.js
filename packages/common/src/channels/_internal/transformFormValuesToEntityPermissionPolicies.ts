import {
  COLLABORATION_TYPES,
  IEntityPermissionPolicy,
} from "../../permissions/types";
import { ChannelNonePermission } from "./ChannelBusinessRules";
import { IHubRoleConfigValue } from "./transformEntityPermissionPoliciesToFormValues";

/**
 * @private
 * Transforms an array of IHubRoleConfigValue objects into an array of IEntityPermissionPolicy objects
 * @param roleConfigs an array of IHubRoleConfigValue objects
 * @returns an array of IEntityPermissionPolicy objects
 */
export function transformFormValuesToEntityPermissionPolicies(
  roleConfigs: IHubRoleConfigValue[]
): IEntityPermissionPolicy[] {
  return roleConfigs.reduce((acc, roleConfiguration) => {
    return Object.entries(roleConfiguration.roles).reduce(
      (memo, [roleKey, role]) => {
        if (role.value === ChannelNonePermission) {
          return memo;
        }

        let permissionPolicy: Pick<
          IEntityPermissionPolicy,
          "collaborationType" | "collaborationId"
        >;

        if (roleConfiguration.key === "public") {
          permissionPolicy = {
            collaborationType:
              roleKey === "authenticated"
                ? COLLABORATION_TYPES.authenticated
                : COLLABORATION_TYPES.anonymous,
            collaborationId: null,
          };
        } else if (roleConfiguration.entityType === "group") {
          permissionPolicy = {
            collaborationType:
              roleKey === "admin"
                ? COLLABORATION_TYPES.groupAdmin
                : COLLABORATION_TYPES.group,
            collaborationId: roleConfiguration.entityId,
          };
        } else if (roleConfiguration.entityType === "organization") {
          permissionPolicy = {
            collaborationType:
              roleKey === "admin"
                ? COLLABORATION_TYPES.orgAdmin
                : COLLABORATION_TYPES.org,
            collaborationId: roleConfiguration.entityId,
          };
        } else if (roleConfiguration.entityType === "user") {
          permissionPolicy = {
            collaborationType: COLLABORATION_TYPES.user,
            collaborationId: roleConfiguration.entityId,
          };
        }
        return permissionPolicy
          ? [
              ...memo,
              {
                ...permissionPolicy,
                permission: role.value,
                id: role.id,
              },
            ]
          : memo;
      },
      acc
    );
  }, []);
}
