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

import { Catalog } from "../search/Catalog";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IEditorConfig } from "../core/schemas/types";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";

import { getEditorConfig } from "../core/schemas/getEditorConfig";

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
import { camelize, cloneObject, createId } from "../util";
import { createProject, editorToProject, updateProject } from "./edit";
import { ProjectEditorType } from "./_internal/ProjectSchema";
import { enrichEntity } from "../core/enrichEntity";
import { getProp, getWithDefault } from "../objects";
import { IGroup } from "@esri/arcgis-rest-types";
import { metricToEditor } from "../core/schemas/internal/metrics/metricToEditor";
import { editorToMetric } from "../core/schemas/internal/metrics/editorToMetric";
import { setMetricAndDisplay } from "../core/schemas/internal/metrics/setMetricAndDisplay";
import { IMetricDisplayConfig } from "../core/types/Metrics";

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
   * Get a specific editor config for the HubProject entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresponds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: ProjectEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the project as an editor object
   * @param editorContext
   * @returns
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubProjectEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubProjectEditor)
      : (cloneObject(this.entity) as IHubProjectEditor);

    // add the groups array that we'll use to auto-share on save
    editor._groups = [];

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    /**
     * on project creation, we want to pre-populate the sharing
     * field with the core and collaboration groups if the user
     * has the appropriate shareToGroup portal privilege
     *
     * TODO: we should re-evaluate this "auto-populate" pattern
     */
    const { access: canShare } = this.checkPermission(
      "platform:portal:user:shareToGroup"
    );
    if (!editor.id && canShare) {
      const currentUserGroups: IGroup[] =
        getProp(this.context, "currentUser.groups") || [];
      const defaultShareWithGroups = [
        editorContext.contentGroupId,
        editorContext.collaborationGroupId,
      ].reduce((acc, groupId) => {
        const group = currentUserGroups.find((g: IGroup) => g.id === groupId);
        const canShareToGroup =
          !!group &&
          (!group.isViewOnly ||
            (group.isViewOnly &&
              ["owner", "admin"].includes(group.memberType)));

        canShareToGroup && acc.push(groupId);
        return acc;
      }, []);
      editor._groups = [...editor._groups, ...defaultShareWithGroups];
    }

    // handle metrics
    const metrics = getEntityMetrics(this.entity);
    const metric = metrics.find((m) => m.id === editorContext.metricId);
    const displays = getWithDefault(this.entity, "view.metricDisplays", []);
    const displayConfig =
      displays.find(
        (display: IMetricDisplayConfig) =>
          display.metricId === editorContext.metricId
      ) || {};
    editor._metric = metricToEditor(metric, displayConfig);

    return editor;
  }

  /**
   * Load the project from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(
    editor: IHubProjectEditor,
    editorContext?: IEntityEditorContext
  ): Promise<IHubProject> {
    const autoShareGroups = editor._groups || [];
    const isCreate = !editor.id;

    // Setting the thumbnailCache will ensure that
    // the thumbnail is updated on next save
    if (editor._thumbnail) {
      if (editor._thumbnail.blob) {
        this.thumbnailCache = {
          file: editor._thumbnail.blob,
          filename: editor._thumbnail.fileName,
          clear: false,
        };
      } else {
        this.thumbnailCache = {
          clear: true,
        };
      }
    }

    delete editor._thumbnail;

    // extract out things we don't want to persist directly
    // b/c the first thing we do is create/update the project
    const featuredImage = editor.view.featuredImage;
    delete editor.view.featuredImage;

    // convert back to an entity
    const entity = editorToProject(editor, this.context.portal);

    // handle metrics
    const _metric = editor._metric;

    // if we have a current metric and it's beyond the default empty from toEditor
    if (_metric && Object.keys(_metric).length) {
      let metricId = editorContext?.metricId;

      // creating a new metric
      if (!metricId) {
        metricId = createId(camelize(`${editor._metric.cardTitle}_`));
      }

      // transform editor values into metric and displayConfig
      const { metric, displayConfig } = editorToMetric(
        editor._metric,
        metricId,
        {
          metricName: editor._metric.cardTitle,
          entityInfo: {
            id: entity.id,
            name: entity.name,
            type: entity.type,
          },
        }
      );

      // put metric and display config onto entity
      this.entity = setMetricAndDisplay(this.entity, metric, displayConfig);
    }

    // create it if it does not yet exist...
    if (isCreate) {
      // this allows the featured image functions to work
      this.entity = await createProject(
        entity,
        this.context.userRequestOptions
      );
    } else {
      // ...otherwise, update the in-memory entity and save it
      this.entity = entity;
      await this.save();
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
    if (isCreate) {
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
