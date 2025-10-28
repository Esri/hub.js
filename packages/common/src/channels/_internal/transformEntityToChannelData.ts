import { IHubChannel } from "../../core/types/IHubChannel";
import { AclCategory } from "../../discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../discussions/api/enums/aclSubCategory";
import { Role } from "../../discussions/api/enums/role";
import {
  IUpdateChannelV2,
  IChannelAclPermissionDefinition,
  ICreateChannelV2,
} from "../../discussions/api/types";
import {
  COLLABORATION_TYPES,
  CollaborationType,
  IEntityPermissionPolicy,
} from "../../permissions/types/IEntityPermissionPolicy";
import { CHANNEL_PERMISSIONS, ChannelPermission } from "./ChannelBusinessRules";

const PERMISSION_TO_ROLE_MAP: Partial<Record<ChannelPermission, Role>> = {
  [CHANNEL_PERMISSIONS.channelRead]: Role.READ,
  [CHANNEL_PERMISSIONS.channelWrite]: Role.WRITE,
  [CHANNEL_PERMISSIONS.channelReadWrite]: Role.READWRITE,
  [CHANNEL_PERMISSIONS.channelManage]: Role.MANAGE,
  [CHANNEL_PERMISSIONS.channelModerate]: Role.MODERATE,
  [CHANNEL_PERMISSIONS.channelOwner]: Role.OWNER,
};

const COLLABORATION_TYPE_TO_PERMISSION_DEFINTION_MEMBERS_MAP: Partial<
  Record<
    CollaborationType,
    { category: AclCategory; subCategory: AclSubCategory }
  >
> = {
  [COLLABORATION_TYPES.anonymous]: {
    category: AclCategory.ANONYMOUS_USER,
    subCategory: null,
  },
  [COLLABORATION_TYPES.authenticated]: {
    category: AclCategory.AUTHENTICATED_USER,
    subCategory: null,
  },
  [COLLABORATION_TYPES.group]: {
    category: AclCategory.GROUP,
    subCategory: AclSubCategory.MEMBER,
  },
  [COLLABORATION_TYPES.groupAdmin]: {
    category: AclCategory.GROUP,
    subCategory: AclSubCategory.ADMIN,
  },
  [COLLABORATION_TYPES.org]: {
    category: AclCategory.ORG,
    subCategory: AclSubCategory.MEMBER,
  },
  [COLLABORATION_TYPES.orgAdmin]: {
    category: AclCategory.ORG,
    subCategory: AclSubCategory.ADMIN,
  },
  [COLLABORATION_TYPES.owner]: {
    category: AclCategory.USER,
    subCategory: null,
  },
  [COLLABORATION_TYPES.user]: {
    category: AclCategory.USER,
    subCategory: null,
  },
};

/**
 * @private
 * Transforms an IHubChannel entity pojo object to an object that can be passed V2 channel create and update methods
 * @param entity an IHubChannel object
 * @returns an object that can be passed to V2 channel create and update methods
 */
export function transformEntityToChannelData<
  T extends ICreateChannelV2 | IUpdateChannelV2
>(entity: IHubChannel): T {
  function toChannelAclDefinition(
    acc: IChannelAclPermissionDefinition[],
    permissionPolicy: IEntityPermissionPolicy
  ): IChannelAclPermissionDefinition[] {
    const permissionDefinition =
      COLLABORATION_TYPE_TO_PERMISSION_DEFINTION_MEMBERS_MAP[
        permissionPolicy.collaborationType
      ];
    return permissionDefinition
      ? [
          ...acc,
          {
            // TODO: tack `id` on once the API is ready
            ...permissionDefinition,
            key: permissionPolicy.collaborationId || null,
            role: PERMISSION_TO_ROLE_MAP[
              permissionPolicy.permission as ChannelPermission
            ],
          },
        ]
      : acc;
  }
  return {
    name: entity.name,
    blockWords: entity.blockWords,
    allowAsAnonymous: entity.allowAsAnonymous,
    channelAclDefinition: entity.permissions.reduce(toChannelAclDefinition, []),
  } as T;
}
