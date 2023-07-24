import { DEFAULT_PROJECT } from "./defaults";
import {
  IHubProject,
  IWithCatalogBehavior,
  IWithStoreBehavior,
  IWithSharingBehavior,
  IResolvedMetric,
  IWithCardBehavior,
  IHubProjectEditor,
  IEntityEditorContext,
  SettableAccessLevel,
} from "../core";
import {
  EditorType,
  getEntityEditorSchemas,
} from "../core/schemas/getEntityEditorSchemas";
import { Catalog } from "../search";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import {
  IEditorConfig,
  IWithEditorBehavior,
} from "../core/behaviors/IWithEditorBehavior";

// NOTE: this could be lazy-loaded just like the CUD functions
import { fetchProject } from "./fetch";

import { IWithMetricsBehavior } from "../core/behaviors/IWithMetricsBehavior";
import { getEntityMetrics } from "../metrics/getEntityMetrics";
import { resolveMetric } from "../metrics/resolveMetric";
import {
  IConvertToCardModelOpts,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";
import { projectToCardModel } from "./view";
import { cloneObject, maybePush } from "../util";
import { createProject, editorToProject, updateProject } from "./edit";
import { getProjectEditorConfigOptions } from "./_internal/getProjectEditorConfigOptions";

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
    IWithCardBehavior,
    IWithEditorBehavior
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
   * Given a partial project, apply defaults to it to ensure that a baseline of properties are set
   * @param partialProject
   * @param context
   * @returns
   */
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
   * Convert the project entity into a card view model that can
   * be consumed by the suite of hub gallery components
   *
   * @param opts view model options
   */
  convertToCardModel(opts?: IConvertToCardModelOpts): IHubCardViewModel {
    return projectToCardModel(this.entity, this.context, opts);
  }
  /*
   * Gt the editor config for the HubProject entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: EditorType
  ): Promise<IEditorConfig> {
    // get the options first...
    const projectOptions = await getProjectEditorConfigOptions(
      this.entity,
      this.context
    );
    // TODO: Decide if we should split up the logic in this next function
    return getEntityEditorSchemas(i18nScope, type, projectOptions);
  }

  /**
   * Return the project as an editor object
   * @param editorContext
   * @returns
   */
  toEditor(editorContext: IEntityEditorContext = {}): IHubProjectEditor {
    // cast the entity to it's editor
    const editor = cloneObject(this.entity) as IHubProjectEditor;
    // add the groups array that we'll use to auto-share on save
    editor.groups = [];

    /**
     * on project creation, we want to pre-populate the sharing
     * field with the core and collaboration groups if the user
     * has the appropriate shareToGroup portal privilege
     */
    const { access: canShare } = this.checkPermission("hub:project:share");
    if (!editor.id && canShare) {
      // TODO: at what point can we remove this "auto-share" behavior?
      editor.groups = maybePush(editorContext.contentGroupId, editor.groups);
      editor.groups = maybePush(
        editorContext.collaborationGroupId,
        editor.groups
      );
    }

    return editor;
  }

  /**
   * Load the project from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubProjectEditor): Promise<IHubProject> {
    const autoShareGroups = editor.groups || [];
    const isProjectCreate = !editor.id;

    // extract out things we don't want to persist directly
    // b/c the first thing we do is create/update the project
    const featuredImage = editor.view.featuredImage;
    delete editor.view.featuredImage;

    // convert back to an entity
    const entity = editorToProject(editor, this.context.portal);

    // create it if it does not yet exist...
    if (isProjectCreate) {
      // this allows the featured image functions to work
      this.entity = await createProject(
        entity,
        this.context.userRequestOptions
      );
    } else {
      // ...otherwise, update the in-memory entity and save it
      this.entity = entity;
      this.save();
    }

    // handle featured image
    if (featuredImage) {
      if (featuredImage.blob) {
        await this.setFeaturedImage(featuredImage.blob);
      } else {
        await this.clearFeaturedImage();
      }
    }

    /**
     * operations that are only relevant to the project create workflow.
     * if these ever become part of the edit experience, we can remove
     * the conditional
     */
    if (isProjectCreate) {
      await this.setAccess(editor.access as SettableAccessLevel);
      // share the entity with the configured groups
      if (autoShareGroups.length) {
        await Promise.all(
          autoShareGroups.map((id: string) => {
            return this.shareWithGroup(id);
          })
        );
      }
    }

    return this.entity;
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
