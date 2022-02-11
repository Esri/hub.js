import { IHubImage } from "../types/IHubImage";

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
   * Organization information used to construct the
   * slug
   */
  org?: {
    id: string;
    // NOTE: we'd like to make urlKey required b/c it's needed for slug,
    // but it's not defined on IPortal, which is what we actually assign to org
    urlKey?: string;
  };
}
