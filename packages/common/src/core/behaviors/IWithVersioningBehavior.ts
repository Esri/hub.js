import {
  ICreateVersionOptions,
  IVersion,
  IVersionMetadata,
} from "../../versioning";

/*
  TODO:
    - tests
    - manual test again
    - guide / readme
    - update the UML/Class model lucid, add that into the Architecture section and link out to the Hub.js API docs for the interfaces (vs the code blocks) as that will be auto-maintained
    - do class instance methods make sense?
      - do we need applyVersion?
      - when we do updateVersion, what it means is update this version with what is in our class instance...
      - maybe getVersion should return the site instance with the version applied
    - take a good look at the implementation
      - updateVersion should check if the one upstream is newer?
    - what about pages? - later...
*/

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
