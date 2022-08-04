import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

import { DEFAULT_PROJECT, DEFAULT_PROJECT_MODEL } from "./defaults";
import { IPropertyMap, PropertyMapper } from "../core/_internal/PropertyMapper";

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
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items";
import { createModel } from "../models";
import { IHubGeography } from "../types";
import { cloneObject } from "../util";
import { updateProject } from "./HubProjects";

/**
 * Hub Project Class
 */
export class HubProject implements IHubProject, IPermissionBehavior {
  private context: IArcGISContext;
  private mapper: PropertyMapper<IHubProject>;
  private entity: IHubProject;
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubProjectManager over time.
   * @param context
   */
  private constructor(project: IHubProject, context: IArcGISContext) {
    this.context = context;
    this.entity = project;
    this.mapper = new PropertyMapper<IHubProject>(getProjectPropertyMap());
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
  get slug(): string | undefined {
    return this.entity.slug;
  }
  set slug(value: string | undefined) {
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
   * Create a new HubProject, returning a HubProject instance
   * @param partialProject
   * @param context
   * @returns
   */
  static async create(
    partialProject: Partial<IHubProject>,
    context: IArcGISContext
  ): Promise<HubProject> {
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
    return cloneObject(this.entity);
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  applyChanges(changes: IHubProject): void {
    this.entity = cloneObject(changes);
  }

  /**
   * Save the HubProject to the store
   * @returns
   */
  async save(): Promise<void> {
    if (this.entity.id) {
      // update it
      this.entity = (await updateProject(
        this.entity,
        this.context.userRequestOptions
      )) as IHubProject; // this cast is needed b/c we have extended IHubProject within this hack app
    } else {
      // create it
      this.entity = await createProject(
        {
          partialProject: this.entity,
          mapper: this.mapper,
          orgUrlKey: this.context.portal.urlKey,
        },
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
  // async delete(): Promise<boolean> {
  //   // Delegate to module fn
  //   await destroyProject(this.entity.id, this.context.userRequestOptions);
  //   // how to indicate that this instance should be destroyed?
  //   return true;
  // }

  checkPermission(permission: HubPermission): boolean {
    return checkPermission(this.entity, permission, this.context.currentUser);
  }

  getPermissions(permission: HubPermission): IHubPermission[] {
    return getPermissions(this.entity, permission);
  }

  addPermission(permission: HubPermission, definition: IHubPermission): void {
    this.entity = addPermission(this.entity, permission, definition);
  }

  removePermission(key: string): void {
    this.entity = removePermission(this.entity, key);
  }
}

/**
 * Returns an Array of IPropertyMap objects
 * We could define these directly, but since the
 * properties of IHubProject map directly to properties
 * on item or data, it's slightly less verbose to
 * generate the structure.
 * @returns
 */
function getProjectPropertyMap(): IPropertyMap[] {
  const itemProps = [
    "created",
    "culture",
    "description",
    "extent",
    "id",
    "modified",
    "owner",
    "snippet",
    "tags",
    "typeKeywords",
    "url",
    "type",
  ];
  const dataProps = [
    "contacts",
    "display",
    "geometry",
    "headerImage",
    "layout",
    "location",
    "status",
    "permissions",
  ];
  const map: IPropertyMap[] = [];
  itemProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `item.${entry}` });
  });
  dataProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `data.${entry}` });
  });
  // Deeper mappings
  map.push({
    objectKey: "slug",
    modelKey: "item.properties.slug",
  });
  map.push({
    objectKey: "orgUrlKey",
    modelKey: "item.properties.orgUrlKey",
  });
  map.push({
    objectKey: "name",
    modelKey: "item.title",
  });
  return map;
}

//#region helper functions

async function createProject(
  options: {
    partialProject: Partial<IHubProject>;
    mapper: PropertyMapper<IHubProject>;
    orgUrlKey: string;
  },
  requestOptions: IUserRequestOptions
): Promise<IHubProject> {
  const project = {
    ...DEFAULT_PROJECT,
    ...options.partialProject,
  } as IHubProject;
  // construct slug
  if (!project.slug && project.name) {
    project.slug = constructSlug(project.name, options.orgUrlKey);
  }
  // Ensure slug is  unique
  project.slug = await getUniqueSlug(
    { slug: project.slug || "" },
    requestOptions
  );
  // add slug to keywords
  project.typeKeywords = setSlugKeyword(
    project.typeKeywords || [],
    project.slug
  );

  // create model from object, using the default model as a starting point
  let model = options.mapper.objectToModel(
    project,
    cloneObject(DEFAULT_PROJECT_MODEL)
  );
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubProject
  const newProject = options.mapper.modelToObject(model, {} as IHubProject);
  // and return it
  return newProject as IHubProject;
}

//#endregion
