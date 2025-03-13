import {
  COLLABORATION_TYPES,
  CollaborationType,
  IEntityPermissionPolicy,
} from "../../permissions/types/IEntityPermissionPolicy";
import { CHANNEL_PERMISSIONS } from "./ChannelBusinessRules";
import {
  Role,
  AclCategory,
  AclSubCategory,
  IChannelAclPermissionDefinition,
} from "../../discussions/api/types";

const ROLE_TO_PERMISSION_MAP = {
  [Role.READ]: CHANNEL_PERMISSIONS.channelRead,
  [Role.WRITE]: CHANNEL_PERMISSIONS.channelWrite,
  [Role.READWRITE]: CHANNEL_PERMISSIONS.channelReadWrite,
  [Role.MODERATE]: CHANNEL_PERMISSIONS.channelModerate,
  [Role.MANAGE]: CHANNEL_PERMISSIONS.channelManage,
  [Role.OWNER]: CHANNEL_PERMISSIONS.channelOwner,
};

/**
 * @private
 * Transforms an IChannelAclPermission-like object to an IEntityPermissionPolicy object
 * @param channelAclPermission An IChannelAclPermission-like object
 * @returns an IEntityPermissionPolicy object
 */
export const transformAclPermissionToEntityPermissionPolicy = (
  channelAclPermission: IChannelAclPermissionDefinition & { id?: string }
): IEntityPermissionPolicy => {
  const permission = ROLE_TO_PERMISSION_MAP[channelAclPermission.role];
  let collaborationType: CollaborationType;
  if (channelAclPermission.category === AclCategory.ANONYMOUS_USER) {
    collaborationType = COLLABORATION_TYPES.anonymous;
  } else if (channelAclPermission.category === AclCategory.AUTHENTICATED_USER) {
    collaborationType = COLLABORATION_TYPES.authenticated;
  } else if (channelAclPermission.category === AclCategory.GROUP) {
    collaborationType =
      channelAclPermission.subCategory === AclSubCategory.ADMIN
        ? COLLABORATION_TYPES.groupAdmin
        : COLLABORATION_TYPES.group;
  } else if (channelAclPermission.category === AclCategory.ORG) {
    collaborationType =
      channelAclPermission.subCategory === AclSubCategory.ADMIN
        ? COLLABORATION_TYPES.orgAdmin
        : COLLABORATION_TYPES.org;
  } else {
    collaborationType = COLLABORATION_TYPES.user;
  }
  return {
    permission,
    collaborationId: channelAclPermission.key || null,
    collaborationType,
    id: channelAclPermission.id || null,
  };
};
