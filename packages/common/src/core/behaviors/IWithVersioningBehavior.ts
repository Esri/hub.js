import {
  ICreateVersionOptions,
  IVersion,
  IVersionMetadata,
} from "../../versioning";

/**
 * Composable behavior that adds versioning to an entity
 */
export interface IWithVersioningBehavior {
  /**
   * Gets all the versions of the entity
   * @returns
   */
  searchVersions(): Promise<IVersionMetadata[]>;

  /**
   * Gets the specified version of the entity
   * @param versionId
   * @returns
   */
  getVersion(versionId: string): Promise<IVersion>;

  /**
   * Creates a new version of the entity
   * @param options
   * @returns
   */
  createVersion(options?: ICreateVersionOptions): Promise<IVersion>;

  /**
   * Updates the specified version of the entity
   * @param version
   * @returns
   */
  updateVersion(version: IVersion): Promise<IVersion>;

  /**
   * Deletes the specified version of the entity
   * @returns
   */
  deleteVersion(versionId: string): Promise<{ success: boolean }>;
}
