import {
  ICreateVersionOptions,
  IVersion,
  IVersionMetadata,
} from "../../versioning";

/*
  TODO:
    - the property mapper does not have layout...
    - test the classes???
    - take a good look at the implementation
    - tests
    - jsdoc comments
    - guide / readme
    - update the UML/Class model lucid, add that into the Architecture section and link out to the Hub.js API docs for the interfaces (vs the code blocks) as that will be auto-maintained
    - what about pages?
    - test in poc app
      - [X] search
      - [X] get
      - [X] create
      - [X] update
      - [X] delete
*/

/**
 * Composable behavior that adds versioning to an entity
 */
export interface IWithVersioningBehavior {
  searchVersions(): Promise<IVersionMetadata[]>;

  getVersion(versionId: string): Promise<IVersion>;

  createVersion(options: ICreateVersionOptions): Promise<IVersion>;

  updateVersion(version: IVersion): Promise<IVersion>;

  deleteVersion(versionId: string): Promise<{ success: boolean }>;
}
