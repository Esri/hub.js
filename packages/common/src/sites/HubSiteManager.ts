import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IArcGISContext } from "../ArcGISContext";
import HubError from "../HubError";
import {
  IHubEntityManager,
  IHubItemEntityManager,
  IHubSite,
} from "../core/types";

// Node has issues if this is not directly imported
import { ArcGISContextManager } from "../ArcGISContextManager";
import {
  updateSite,
  destroySite,
  createSite,
  _fetchSite,
  convertItemToSite,
  searchSites,
} from "./HubSites";
import { IHubSearchOptions, IQuery } from "../search";
import { IHubRequestOptions, ISearchResponse } from "../types";
import { setItemThumbnail as updateItemThumbnail } from "../items/setItemThumbnail";

import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";

export class HubSiteManager
  implements IHubEntityManager<IHubSite>, IHubItemEntityManager<IHubSite>
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
  ): HubSiteManager {
    return new HubSiteManager(contextOrManager);
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
   * Create and store a new Site
   *
   * This also registers the item for oAuth and
   * registers domain names with the hub Domain system
   *
   * Sites are stored as Items in the Sharing API
   * @param site
   * @param requestOptions
   * @returns
   */
  async create(
    site: Partial<IHubSite>,
    requestOptions?: IHubRequestOptions
  ): Promise<IHubSite> {
    if (requestOptions || this.context.isAuthenticated) {
      // ammend in the orgUrlKey
      if (!site.orgUrlKey) {
        site.orgUrlKey = this.context.portal.urlKey;
      }
      return createSite(site, requestOptions || this.context.hubRequestOptions);
    } else {
      throw new HubError(
        "Create Site",
        "Creating Hub Sites requires authentication."
      );
    }
  }
  /**
   * Update a Site
   * @param site
   * @param requestOptions
   * @returns
   */
  async update(
    site: IHubSite,
    requestOptions?: IHubRequestOptions
  ): Promise<IHubSite> {
    if (requestOptions || this.context.isAuthenticated) {
      return updateSite(site, requestOptions || this.context.hubRequestOptions);
    } else {
      throw new HubError(
        "Update Site",
        "Updating a Hub Site requires authentication."
      );
    }
  }
  /**
   * Destroy a Site
   * This permanently removes the backing Item,
   * and clears the domain entries for it.
   * @param id
   * @param requestOptions
   * @returns
   */
  async destroy(
    id: string,
    requestOptions?: IHubRequestOptions
  ): Promise<void> {
    if (requestOptions || this.context.isAuthenticated) {
      return destroySite(id, requestOptions || this.context.hubRequestOptions);
    } else {
      throw new HubError(
        "Destroy Site",
        "Destroying Hub Sites requires authentication."
      );
    }
  }

  /**
   * Fetch a Site via Id, slug or domain
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
    requestOptions?: IHubRequestOptions
  ): Promise<IHubSite> {
    try {
      if (requestOptions || this.context.hubRequestOptions) {
        return _fetchSite(
          identifier,
          requestOptions || this.context.hubRequestOptions
        );
      } else {
        throw new HubError(
          "Fetch Site",
          "Can not retrieve context.hubRequestOptions from Context Manager. HubSiteManager is configured incorrectly."
        );
      }
    } catch (ex) {
      throw new HubError(
        "Fetch Site",
        "Can not retrieve context.hubRequestOptions from Context Manager. HubSiteManager is configured incorrectly.",
        ex as unknown as Error
      );
    }
  }
  /**
   * Search for Sites
   *
   * @param filter
   * @param opts
   */
  async search(
    query: string | IQuery,
    options: IHubSearchOptions
  ): Promise<ISearchResponse<IHubSite>> {
    // if we were not passed auth, and we have a session, use it
    if (!options.authentication && this.context.session) {
      options.authentication = this.context.session;
    }
    return searchSites(query, options);
  }
  /**
   * Set the thumbnail for the Site
   * @param id
   * @param file
   * @param filename
   * @param requestOptions
   * @returns
   */
  async updateThumbnail(
    site: IHubSite,
    file: any,
    filename: string,
    requestOptions?: IUserRequestOptions
  ): Promise<IHubSite> {
    const ro = requestOptions || this.context.userRequestOptions;
    await updateItemThumbnail(site.id, file, filename, ro);
    // get the item so we have updated props and timestamps
    return this.fetch(site.id, requestOptions);
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
  ): Promise<IHubSite> {
    const ro = requestOptions || this.context.userRequestOptions;
    return convertItemToSite(item, ro);
  }
}
