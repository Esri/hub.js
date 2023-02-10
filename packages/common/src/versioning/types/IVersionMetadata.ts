/**
 * Metadata pertaining to the version
 * This is what we get back when we search for versions of an entity.
 */
export interface IVersionMetadata {
  /**
   * The access level of the version resource
   */
  access?: string;
  /**
   * The created timestamp
   */
  created: number;
  /**
   * The username of the creator
   */
  creator: string;
  /**
   * The id of the version
   */
  id: string;
  /**
   * The name of the version
   */
  name?: string;
  /**
   * The parent version id
   */
  parent?: string;
  /**
   * The full path to the version
   */
  path: string;
  /**
   * The size of the version resource
   */
  size?: number;
  /**
   * The updated timestamp
   */
  updated: number;
}
