/**
 * Adds slug and related properties
 */
export interface IWithSlug {
  /**
   * Slug that can be used to lookup an entity
   * by something other than it's id
   */
  slug?: string;
  /**
   * Organization urlKey used to construct the
   * slug
   */
  orgUrlKey: string;
}
