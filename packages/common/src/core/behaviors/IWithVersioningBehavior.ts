import {
  ICreateVersionOptions,
  IVersion,
  IVersionMetadata,
} from "../../versioning";

/**
 * Composable behavior that adds versioning to an entity
 */
export interface IWithVersioningBehavior {
  
  searchVersions(): Promise<IVersionMetadata[]>;

  getVersion(versionId: string): Promise<IVersion>;

  createVersion(options: ICreateVersionOptions): Promise<IVersion>;

  updateVersion(version: IVersion): Promise<IVersion>;

  deleteVersion(versionId: string): Promise<void>;
}
