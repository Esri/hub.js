import { DEFAULT_PROJECT } from "./defaults";

import {
  IHubProject,
  IWithPermissionBehavior,
  IWithCatalogBehavior,
  PermissionManager,
  IWithStoreBehavior,
  IWithSharingBehavior,
  SettableAccessLevel,
} from "../core";

import { cloneObject } from "../util";
import {
  createProject,
  deleteProject,
  fetchProject,
  updateProject,
} from "./HubProjects";

import { Catalog } from "../search/Catalog";
import { IArcGISContext } from "../ArcGISContext";
import { IGroup } from "@esri/arcgis-rest-types";
import {
  setItemAccess,
  shareItemWithGroup,
  unshareItemWithGroup,
} from "@esri/arcgis-rest-portal";
import { sharedWith } from "../core/_internal/sharedWith";

/**
 * Hub Project Class
 */
export class HubProject
  implements
    IWithStoreBehavior<IHubProject>,
    IWithPermissionBehavior,
    IWithCatalogBehavior,
    IWithSharingBehavior
{
  private context: IArcGISContext;
  private entity: IHubProject;
  private isDestroyed: boolean = false;
  private _catalog: Catalog;
  private _permissionManager: PermissionManager;
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubProjectManager over time.
   * @param context
   */
  private constructor(project: IHubProject, context: IArcGISContext) {
    this.context = context;
    this.entity = project;
    this._catalog = Catalog.fromJson(project.catalog, this.context);
    this._permissionManager = PermissionManager.fromJson(
      project.permissions,
      this.context
    );
  }

  /**
   * @returns Catalog instance for this project. Note: Do not hold direct references to this object; always access it from the project.
   */
  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * @returns PermissionManager instance for this project. Note: Do not hold direct references to this object; always access it from the project.
   */
  get permissions(): PermissionManager {
    return this._permissionManager;
  }

  /**
   * Create an instance from an IHubProject object
   * @param json - JSON object to create a HubProject from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubProject>,
    context: IArcGISContext
  ): HubProject {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubProject(pojo, context);
  }

  /**
   * Create a new HubProject, returning a HubProject instance.
   * Note: This does not persist the Project into the backing store
   * @param partialProject
   * @param context
   * @returns
   */
  static async create(
    partialProject: Partial<IHubProject>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubProject> {
    const pojo = this.applyDefaults(partialProject, context);
    // return an instance of HubProject
    const instance = HubProject.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Project from the backing store and return a HubProject instance.
   * @param identifier - Identifier of the project to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubProject> {
    // fetch the project by id or slug
    try {
      const project = await fetchProject(identifier, context.requestOptions);
      // create an instance of HubProject from the project
      return HubProject.fromJson(project, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Project not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(
    partialProject: Partial<IHubProject>,
    context: IArcGISContext
  ): IHubProject {
    // ensure we have the orgUrlKey
    if (!partialProject.orgUrlKey) {
      partialProject.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_PROJECT, ...partialProject } as IHubProject;
    return pojo;
  }

  /**
   * Get the current state of the IHubProject from the instance
   * @returns IHubProject POJO
   */
  toJson(): IHubProject {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    return cloneObject(this.entity) as unknown as IHubProject;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubProject>): void {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };

    // update internal instances
    if (changes.catalog) {
      this._catalog = Catalog.fromJson(this.entity.catalog, this.context);
    }
    if (changes.permissions) {
      this._permissionManager = PermissionManager.fromJson(
        this.entity.permissions,
        this.context
      );
    }
  }

  /**
   * Save the HubProject to the store
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    // get the catalog, and permission configs
    this.entity.catalog = this._catalog.toJson();
    this.entity.permissions = this._permissionManager.toJson();

    if (this.entity.id) {
      // update it
      this.entity = await updateProject(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createProject(
        this.entity,
        this.context.userRequestOptions
      );
    }

    return;
  }

  /**
   * Delete the HubProject from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteProject(this.entity.id, this.context.userRequestOptions);
  }

  //#region IWithSharingBehavior
  /**
   * Share the Project with the specified group id
   * @param groupId
   */
  async shareWithGroup(groupId: string): Promise<void> {
    await shareItemWithGroup({
      id: this.entity.id,
      groupId,
      owner: this.entity.owner,
      authentication: this.context.session,
    });
  }
  /**
   * Unshare the Project with the specified group id
   * @param groupId
   */
  async unshareWithGroup(groupId: string): Promise<void> {
    await unshareItemWithGroup({
      id: this.entity.id,
      groupId,
      owner: this.entity.owner,
      authentication: this.context.session,
    });
  }
  /**
   * Set the access level of the backing item
   * @param access
   */
  async setAccess(access: SettableAccessLevel): Promise<void> {
    await setItemAccess({
      id: this.entity.id,
      access,
      authentication: this.context.session,
    });
    // if this succeeded, update the entity
    this.entity.access = access;
  }

  /**
   * Return a list of groups the Project is shared to.
   * @returns
   */
  async sharedWith(): Promise<IGroup[]> {
    // delegate to a util that merges the three arrays returned from the api, into a single array
    return sharedWith(this.entity.id, this.context.requestOptions);
  }

  //#endregion
}
