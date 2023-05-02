import { DEFAULT_INITIATIVE } from "./defaults";

import {
  IHubInitiative,
  IWithCatalogBehavior,
  IWithStoreBehavior,
  IWithSharingBehavior,
  UiSchemaElementOptions,
  IEditorConfig,
  IResolvedMetric,
  IEntityInfo,
} from "../core";
import { getEntityEditorSchemas } from "../core/schemas/getEntityEditorSchemas";
import {
  createInitiative,
  deleteInitiative,
  fetchInitiative,
  updateInitiative,
} from "./HubInitiatives";

import { Catalog, IQuery } from "../search";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { InitiativeEditorType } from "./_internal/InitiativeSchema";
import { IWithMetricsBehavior } from "../core/behaviors/IWithMetricsBehavior";
import { getEntityMetrics } from "../metrics/getEntityMetrics";
import { resolveMetric } from "../metrics/resolveMetric";
import {
  fetchApprovedProjects,
  fetchAssociatedProjects,
} from "../items/associations";

/**
 * Hub Initiative Class
 */
export class HubInitiative
  extends HubItemEntity<IHubInitiative>
  implements
    IWithStoreBehavior<IHubInitiative>,
    IWithCatalogBehavior,
    IWithMetricsBehavior,
    IWithSharingBehavior
{
  private _catalog: Catalog;

  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubInitiativeManager over time.
   * @param context
   */
  private constructor(entity: IHubInitiative, context: IArcGISContext) {
    super(entity, context);
    this._catalog = Catalog.fromJson(entity.catalog, this.context);
  }

  /**
   * Catalog instance for this Initiative. Note: Do not hold direct references to this object; always access it from the Initiative.
   * @returns Catalog
   */
  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * Create an instance from an IHubInitiative object
   * @param json - JSON object to create a HubInitiative from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubInitiative>,
    context: IArcGISContext
  ): HubInitiative {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubInitiative(pojo, context);
  }

  /**
   * Create a new HubInitiative, returning a HubInitiative instance.
   * Note: This does not persist the Initiative into the backing store
   * @param partialInitiative
   * @param context
   * @returns
   */
  static async create(
    partialInitiative: Partial<IHubInitiative>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubInitiative> {
    const pojo = this.applyDefaults(partialInitiative, context);
    // return an instance of HubInitiative
    const instance = HubInitiative.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch an Initiative from the backing store and return a HubInitiative instance.
   * @param identifier - slug or item id
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubInitiative> {
    // fetch by id or slug
    try {
      const entity = await fetchInitiative(identifier, context.requestOptions);
      // create an instance of HubInitiative from the entity
      return HubInitiative.fromJson(entity, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Initiative not found.`);
      } else {
        throw ex;
      }
    }
  }

  /**
   * Static method to get the editor config for the HubInitiative entity.
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
    type: InitiativeEditorType,
    options: UiSchemaElementOptions[] = []
  ): Promise<IEditorConfig> {
    return getEntityEditorSchemas(i18nScope, type, options);
  }

  private static applyDefaults(
    partialInitiative: Partial<IHubInitiative>,
    context: IArcGISContext
  ): IHubInitiative {
    // ensure we have the orgUrlKey
    if (!partialInitiative.orgUrlKey) {
      partialInitiative.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = {
      ...DEFAULT_INITIATIVE,
      ...partialInitiative,
    } as IHubInitiative;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubInitiative>): void {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };

    // update internal instances
    if (changes.catalog) {
      this._catalog = Catalog.fromJson(this.entity.catalog, this.context);
    }
  }

  /**
   * Save the HubInitiative to the backing store.
   * Currently Initiatives are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    // get the catalog, and permission configs
    this.entity.catalog = this._catalog.toJson();

    if (this.entity.id) {
      // update it
      this.entity = await updateInitiative(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createInitiative(
        this.entity,
        this.context.userRequestOptions
      );
    }

    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubInitiative from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteInitiative(this.entity.id, this.context.userRequestOptions);
  }

  /**
   * Resolve a single metric for this metric
   * @param metricId
   * @returns
   */
  resolveMetric(metricId: string): Promise<IResolvedMetric> {
    const metrics = getEntityMetrics(this.entity);
    const metric = metrics.find((m) => m.id === metricId);
    // TODO: Add caching
    if (metric) {
      return resolveMetric(metric, this.context);
    } else {
      throw new Error(`Metric ${metricId} not found.`);
    }
  }

  /**
   * Fetch the Projects that are associated with this Initiative.
   * Executes a query for Hub Projects that have typekeywords of "initiative|<initiative-id>"
   * System will only return Projects the current user has access to, regardless of the access level of the Initiative
   * @returns
   */
  fetchAssociatedProjects(): Promise<IEntityInfo[]> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    return fetchAssociatedProjects(this.entity, this.context.requestOptions);
  }

  /**
   * Fetch the Projects that are associated with this Initiative.
   * Executes a query for Hub Projects that have typekeywords of "initiative|<initiative-id>" and are included in the
   * Projects collection in the Initiative's Catalog
   * System will only return Projects the current user has access to, regardless of the access level of the Initiative
   * @returns
   */
  fetchApprovedProjects(): Promise<IEntityInfo[]> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    return fetchApprovedProjects(this.entity, this.context.requestOptions);
  }

  /**
   * Check if a Project is an Approved part of this Initiative.
   * To be "approved", the project must have the Initiative's id
   * in its typeKeywords and be included in the Initiative's Projects collection
   * in the Initiative's Catalog
   * @param id
   * @returns
   */
  async isProjectApproved(id: string): Promise<boolean> {
    if (this.isDestroyed) {
      throw new Error("HubInitiative is already destroyed.");
    }
    const qry: IQuery = {
      targetEntity: "item",
      filters: [{ operation: "AND", predicates: [{ id }] }],
    };

    const result = await fetchApprovedProjects(
      this.entity,
      this.context.requestOptions,
      qry
    );
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
