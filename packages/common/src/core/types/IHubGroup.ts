import { IWithPermissions } from "../traits";
import { IHubEntityBase } from "./IHubEntityBase";
import {
  GroupSortField,
  SettableAccessLevel,
  MemberType,
  MembershipAccess,
  PlatformSortOrder,
} from "./types";

/**
 * Defines the properties of a Hub Group object
 * @internal
 */
export interface IHubGroup extends IHubEntityBase, IWithPermissions {
  /**
   * Access level of the group
   * ("private" | "org" | "public")
   */
  access: SettableAccessLevel;

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
   * Whether the group is protect or not
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
}
