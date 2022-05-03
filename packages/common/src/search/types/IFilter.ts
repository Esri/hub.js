import { IMatchOptions, IDateRange, IRelativeDate } from "./types";

/**
 * Filter with properties for well-known filterable fields, across all searchable entities - items, users, groups, events.
 * Fields which do not apply to a given type are simply ignored.
 *
 * Used with `IFilterGroup` to construct complex queries or on it's own for simpler queries.
 */
export interface IFilter {
  /**
   * Applies to Item and Group
   */
  access?: string | string[] | IMatchOptions;
  /**
   * Applies to Item, Group and User
   */
  created?: IDateRange<number> | IRelativeDate;
  /**
   * Applies to Item and Group
   */
  description?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  disabled?: boolean;
  /**
   * Applies to User
   */
  email?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  firstname?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  fullname?: string | string[] | IMatchOptions;
  /**
   * Applies to Item
   */
  group?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  groups?: string | string[] | IMatchOptions;
  /**
   * Applies to Item and Group
   */
  id?: string | string[] | IMatchOptions;
  /**
   * Applies to Group
   */
  isInvitationOnly?: boolean;
  /**
   * Applies to User
   */
  lastlogin?: IDateRange<number> | IRelativeDate;
  /**
   * Applies to User
   */
  lastname?: string | string[] | IMatchOptions;
  /**
   * Applies to Item
   */
  modified?: IDateRange<number> | IRelativeDate;
  /**
   * Applies to Item, Group and User
   */
  orgid?: string | string[] | IMatchOptions;
  /**
   * Applies to Item
   */
  owner?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  role?: string | string[] | IMatchOptions;
  /**
   * Applies to Group
   */
  searchUserAccess?: "groupMember";
  /**
   * Applies to Item
   */
  snippet?: string | string[] | IMatchOptions;
  /**
   * Applies to Item and Group
   */
  tags?: string | string[] | IMatchOptions;
  /**
   * Search term, such as "Water" or "Land Base"
   * Applies to all types
   */
  term?: string;
  /**
   * Applies to all types
   */
  title?: string | string[] | IMatchOptions;
  /**
   * Applies to Items and Groups
   */
  typekeywords?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  userlicensetype?: string | string[] | IMatchOptions;
  /**
   * Applies to User
   */
  username?: string | string[] | IMatchOptions;
  // TODO: re-implement type specific expansions
  /**
   * Applies to Item
   */
  type?: string | string[] | IMatchOptions;
  // | NamedContentFilter
  // | Array<string | NamedContentFilter>

  // this allows arbitrary keys; Future use
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
