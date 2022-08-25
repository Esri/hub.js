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
  getUser,
  setItemAccess,
  shareItemWithGroup,
  unshareItemWithGroup,
} from "@esri/arcgis-rest-portal";
import { sharedWith } from "../core/_internal/sharedWith";
import { mapBy } from "../utils";

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
  private _cachedEntityGroups: IGroup[];
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
   * Save the HubProject to the backing store. Currently Projects are stored as Items in Portal
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
  async sharedWith(useCache: boolean = true): Promise<IGroup[]> {
    if (!this._cachedEntityGroups || !useCache) {
      this._cachedEntityGroups = await sharedWith(
        this.entity.id,
        this.context.requestOptions
      );
    }
    return Promise.resolve(this._cachedEntityGroups);
  }

  //#endregion

  // TODO: Abstract into utils or a "Manager" class we proxy to

  /**
   * Can the current user edit this Project?
   * Logic:
   * - owner can edit
   * - members of shared edit groups to which the backing item is shared can edit
   * @param useCache
   * @returns
   */
  async canEdit(useCache: boolean = true): Promise<boolean> {
    const user = this.context.currentUser;
    // owner can always edit
    if (user.username === this.entity.owner) {
      return Promise.resolve(true);
    }
    // user groups are loaded when the context is initialized
    // TODO: figure out how to have context update the groups and use a cache
    let usersGroups = this.context.currentUser.groups || [];
    if (!useCache) {
      // break the cache of groups, by fetching the user, which has the groups
      const u = await getUser(user.username);
      usersGroups = u.groups;
    }

    if (!usersGroups.length) {
      // if user is not owner and not in any groups they can't have edit access
      return Promise.resolve(false);
    }

    // get the groups the entity is shared to
    const entityGroups = await this.sharedWith(useCache);
    // filter to shared edit groups
    const editGroupIds = entityGroups
      .filter((g) => {
        const caps = (g.capabilities as string[]) || [];
        return caps.includes("updateitemcontrol");
      })
      .map((g) => g.id);
    // get the user's groups ids
    const usersGroupsIds = mapBy("id", usersGroups) as string[];
    // check for any overlap
    let isMemberOfEditGroup = false;
    usersGroupsIds.forEach((id) => {
      // only check if flag is still false
      if (!isMemberOfEditGroup) {
        isMemberOfEditGroup = editGroupIds.includes(id);
      }
    });
    return Promise.resolve(isMemberOfEditGroup);
  }
  /**
   * Can the current user delete this project?
   * Rules:
   * - owner can delete
   * - org admin from same org as owner can delete
   * @param useCache
   * @returns
   */
  async canDelete(useCache: boolean): Promise<boolean> {
    const user = this.context.currentUser;
    // owner can always delete
    if (user.username === this.entity.owner) {
      return Promise.resolve(true);
    }
    // if not owner, check if user is org_admin in same org as owner
    if (user.role === "org_admin" && !user.roleId) {
      // need to get the owner, and see if the orgid matches
      const ownerUser = await getUser({
        username: this.entity.owner,
        authentication: this.context.session,
      });
      // ensure owner orgId is not null and matched current user
      const adminCanDelete = ownerUser.orgId && ownerUser.orgId === user.orgId;
      return Promise.resolve(adminCanDelete);
    } else {
      // not org admin, can't edit
      return Promise.resolve(false);
    }
  }
}
