import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  IChannelAclPermission,
  IChannelAclPermissionDefinition,
  IDiscussionsUser,
  IUpdateChannel,
  Role,
} from "../types";
import { CANNOT_DISCUSS } from "./constants";
import { isOrgAdmin, userHasPrivilege } from "./platform";
import { dtoToChannel } from "./channels/channel-to-dto-map";

type PermissionsByAclCategoryMap = {
  [key in AclCategory]?: IChannelAclPermission[];
};

enum ChannelAction {
  READ_POSTS = "readPosts",
  WRITE_POSTS = "writePosts",
  MODERATE_CHANNEL = "moderateChannel",
  IS_MODERATOR = "isModerator",
  IS_MANAGER = "isManager",
  IS_OWNER = "isOwner",
}

// See confluence for privs documentation: https://confluencewikidev.esri.com/pages/viewpage.action?pageId=153747776#Roles&Privileges-ApplicationtoChannels
const CHANNEL_ACTION_PRIVS: Record<string, Role[]> = {
  // permissions
  UPDATE_OWNERS: [Role.OWNER],
  UPDATE_MANAGERS: [Role.OWNER, Role.MANAGE],
  UPDATE_MODERATORS: [Role.OWNER, Role.MANAGE],
  UPDATE_ORGS: [Role.OWNER, Role.MANAGE],
  UPDATE_GROUPS: [Role.OWNER, Role.MANAGE],
  UPDATE_USERS: [Role.OWNER, Role.MANAGE],
  UPDATE_AUTHENTICATED_USERS: [Role.OWNER, Role.MANAGE],
  UPDATE_ANONYMOUS_USERS: [Role.OWNER, Role.MANAGE],
  // settings
  UPDATE_POST_REPLIES: [Role.OWNER, Role.MANAGE, Role.MODERATE],
  UPDATE_POST_REACTIONS: [Role.OWNER, Role.MANAGE, Role.MODERATE],
  UPDATE_POST_AS_ANONYMOUS: [Role.OWNER, Role.MANAGE, Role.MODERATE],
  UPDATE_ALLOWED_REACTIONS: [Role.OWNER, Role.MANAGE, Role.MODERATE],
  UPDATE_DEFAULT_POST_STATUS: [Role.OWNER, Role.MANAGE, Role.MODERATE],
  UPDATE_BLOCKED_WORDS: [Role.OWNER, Role.MANAGE, Role.MODERATE],
  UPDATE_CHANNEL_NAME: [Role.OWNER, Role.MANAGE],
  UPDATE_SOFT_DELETE_SETTING: [Role.OWNER, Role.MANAGE],
};

/**
 * @internal
 * @hidden
 */
export class ChannelPermission {
  private readonly ALLOWED_GROUP_MEMBER_TYPES = ["owner", "admin", "member"];
  private isChannelAclEmpty: boolean;
  private existingChannel: IChannel;
  private permissionsByCategory: PermissionsByAclCategoryMap;
  private channelOrgId: string;

  constructor(channel: IChannel) {
    if (channel.channelAcl === undefined) {
      throw new Error(
        "channel.channelAcl is required for ChannelPermission checks"
      );
    }
    this.existingChannel = channel;
    this.isChannelAclEmpty = channel.channelAcl.length === 0;
    this.permissionsByCategory = {};
    this.channelOrgId = channel.orgId;

    channel.channelAcl.forEach((permission) => {
      const { category } = permission;
      this.permissionsByCategory[category]?.push(permission) ||
        (this.permissionsByCategory[category] = [permission]);
    });
  }

  canPostToChannel(user: IDiscussionsUser): boolean {
    if (this.canAnyUser(ChannelAction.WRITE_POSTS)) {
      return true;
    }

    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      this.canAnyAuthenticatedUser(ChannelAction.WRITE_POSTS) ||
      this.canSomeUser(ChannelAction.WRITE_POSTS, user) ||
      this.canSomeUserGroup(ChannelAction.WRITE_POSTS, user) ||
      this.canSomeUserOrg(ChannelAction.WRITE_POSTS, user)
    );
  }

  canCreateChannel(user: IDiscussionsUser): boolean {
    if (this.isUserUnAuthenticated(user) || this.isChannelAclEmpty) {
      return false;
    }

    return (
      this.userCanAddAnonymousToAcl(user) &&
      this.userCanAddUnauthenticatedToAcl(user) &&
      this.userCanAddAllGroupsToAcl(user) &&
      this.userCanAddAllOrgsToAcl(user) &&
      this.userCanAddUsersToAcl(user)
    );
  }

  canModerateChannel(user: IDiscussionsUser): boolean {
    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      this.canSomeUser(ChannelAction.MODERATE_CHANNEL, user) ||
      this.canSomeUserGroup(ChannelAction.MODERATE_CHANNEL, user) ||
      this.canSomeUserOrg(ChannelAction.MODERATE_CHANNEL, user)
    );
  }

  canReadChannel(user: IDiscussionsUser): boolean {
    if (this.canAnyUser(ChannelAction.READ_POSTS)) {
      return true;
    }

    if (this.isUserUnAuthenticated(user)) {
      return false;
    }

    return (
      this.canAnyAuthenticatedUser(ChannelAction.READ_POSTS) ||
      this.canSomeUser(ChannelAction.READ_POSTS, user) ||
      this.canSomeUserGroup(ChannelAction.READ_POSTS, user) ||
      this.canSomeUserOrg(ChannelAction.READ_POSTS, user)
    );
  }

  canUpdateProperties(
    user: IDiscussionsUser,
    updateData: IUpdateChannel = {}
  ): boolean {
    if (Object.keys(updateData).length === 0) {
      return true;
    }
    const userRole = this.determineUserRole(user);
    const updates = dtoToChannel(updateData);

    if (
      // settings
      (this.isChanged(updates.allowReply, this.existingChannel.allowReply) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_POST_REPLIES.includes(userRole)) ||
      (this.isChanged(
        updates.allowReaction,
        this.existingChannel.allowReaction
      ) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_POST_REACTIONS.includes(userRole)) ||
      (this.isChanged(
        updates.allowAsAnonymous,
        this.existingChannel.allowAsAnonymous
      ) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_POST_AS_ANONYMOUS.includes(userRole)) ||
      (this.isStringArrayChanged(
        updates.allowedReactions,
        this.existingChannel.allowedReactions
      ) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_ALLOWED_REACTIONS.includes(userRole)) ||
      (this.isChanged(
        updates.defaultPostStatus,
        this.existingChannel.defaultPostStatus
      ) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_DEFAULT_POST_STATUS.includes(userRole)) ||
      (this.isStringArrayChanged(
        updates.blockWords,
        this.existingChannel.blockWords
      ) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_BLOCKED_WORDS.includes(userRole)) ||
      (this.isChanged(updates.name, this.existingChannel.name) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_CHANNEL_NAME.includes(userRole)) ||
      (this.isChanged(updates.softDelete, this.existingChannel.softDelete) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_SOFT_DELETE_SETTING.includes(userRole)) ||
      // permissions
      (this.isRoleChanged(Role.OWNER, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_OWNERS.includes(userRole)) ||
      (this.isRoleChanged(Role.MANAGE, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_MANAGERS.includes(userRole)) ||
      (this.isRoleChanged(Role.MODERATE, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_MODERATORS.includes(userRole)) ||
      (this.isCategoryChanged(AclCategory.ORG, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_ORGS.includes(userRole)) ||
      (this.isCategoryChanged(AclCategory.GROUP, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_GROUPS.includes(userRole)) ||
      (this.isCategoryChanged(AclCategory.USER, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_USERS.includes(userRole)) ||
      (this.isCategoryChanged(
        AclCategory.AUTHENTICATED_USER,
        updates.channelAcl
      ) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_AUTHENTICATED_USERS.includes(userRole)) ||
      (this.isCategoryChanged(AclCategory.ANONYMOUS_USER, updates.channelAcl) &&
        !CHANNEL_ACTION_PRIVS.UPDATE_ANONYMOUS_USERS.includes(userRole))
    ) {
      return false;
    }

    return true;
  }

  private isChanged(
    updateValue: number | string | boolean | undefined,
    existingValue: number | string | boolean | undefined
  ): boolean {
    return updateValue !== undefined && updateValue !== existingValue;
  }

  private isStringArrayChanged(
    _a: string[] | null | undefined,
    _b: string[] | null | undefined
  ) {
    const a = _a ?? [];
    const b = _b ?? [];
    return (
      a.filter((x) => !b.includes(x)).length !== 0 ||
      b.filter((x) => !a.includes(x)).length !== 0
    );
  }

  private isRoleChanged(role: Role, aclUpdates?: IChannelAclPermission[]) {
    if (!aclUpdates) {
      return false;
    }
    // ex: ['org_admin_1111_owner', 'group_admin_222_owner', 'user_undefined_333_owner]
    const existing = this.existingChannel.channelAcl
      .filter((acl) => acl.role === role)
      .map((acl) => `${acl.category}_${acl.subCategory}_${acl.key}_${role}`);
    const changed = aclUpdates
      .filter((acl) => acl.role === role)
      .map((acl) => `${acl.category}_${acl.subCategory}_${acl.key}_${role}`);
    return this.isStringArrayChanged(existing, changed);
  }

  private isCategoryChanged(
    category: AclCategory,
    aclUpdates?: IChannelAclPermission[]
  ) {
    if (!aclUpdates) {
      return false;
    }
    // ex: ['org_admin_111_OWNER', 'org_member_111_readWrite', 'group_member_2222_read']
    const existing = (this.permissionsByCategory[category] ?? []).map(
      (acl) => `${category}_${acl.subCategory}_${acl.key}_${acl.role}`
    );
    const changed = aclUpdates
      .filter((acl) => acl.category === category)
      .map((acl) => `${category}_${acl.subCategory}_${acl.key}_${acl.role}`);
    return this.isStringArrayChanged(existing, changed);
  }

  private canAnyUser(action: ChannelAction): boolean {
    const anonymousUserRole =
      this.permissionsByCategory[AclCategory.ANONYMOUS_USER]?.[0].role;

    return channelActionLookup(action).includes(anonymousUserRole);
  }

  private canAnyAuthenticatedUser(action: ChannelAction): boolean {
    const role =
      this.permissionsByCategory[AclCategory.AUTHENTICATED_USER]?.[0].role;
    return channelActionLookup(action).includes(role);
  }

  private canSomeUser(action: ChannelAction, user: IDiscussionsUser) {
    const userPermissions = this.permissionsByCategory[AclCategory.USER] ?? [];
    const username = user.username;

    return userPermissions.some((permission) => {
      const { role, key } = permission;

      return key === username && channelActionLookup(action).includes(role);
    });
  }

  private canSomeUserGroup(action: ChannelAction, user: IDiscussionsUser) {
    const groupAccessControls =
      this.permissionsByCategory[AclCategory.GROUP] ?? [];

    const userGroupsById = this.mapUserGroupsById(user.groups);

    return groupAccessControls.some((permission) => {
      const group = userGroupsById[permission.key];

      if (action === ChannelAction.READ_POSTS) {
        if (!group) {
          return false;
        }
      } else {
        if (!group || !isGroupDiscussable(group)) {
          return false;
        }
      }

      return (
        doesPermissionAllowGroupMemberType(permission, group) &&
        channelActionLookup(action).includes(permission.role)
      );
    });
  }

  private canSomeUserOrg(action: ChannelAction, user: IDiscussionsUser) {
    const orgPermissions = this.permissionsByCategory[AclCategory.ORG] ?? [];

    return orgPermissions.some((permission) => {
      if (permission.key !== user.orgId) {
        return false;
      }

      return (
        doesPermissionAllowOrgRole(permission, user) &&
        channelActionLookup(action).includes(permission.role)
      );
    });
  }

  private userCanAddAnonymousToAcl(user: IDiscussionsUser) {
    if (!this.permissionsByCategory[AclCategory.ANONYMOUS_USER]) {
      return true;
    }
    return (
      isOrgAdmin(user) ||
      userHasPrivilege(user, "portal:admin:shareToPublic") ||
      userHasPrivilege(user, "portal:user:shareToPublic")
    );
  }

  private userCanAddUnauthenticatedToAcl(user: IDiscussionsUser) {
    if (!this.permissionsByCategory[AclCategory.AUTHENTICATED_USER]) {
      return true;
    }
    return (
      isOrgAdmin(user) ||
      userHasPrivilege(user, "portal:admin:shareToPublic") ||
      userHasPrivilege(user, "portal:user:shareToPublic")
    );
  }

  private userCanAddAllGroupsToAcl(user: IDiscussionsUser) {
    const groupPermissions = this.permissionsByCategory[AclCategory.GROUP];
    const userGroupsById = this.mapUserGroupsById(user.groups);

    if (!groupPermissions) {
      return true;
    }

    return groupPermissions.every((permission) => {
      const userGroup = userGroupsById[permission.key];

      return (
        userGroup &&
        this.isMemberTypeAuthorized(userGroup) &&
        isGroupDiscussable(userGroup)
      );
    });
  }

  private userCanAddAllOrgsToAcl(user: IDiscussionsUser) {
    const orgPermissions = this.permissionsByCategory[AclCategory.ORG];

    if (!orgPermissions) {
      return true;
    }

    return (
      (isOrgAdmin(user) ||
        userHasPrivilege(user, "portal:admin:shareToOrg") ||
        userHasPrivilege(user, "portal:user:shareToOrg")) &&
      this.isEveryPermissionForUserOrg(user.orgId, orgPermissions)
    );
  }

  private isEveryPermissionForUserOrg(
    userOrgId: string,
    orgPermissions: IChannelAclPermissionDefinition[]
  ) {
    return orgPermissions.every((permission) => {
      const { key: orgId } = permission;
      return userOrgId === orgId;
    });
  }

  // for now user permissions are disabled on channel create
  // since users are not notified and cannot opt out
  private userCanAddUsersToAcl(user: IDiscussionsUser) {
    const userPermissions = this.permissionsByCategory[AclCategory.USER];
    return !userPermissions;
  }

  private isUserUnAuthenticated(user: IDiscussionsUser) {
    return user.username === null || user.username === undefined;
  }

  private mapUserGroupsById(groups: IGroup[]) {
    return groups.reduce((accum, userGroup) => {
      accum[userGroup.id] = userGroup;
      return accum;
    }, {} as Record<string, IGroup>);
  }

  private isMemberTypeAuthorized(userGroup: IGroup) {
    const {
      userMembership: { memberType },
    } = userGroup;
    return this.ALLOWED_GROUP_MEMBER_TYPES.includes(memberType);
  }

  private determineUserRole(user: IDiscussionsUser): Role {
    if (this.isOwner(user)) {
      return Role.OWNER;
    } else if (this.isManager(user)) {
      return Role.MANAGE;
    } else if (this.isModerator(user)) {
      return Role.MODERATE;
    } else {
      return Role.READ;
    }
  }

  private isOwner(user: IDiscussionsUser): boolean {
    return (
      this.canSomeUser(ChannelAction.IS_OWNER, user) ||
      this.canSomeUserGroup(ChannelAction.IS_OWNER, user) ||
      this.canSomeUserOrg(ChannelAction.IS_OWNER, user)
    );
  }

  private isManager(user: IDiscussionsUser): boolean {
    return (
      this.canSomeUser(ChannelAction.IS_MANAGER, user) ||
      this.canSomeUserGroup(ChannelAction.IS_MANAGER, user) ||
      this.canSomeUserOrg(ChannelAction.IS_MANAGER, user)
    );
  }

  private isModerator(user: IDiscussionsUser): boolean {
    return (
      this.canSomeUser(ChannelAction.IS_MODERATOR, user) ||
      this.canSomeUserGroup(ChannelAction.IS_MODERATOR, user) ||
      this.canSomeUserOrg(ChannelAction.IS_MODERATOR, user)
    );
  }
}

function isGroupDiscussable(userGroup: IGroup): boolean {
  const { typeKeywords = [] } = userGroup;
  return !typeKeywords.includes(CANNOT_DISCUSS);
}

function doesPermissionAllowGroupMemberType(
  permission: IChannelAclPermission,
  group: IGroup
): boolean {
  if (
    permission.category !== AclCategory.GROUP ||
    group.userMembership.memberType === "none"
  ) {
    return false;
  }

  return (
    // group owners and admins can do anything permissioned with SubCategory "member"
    group.userMembership.memberType === "owner" ||
    group.userMembership.memberType === "admin" ||
    permission.subCategory === AclSubCategory.MEMBER
  );
}

function doesPermissionAllowOrgRole(
  permission: IChannelAclPermission,
  user: IDiscussionsUser
): boolean {
  return (
    permission.category === AclCategory.ORG &&
    (permission.subCategory === AclSubCategory.MEMBER ||
      (permission.subCategory === AclSubCategory.ADMIN && isOrgAdmin(user)))
  );
}

function channelActionLookup(action: ChannelAction): Role[] {
  if (action === ChannelAction.WRITE_POSTS) {
    return [Role.WRITE, Role.READWRITE, Role.MODERATE, Role.MANAGE, Role.OWNER];
  }

  if (action === ChannelAction.MODERATE_CHANNEL) {
    return [Role.MODERATE, Role.MANAGE, Role.OWNER];
  }

  if (action === ChannelAction.IS_MODERATOR) {
    return [Role.MODERATE];
  }

  if (action === ChannelAction.IS_MANAGER) {
    return [Role.MANAGE];
  }

  if (action === ChannelAction.IS_OWNER) {
    return [Role.OWNER];
  }

  // default to read action
  return [Role.READ, Role.READWRITE, Role.MODERATE, Role.MANAGE, Role.OWNER];
}
