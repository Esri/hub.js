/**
 * Simple interface for Links
 */
export interface ILink {
  /**
   * Link url
   */
  href: string;
  /**
   * Additional optional properties
   */
  [key: string]: string;
}

/**
 * Interface for entity links
 */
export interface IHubEntityLinks {
  /**
   * Url to Thumbnail. May not include a token
   * TODO: Why should we not include the token?
   */
  thumbnail?: string;
  /**
   * Url to the entities canonical "self"
   * For Items/Groups/Users, this will be the Home App url
   * For other entities, it will be the canonical url
   */
  self: string;
  /**
   * Relative url of the entity, within a site
   */
  siteRelative?: string;
  /**
   * Relative workspace url of the entity, within a site
   */
  workspaceRelative?: string;
  /**
   * Relative url to the entity's layout editing experience
   */
  layoutRelative?: string;
  /**
   * Additional urls
   */
  [key: string]: string | ILink;
}

/**
 * Base properties for Hub Entities
 * This includes a subset of `IItem`, that can apply to
 * models that are not backed by items. It also includes
 * properties that can be derived for all entity types,
 * such as `links`
 */
export interface IHubEntityBase {
  /**
   * Id of the entity as a string
   */
  id: string;
  /**
   * Name of the Entity
   * For Entities backed by items, this is typically the title
   */
  name: string;
  /**
   * Sanitized summary derived from item.snippet, item.description,
   * group.description, user.description, event.description etc
   */
  summary?: string;
  /**
   * Date the entity was created
   */
  createdDate: Date;
  /**
   * Source of the creation date as a property path
   * e.q `item.created`
   */
  createdDateSource: string;
  /**
   * Date when the entity was last updated
   * Depending on the entity, this could be derived
   * in many different ways
   */
  updatedDate: Date;
  /**
   * Source of the updated date
   */
  updatedDateSource: string;
  /**
   * For Item backed results, this will be `item.type`
   * Otherwise it will be "Group", "User", "Event" etc
   */
  type: string;
  /**
   * Source of the entity.
   * Exact logic for this tbd, but the intent is to allow the
   * result to be attributed to something other than "owner"
   */
  source?: string;

  /**
   * Links to related things
   */
  links?: IHubEntityLinks;
}
