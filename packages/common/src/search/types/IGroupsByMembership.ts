/**
 * Arrays of groupId's, based on the user's membership in the group
 */

export interface IGroupsByMembership {
  /**
   * Groups where the user is the owner, allowing them
   * to add / remove members, as well as share content
   * they do not own
   */
  owner: string[];
  /**
   * Groups where the user is an admin, allowing them
   * to add / remove members, as well as share content
   * they do not own
   */
  admin: string[];
  /**
   * Groups where the user is a member. ViewOnly groups
   * will not be included in this list.
   */
  member: string[];
}
