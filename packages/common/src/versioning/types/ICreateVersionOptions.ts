/**
 * Options for creating a new version of an entity
 */
export interface ICreateVersionOptions {
  /**
   * Optional name of the version
   */
  name?: string;
  /**
   * Optional parentId (the versionId of the parent version)
   */
  parentId?: string;
}
