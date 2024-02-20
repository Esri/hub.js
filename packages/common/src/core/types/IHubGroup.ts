import { IWithDiscussions, IWithPermissions } from "../traits";
import { IHubEntityBase } from "./IHubEntityBase";
import {
  GroupSortField,
  MemberType,
  MembershipAccess,
  PlatformSortOrder,
  AccessLevel,
} from "./types";

/**
 * Defines the properties of a Hub Group object
 * @internal
 */
export interface IHubGroup
  extends IHubEntityBase,
    IWithPermissions,
    IWithDiscussions {
  /**
   * Access level of the group
   * ("private" | "org" | "public")
   * we are using AccessLevel instead of SettableAccessLevel
   * intentionally due to the Portal API being inconsistent
   * between .access on items vs groups
   */
  access: AccessLevel;

  /**
   * Whether members can auto join the group
   */
  autoJoin?: boolean;

  /**
   * Whether the user can edit the group, only owners and admins can
   */
  canEdit: boolean;

  /**
   * Whether the user can delete the group, only owners and admins can
   */
  canDelete: boolean;

  /**
   * Description for the group
   */
  description?: string;

  /**
   * Whether the group is editable
   */
  isSharedUpdate: boolean;

  /**
   * Whether the group accepts members through invitations only
   */
  isInvitationOnly: boolean;

  /**
   * Whether discussions are enabled or disabled
   */
  isDiscussable: boolean;

  /**
   * Whether the group is for read only or not
   */
  isReadOnly: boolean;

  /**
   * Whether the group is for view only or not
   */
  isViewOnly: boolean;

  /**
   * Who can join the groups
   * (organization, collaborators, anyone)
   */
  membershipAccess?: MembershipAccess;

  /**
   * Username of the owner of the group
   */
  owner?: string;

  /**
   * Whether the group is protected or not
   * the group cannot be deleted if protected
   */
  protected: boolean;

  /**
   * Sort field for the Group
   */
  sortField?: GroupSortField;

  /**
   * Sort order for the Group
   */
  sortOrder?: PlatformSortOrder;

  /**
   * User configurable tags
   */
  tags?: string[];

  /**
   * System configurable typekeywords
   */
  typeKeywords?: string[];

  /**
   * Group thumbnail url (read-only)
   */
  thumbnail?: string;

  /**
   * Group thumbnail url (read-only)
   */
  thumbnailUrl?: string;

  /**
   * Member types of the group
   * ("owner" | "admin" | "member" | "none")
   */
  memberType?: MemberType;

  /**
   * Whether there is a field we are trying to clear,
   * if true, we need to send clearEmptyFields: true
   * to the updateGroup call
   */
  _clearEmptyFields?: boolean;

  /** Whether members of the group are hidden */
  hiddenMembers?: boolean;
}

/**
 * This type redefines the IHubGroup interface in such a way
 * that it can be consumed by the entity editor.
 */
export type IHubGroupEditor = IHubGroup & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
};
