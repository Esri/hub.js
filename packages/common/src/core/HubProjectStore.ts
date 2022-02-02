import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  createProject,
  updateProject,
  destroyProject,
  getProject,
} from "./modules/HubProjects";
import {
  ArcGISContextManager,
  Filter,
  IHubSearchOptions,
  ISearchResponse,
} from "..";
import { IHubProject, IHubEntityStore } from "./types";

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
      // THROW Not Authenticated Error
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
      // THROW Not Authenticated Error
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
      // THROW Not Authenticated Error
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
      // THROW bad configuration error
      // Portal
    }
  }

  /**
   * Search for Projects
   *
   * @param filter
   * @param opts
   */
  async search(
    filter: Filter<"content">,
    opts: IHubSearchOptions
  ): Promise<ISearchResponse<IHubProject>> {
    throw new Error("Search not implemented");
  }
}
