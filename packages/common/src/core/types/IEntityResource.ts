import { IItemResource } from "./IItemResource";

/**
 * More useful interface for entity resources.
 *
 * @export
 * @interface IEntityResource
 */
export interface IEntityResource extends IItemResource {
  /**
   * Type of resource
   *
   * @type {SolutionResourceType}
   */
  type: "image" | "thumbnail" | "other";

  /**
   * Url where this can be fetched from; Does not include token.
   *
   * @type {string}
   */
  sourceUrl: string;
}
