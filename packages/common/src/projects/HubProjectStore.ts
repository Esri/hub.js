import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  createProject,
  updateProject,
  destroyProject,
  getProject,
} from "./HubProjects";
import {
  ArcGISContextManager,
  Filter,
  HubError,
  IHubSearchOptions,
  ISearchResponse,
} from "..";
import { IHubProject, IHubEntityStore } from "../core/types";

/**
 * Centralized functions used to manage IHubProject instances
 *
 * This class is a convenience wrapper over util functions which
 * are also directly accessible for use in scenarios where
 * classes are inconvenient.
 */
export class HubProjectStore implements IHubEntityStore<IHubProject> {
  /**
   * Hold a context manager, which should be a single instance for
   * an application. When authentication changes, the .context
   * property on the context manager will be replaced. As long as
   * all the fns in this class leverage properties on .context
   * everything be kept in sync.
   */
  private _contextManager: ArcGISContextManager;

  /**
   * Private so we can employ a factory function should we need
   * async work during creation
   * @param contextManager
   */
  private constructor(contextManager: ArcGISContextManager) {
    this._contextManager = contextManager;
  }

  /**
   * Factory function to construct a new HubProjectStore instance.
   *
   * Note: Used so that we could do async actions in the ctor.
   * @param contextManager
   * @returns
   */
  static create(contextManager: ArcGISContextManager): HubProjectStore {
    return new HubProjectStore(contextManager);
  }

  /**
   * Getter to abstract the context manager
   */
  private get context() {
    return this._contextManager.context;
  }

  /**
   * Create an store new project.
   *
   * Projects are stored as Items in the Sharing API
   * @param project
   * @param requestOptions
   * @returns
   */
  async create(
    project: Partial<IHubProject>,
    requestOptions?: IUserRequestOptions
  ): Promise<IHubProject> {
    if (requestOptions || this.context.isAuthenticated) {
      return createProject(
        project,
        requestOptions || this.context.userRequestOptions
      );
    } else {
      throw new HubError(
        "Create Project",
        "Creating Hub Projects requires authentication."
      );
    }
  }

  /**
   * Update a project
   * @param project
   * @param requestOptions
   * @returns
   */
  async update(
    project: IHubProject,
    requestOptions?: IUserRequestOptions
  ): Promise<IHubProject> {
    if (requestOptions || this.context.isAuthenticated) {
      return updateProject(
        project,
        requestOptions || this.context.userRequestOptions
      );
    } else {
      throw new HubError(
        "Update Project",
        "Updating Hub Projects requires authentication."
      );
    }
  }

  /**
   * Destroy a project.
   * This permanently removes the backing Item
   * @param id
   * @param requestOptions
   * @returns
   */
  async destroy(
    id: string,
    requestOptions?: IUserRequestOptions
  ): Promise<void> {
    if (requestOptions || this.context.isAuthenticated) {
      return destroyProject(
        id,
        requestOptions || this.context.userRequestOptions
      );
    } else {
      throw new HubError(
        "Destroy Project",
        "Destroying Hub Projects requires authentication."
      );
    }
  }
  /**
   * Fetch a Project via id or it's slug
   *
   * This function does not require a user to be
   * authenticated, but it does require an `IRequestOptions`
   * which contains the portal instance to communicate with
   * @param identifier
   * @param requestOptions
   * @returns
   */
  async get(
    identifier: string,
    requestOptions?: IRequestOptions
  ): Promise<IHubProject> {
    if (requestOptions || this.context.requestOptions) {
      return getProject(
        identifier,
        requestOptions || this.context.requestOptions
      );
    } else {
      throw new HubError(
        "Get Project",
        "Can not retrieve context.requestOptions from Context Manager. HubProjectStore is configured incorrectly."
      );
    }
  }

  // [WIP] Still working out how best to implement
  //
  // /**
  //  * Search for Projects
  //  *
  //  * @param filter
  //  * @param opts
  //  */
  // async search(
  //   filter: Filter<"content">,
  //   opts: IHubSearchOptions
  // ): Promise<ISearchResponse<IHubProject>> {
  //   throw new Error("Search not implemented");
  // }
}
