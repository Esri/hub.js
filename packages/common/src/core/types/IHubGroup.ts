import { IWithPermissions } from "../traits";
import { IHubEntityBase } from "./IHubEntityBase";

/**
 * Defines the properties of a Hub Group object
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubGroup extends IHubEntityBase, IWithPermissions {
  access: "private" | "org" | "public";
  autoJoin?: boolean;
  description?: string;
  isInvitationOnly?: boolean;
  isDiscussable?: boolean;
  isReadOnly?: boolean;
  isViewOnly?: boolean;
  membershipAccess?: string;
  owner?: string;
  protected: boolean;
  sortField?:
    | "title"
    | "owner"
    | "avgrating"
    | "numviews"
    | "created"
    | "modified";
  sortOrder?: "asc" | "desc";
  tags?: string[];
  thumbnail?: string;
  thumbnailUrl?: string;
  userMembership?: {
    username?: string;
    memberType?: "owner" | "admin" | "member" | "none";
    applications?: number;
  };
}
