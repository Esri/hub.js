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
  // TODO: indicate which ones are read only in comments
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
   * Description for the group
   */
  description?: string;

  /**
   * Whether the group is editable
   * READ ONLY
   */
  isSharedUpdate: boolean;

  /**
   * Whether the group accepts members through invitations only
   * READ ONLY???
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
   * do we need this prop??
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
   * Member types of the group (read-only)
   * ("owner" | "admin" | "member" | "none")
   */
  memberType?: MemberType;

  /**
   * Whether there is a field we are trying to clear,
   * if true, we need to send clearEmptyFields: true
   * to the updateGroup call
   * READ ONLY
   */
  _clearEmptyFields?: boolean;
}
