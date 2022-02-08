import {
  ArcGISContextManager,
  IArcGISContextManagerOptions,
} from "./ArcGISContextManager";
import { HubProjectStore } from "./projects/HubProjectStore";

/**
 * Options for instantiating a Hub instance
 */
export interface IHubOptions {
  contextManager?: ArcGISContextManager;
  managerOptions?: IArcGISContextManagerOptions;
  authOptions?: { usename: string; password: string; portalUrl?: string };
}

/**
 * Hub class can be used as an entry point to managing
 * content, teams, sites, projects etc, in an organization's Hub.
 *
 * ```js
 * import {Hub} from '@esri/hub-common';
 * // create a Hub instance, authenticating as a specific user
 * // working against arcgis online
 * const myHub = await Hub.create({authOptions: {username: "casey", password: "jones"}});
 *
 * myHub.context.currentUser //=> {username: "casey", ...} as IUser
 *
 * const projectStore = await myHub.getProjectStore();
 *
 * const pavingProject = await projectStore.create({name: "12th Street Paving"});
 * pavingProject.summary = "This is the 2024 planned paving of 12th Street, between 8th and 11th Ave";
 * await projectStore.update(pavingProject);
 * ```
 *
 * This is a convenience class. Hub Stores can be created
 * directly, or the underlying functions can be imported an used
 * as need for scenarios where these class structures introduce
 * unwanted complexity
 */
export class Hub {
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
  static async create(options: IHubOptions): Promise<Hub> {
    if (options.contextManager) {
      return new Hub(options.contextManager);
    } else {
      const opts = options.managerOptions || {};
      const mgr = await ArcGISContextManager.create(opts);
      return new Hub(mgr);
    }
  }

  /**
   * Getter to abstract the context manager
   */
  public get context() {
    return this._contextManager.context;
  }

  /**
   * Create a Project Store connected to the current Hub
   * @returns
   */
  async getProjectStore() {
    return HubProjectStore.create(this._contextManager);
  }
}
