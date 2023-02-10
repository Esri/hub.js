import { IVersionMetadata } from "./IVersionMetadata";

/**
 * The version of the entity.
 * This contains the metadata about the version and the versioned data itself.
 */

export interface IVersion extends IVersionMetadata {
  /**
   * The versioned data
   */
  data: Record<string, any>;
}
