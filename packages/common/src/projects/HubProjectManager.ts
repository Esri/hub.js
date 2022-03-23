import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  createProject,
  updateProject,
  destroyProject,
  fetchProject,
  searchProjects,
  convertItemToProject,
} from "./HubProjects";
// Node has issues if this is not directly imported
import { ArcGISContextManager } from "../ArcGISContextManager";
import {
  Filter,
  HubError,
  IArcGISContext,
  IHubSearchOptions,
  ISearchResponse,
} from "..";
import { IHubEntityManager, IHubProject } from "../core/types";
import { IHubItemEntityManager } from "../core/types/IHubItemEntityManager";
import { setItemThumbnail as updateItemThumbnail } from "../items/setItemThumbnail";
import { IItem } from "@esri/arcgis-rest-types";

/**
 * Centralized functions used to manage IHubProject instances
 *
 * This class is a convenience wrapper over util functions which
 * are also directly accessible for use in scenarios where
 * classes are inconvenient.
 */
export class HubProjectManager
  implements IHubEntityManager<IHubProject>, IHubItemEntityManager<IHubProject>
{
  /**
   * Hold a context manager, which should be a single instance for
   * an application. When authentication changes, the .context
   * property on the context manager will be replaced. As long as
   * all the fns in this class leverage properties on .context
   * everything be kept in sync.
   */
  private _contextManager: ArcGISContextManager;
  /**
   * Hold context directly. Allows the class to be used in places
   * where an `ArcGISContextManager` is not directly available, but
   * an `IArcGISContext` is
   */
  private _context: IArcGISContext;

  /**
   * Private so we can employ a factory function should we need
   * async work during creation
   * @param contextOrManager
   */
  private constructor(contextOrManager: ArcGISContextManager | IArcGISContext) {
    if (contextOrManager instanceof ArcGISContextManager) {
      this._contextManager = contextOrManager;
    } else {
      this._context = contextOrManager;
    }
  }

  /**
   * Factory function to construct a new HubProjectManager instance.
   *
   * Note: Used so that we could do async actions in the ctor.
   * @param contextOrManager
   * @returns
   */
  static init(
    contextOrManager: ArcGISContextManager | IArcGISContext
  ): HubProjectManager {
    return new HubProjectManager(contextOrManager);
  }

  /**
   * Getter to abstract how we store the context
   */
  private get context() {
    if (this._contextManager) {
      return this._contextManager.context;
    } else {
      return this._context;
    }
  }

  /**
   * Create and store new project.
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
      // ammend in the orgUrlKey
      if (!project.orgUrlKey) {
        project.orgUrlKey = this.context.portal.urlKey;
      }
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

  // DEPRECATED IN FAVOR OF .fetch()
  // TODO: REMOVE AT NEXT MAJOR
  /* istanbul ignore next */
  async get(
    identifier: string,
    requestOptions?: IRequestOptions
  ): Promise<IHubProject> {
    // tslint:disable-next-line
    console.warn(
      `HubProjectManager.get is deprecated and will be removed. Use .fetch() instead.`
    );
    return this.fetch(identifier, requestOptions);
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
  async fetch(
    identifier: string,
    requestOptions?: IRequestOptions
  ): Promise<IHubProject> {
    if (requestOptions || this.context.requestOptions) {
      return fetchProject(
        identifier,
        requestOptions || this.context.requestOptions
      );
    } else {
      throw new HubError(
        "Fetch Project",
        "Can not retrieve context.requestOptions from Context Manager. HubProjectManager is configured incorrectly."
      );
    }
  }

  /**
   * Search for Projects
   *
   * @param filter
   * @param options
   */
  async search(
    filter: Filter<"content">,
    options: IHubSearchOptions
  ): Promise<ISearchResponse<IHubProject>> {
    // if we were not passed auth, and we have a session, use it
    if (!options.authentication && this.context.session) {
      options.authentication = this.context.session;
    }
    return searchProjects(filter, options);
  }

  /**
   * Set the thumbnail for the Project
   * @param id
   * @param file
   * @param filename
   * @param requestOptions
   * @returns
   */
  async updateThumbnail(
    project: IHubProject,
    file: any,
    filename: string,
    requestOptions?: IUserRequestOptions
  ): Promise<IHubProject> {
    const ro = requestOptions || this.context.userRequestOptions;
    await updateItemThumbnail(project.id, file, filename, ro);
    // get the item so we have updated props and timestamps
    return this.fetch(project.id, requestOptions);
  }

  /**
   * Convert a Hub Project Item to a IHubProject
   * @param item
   * @param requestOptions
   * @returns
   */
  async fromItem(
    item: IItem,
    requestOptions?: IRequestOptions
  ): Promise<IHubProject> {
    const ro = requestOptions || this.context.userRequestOptions;
    return convertItemToProject(item, ro);
  }
}
