import { DEFAULT_PROJECT } from "./defaults";

import {
  addPermission,
  checkPermission,
  getPermissions,
  HubPermission,
  IHubLayout,
  IHubPermission,
  IHubProject,
  IHubTimeline,
  IPermissionBehavior,
  removePermission,
} from "../core";
import { IArcGISContext } from "..";
import { IHubGeography } from "../types";
import { cloneObject } from "../util";
import { createProject, destroyProject, updateProject } from "./HubProjects";

/**
 * Hub Project Class
 */
export class HubProject implements IHubProject, IPermissionBehavior {
  private context: IArcGISContext;
  private entity: IHubProject;
  private isDestroyed: boolean = false;
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubProjectManager over time.
   * @param context
   */
  private constructor(project: IHubProject, context: IArcGISContext) {
    this.context = context;
    this.entity = project;
  }

  //#region Properties

  get permissions(): IHubPermission[] {
    return this.entity.permissions;
  }
  set permissions(permissions: IHubPermission[]) {
    this.entity.permissions = permissions;
  }

  get timeline(): IHubTimeline | undefined {
    return this.entity.timeline;
  }
  set timeline(value: IHubTimeline | undefined) {
    this.entity.timeline = value;
  }
  get status(): "inactive" | "active" {
    return this.entity.status;
  }
  set status(value: "inactive" | "active") {
    this.entity.status = value;
  }

  get thumbnailUrl(): string | undefined {
    return this.entity.thumbnailUrl;
  }
  set thumbnailUrl(value: string | undefined) {
    this.entity.thumbnailUrl = value;
  }

  get owner(): string {
    return this.entity.owner;
  }

  get description(): string | undefined {
    return this.entity.description;
  }
  set description(value: string | undefined) {
    this.entity.description = value;
  }
  get boundary(): IHubGeography | undefined {
    return this.entity.boundary;
  }
  set boundary(value: IHubGeography | undefined) {
    this.entity.boundary = value;
  }
  get culture(): string | undefined {
    return this.entity.culture;
  }
  set culture(value: string | undefined) {
    this.entity.culture = value;
  }
  get tags(): string[] {
    return this.entity.tags;
  }
  set tags(value: string[]) {
    this.entity.tags = value;
  }
  get typeKeywords(): string[] | undefined {
    return this.entity.typeKeywords;
  }
  set typeKeywords(value: string[] | undefined) {
    this.entity.typeKeywords = value;
  }
  get url(): string | undefined {
    return this.entity.url;
  }
  set url(value: string | undefined) {
    this.entity.url = value;
  }
  get id(): string {
    return this.entity.id;
  }

  get name(): string {
    return this.entity.name;
  }
  set name(value: string) {
    this.entity.name = value;
  }
  get summary(): string | undefined {
    return this.entity.summary;
  }
  set summary(value: string | undefined) {
    this.entity.summary = value;
  }
  get createdDate(): Date {
    return this.entity.createdDate;
  }
  get createdDateSource(): string {
    return this.entity.createdDateSource;
  }
  get updatedDate(): Date {
    return this.entity.updatedDate;
  }
  get updatedDateSource(): string {
    return this.entity.updatedDateSource;
  }
  get type(): string {
    return this.entity.type;
  }
  get source(): string | undefined {
    return this.entity.source;
  }
  set source(value: string | undefined) {
    this.entity.source = value;
  }
  get slug(): string {
    return this.entity.slug;
  }
  set slug(value: string) {
    this.entity.slug = value;
  }
  get orgUrlKey(): string {
    return this.entity.orgUrlKey;
  }
  get layout(): IHubLayout | undefined {
    return this.entity.layout;
  }
  set layout(value: IHubLayout | undefined) {
    this.entity.layout = value;
  }
  // #endregion

  /**
   *
   * @param json - JSON object to create a HubProject from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(json: IHubProject, context: IArcGISContext): HubProject {
    return new HubProject(json, context);
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
    context: IArcGISContext
  ): Promise<HubProject> {
    // ensure we have the orgUrlKey
    if (!partialProject.orgUrlKey) {
      partialProject.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_PROJECT, ...partialProject } as IHubProject;
    // return an instance of HubProject
    return HubProject.fromJson(pojo, context);
  }

  /**
   * Get the current state of the IHubProject from the instance
   * @returns IHubProject POJO
   */
  toJson(): IHubProject {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    return cloneObject(this.entity);
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  applyChanges(changes: IHubProject): void {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    this.entity = cloneObject(changes);
  }

  /**
   * Save the HubProject to the store
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
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
   * Should this even have a delete method?
   * Or should this just have mutation methods and create/destroy happen
   * at the Hub level
   * @returns
   */
  async destroy(): Promise<boolean> {
    this.isDestroyed = true;
    // Delegate to module fn
    await destroyProject(this.entity.id, this.context.userRequestOptions);
    // how to indicate that this instance should be destroyed?
    return true;
  }

  checkPermission(permission: HubPermission): boolean {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    return checkPermission(this.entity, permission, this.context.currentUser);
  }

  getPermissions(permission: HubPermission): IHubPermission[] {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    return getPermissions(this.entity, permission);
  }

  addPermission(permission: HubPermission, definition: IHubPermission): void {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    this.entity = addPermission(this.entity, permission, definition);
  }

  removePermission(key: string): void {
    if (this.isDestroyed) {
      throw new Error("HubProject is already destroyed.");
    }
    this.entity = removePermission(this.entity, key);
  }
}
