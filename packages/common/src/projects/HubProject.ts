import { DEFAULT_PROJECT } from "./defaults";

import {
  IHubProject,
  IWithCatalogBehavior,
  IWithStoreBehavior,
  IWithSharingBehavior,
  UiSchemaElementOptions,
  IResolvedMetric,
  IWithCardBehavior,
} from "../core";
import { getEntityEditorSchemas } from "../core/schemas/getEntityEditorSchemas";
import { Catalog } from "../search";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IEditorConfig } from "../core/behaviors/IWithEditorBehavior";

// NOTE: this could be lazy-loaded just like the CUD functions
import { fetchProject } from "./fetch";
import { ProjectEditorType } from "./_internal/ProjectSchema";
import { IWithMetricsBehavior } from "../core/behaviors/IWithMetricsBehavior";
import { getEntityMetrics } from "../metrics/getEntityMetrics";
import { resolveMetric } from "../metrics/resolveMetric";
import { IHubCardViewModel } from "../core/types/IHubCardViewModel";
import { getCardViewModelFromProjectEntity } from "./view";

/**
 * Hub Project Class
 */
export class HubProject
  extends HubItemEntity<IHubProject>
  implements
    IWithStoreBehavior<IHubProject>,
    IWithCatalogBehavior,
    IWithMetricsBehavior,
    IWithSharingBehavior,
    IWithCardBehavior
{
  private _catalog: Catalog;

  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubProjectManager over time.
   * @param context
   */
  private constructor(project: IHubProject, context: IArcGISContext) {
    super(project, context);
    this._catalog = Catalog.fromJson(project.catalog, this.context);
  }

  /**
   * Catalog instance for this project. Note: Do not hold direct references to this object; always access it from the project.
   * @returns
   */
  get catalog(): Catalog {
    return this._catalog;
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

  /**
   * Static method to get the editor config for the HubProject entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   *
   * Note: typescript does not have a means to specify static methods in interfaces
   * so while this is the implementation of IWithEditorBehavior, it is not enforced
   * by the compiler.
   */
  static async getEditorConfig(
    i18nScope: string,
    type: ProjectEditorType,
    options: UiSchemaElementOptions[] = []
  ): Promise<IEditorConfig> {
    return getEntityEditorSchemas(i18nScope, type, options);
  }

  /**
   * Convert the project entity into a card view model that can
   * be consumed by the gallery suite of components
   *
   * @param project project entity
   * @param context auth & portal information
   * @param target card link contextual target
   * @param locale internationalization locale
   */
  static convertToCardViewModel(
    project: IHubProject,
    context: IArcGISContext,
    target: "ago" | "view" | "workspace",
    locale: string = "en-US"
  ): IHubCardViewModel {
    return getCardViewModelFromProjectEntity(project, context, target, locale);
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
   * Note: typescript does not have a means to enforce static methods
   * defined on an interface; therefore, we define another (non-static)
   * method that simply delegates to the similarly-named static method,
   * and we enforce this method on the class by implementing
   * IWithCardBehavior
   *
   * @param target card link contextual target
   * @param locale internationalization locale
   */
  convertToCardViewModel(
    target: "ago" | "view" | "workspace",
    locale: string
  ): IHubCardViewModel {
    return HubProject.convertToCardViewModel(
      this.entity,
      this.context,
      target,
      locale
    );
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

    const { createProject, updateProject } = await import("./edit");

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
    // call the after save hook on superclass
    await super.afterSave();

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
    const { deleteProject } = await import("./edit");
    // Delegate to module fn
    await deleteProject(this.entity.id, this.context.userRequestOptions);
  }

  /**
   * Resolve a single metric for this metric
   * @param metricId
   * @returns
   */
  resolveMetric(metricId: string): Promise<IResolvedMetric> {
    const metrics = getEntityMetrics(this.entity);
    const metric = metrics.find((m) => m.id === metricId);
    // TODO: add caching
    if (metric) {
      return resolveMetric(metric, this.context);
    } else {
      throw new Error(`Metric ${metricId} not found.`);
    }
  }
}
