import { DEFAULT_PROJECT } from "./defaults";

import {
  IHubLayout,
  IHubProject,
  IHubTimeline,
  IWithPermissionBehavior,
  IWithCatalogBehavior,
  PermissionManager,
  IHubPermission,
  IHubClassBehavior,
} from "../core";

import { IHubGeography } from "../types";
import { cloneObject } from "../util";
import { createProject, deleteProject, updateProject } from "./HubProjects";

import { IHubCatalog } from "../search";
import { Catalog } from "../search/Catalog";
import { IArcGISContext } from "../ArcGISContext";

/**
 * Hub Project Class
 */
export class HubProject
  implements
    IHubProject,
    IHubClassBehavior<IHubProject>,
    IWithPermissionBehavior,
    IWithCatalogBehavior
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
    this._catalog = Catalog.fromJson(project.catalogDefinition, this.context);
    this._permissionManager = PermissionManager.fromJson(
      project.permissionDefinition,
      this.context
    );
  }

  //#region Properties - coverage skipped for now
  // TODO: decide if we want ambient dirty tracking or if we
  // implement that as async check against the server

  // istanbul ignore next
  get permissionDefinition(): IHubPermission[] {
    return this.entity.permissionDefinition;
  }
  // istanbul ignore next
  set permissionDefinition(permissions: IHubPermission[]) {
    this.entity.permissionDefinition = permissions;
  }

  // istanbul ignore next
  get timeline(): IHubTimeline | undefined {
    return this.entity.timeline;
  }
  // istanbul ignore next
  set timeline(value: IHubTimeline | undefined) {
    this.entity.timeline = value;
  }
  // istanbul ignore next
  get status(): "inactive" | "active" {
    return this.entity.status;
  }
  // istanbul ignore next
  set status(value: "inactive" | "active") {
    this.entity.status = value;
  }

  // istanbul ignore next
  get thumbnailUrl(): string | undefined {
    return this.entity.thumbnailUrl;
  }
  // istanbul ignore next
  set thumbnailUrl(value: string | undefined) {
    this.entity.thumbnailUrl = value;
  }

  // istanbul ignore next
  get owner(): string {
    return this.entity.owner;
  }

  // istanbul ignore next
  get description(): string | undefined {
    return this.entity.description;
  }
  // istanbul ignore next
  set description(value: string | undefined) {
    this.entity.description = value;
  }
  // istanbul ignore next
  get boundary(): IHubGeography | undefined {
    return this.entity.boundary;
  }
  // istanbul ignore next
  set boundary(value: IHubGeography | undefined) {
    this.entity.boundary = value;
  }
  // istanbul ignore next
  get culture(): string | undefined {
    return this.entity.culture;
  }
  // istanbul ignore next
  set culture(value: string | undefined) {
    this.entity.culture = value;
  }
  // istanbul ignore next
  get tags(): string[] {
    return this.entity.tags;
  }
  // istanbul ignore next
  set tags(value: string[]) {
    this.entity.tags = value;
  }
  // istanbul ignore next
  get typeKeywords(): string[] | undefined {
    return this.entity.typeKeywords;
  }
  // istanbul ignore next
  set typeKeywords(value: string[] | undefined) {
    this.entity.typeKeywords = value;
  }
  // istanbul ignore next
  get url(): string | undefined {
    return this.entity.url;
  }
  // istanbul ignore next
  set url(value: string | undefined) {
    this.entity.url = value;
  }
  // istanbul ignore next
  get id(): string {
    return this.entity.id;
  }

  // istanbul ignore next
  get name(): string {
    return this.entity.name;
  }
  // istanbul ignore next
  set name(value: string) {
    this.entity.name = value;
  }
  // istanbul ignore next
  get summary(): string | undefined {
    return this.entity.summary;
  }
  // istanbul ignore next
  set summary(value: string | undefined) {
    this.entity.summary = value;
  }
  // istanbul ignore next
  get createdDate(): Date {
    return this.entity.createdDate;
  }
  // istanbul ignore next
  get createdDateSource(): string {
    return this.entity.createdDateSource;
  }
  // istanbul ignore next
  get updatedDate(): Date {
    return this.entity.updatedDate;
  }
  // istanbul ignore next
  get updatedDateSource(): string {
    return this.entity.updatedDateSource;
  }
  // istanbul ignore next
  get type(): string {
    return this.entity.type;
  }
  // istanbul ignore next
  get source(): string | undefined {
    return this.entity.source;
  }
  // istanbul ignore next
  set source(value: string | undefined) {
    this.entity.source = value;
  }
  // istanbul ignore next
  get slug(): string {
    return this.entity.slug;
  }
  // istanbul ignore next
  set slug(value: string) {
    this.entity.slug = value;
  }
  // istanbul ignore next
  get orgUrlKey(): string {
    return this.entity.orgUrlKey;
  }
  // istanbul ignore next
  get layout(): IHubLayout | undefined {
    return this.entity.layout;
  }
  // istanbul ignore next
  set layout(value: IHubLayout | undefined) {
    this.entity.layout = value;
  }
  // istanbul ignore next
  get catalogDefinition(): IHubCatalog {
    return this.entity.catalogDefinition;
  }

  set catalogDefinition(value: IHubCatalog) {
    this.entity.catalogDefinition = value;
    // update the catalog instance
    this._catalog = Catalog.fromJson(value, this.context);
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

  // #endregion

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
  applyChanges(changes: IHubProject): void {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    // apply the changes to the entity
    this.entity = cloneObject(changes) as unknown as IHubProject;
    // set the internal catalog
    this._catalog = Catalog.fromJson(changes.catalogDefinition, this.context);
  }

  /**
   * Save the HubProject to the store
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    // get the catalog definition out of the instance
    this.entity.catalogDefinition = this._catalog.toJson();

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
  async delete(): Promise<boolean> {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteProject(this.entity.id, this.context.userRequestOptions);
    // how to indicate that this instance should be destroyed?
    return true;
  }
}
