import { DEFAULT_DISCUSSION } from "./defaults";
import { IWithSharingBehavior, IWithStoreBehavior } from "../core/behaviors";
import type { IArcGISContext } from "../types/IArcGISContext";
import {
  IEntityEditorContext,
  IHubDiscussion,
  IHubDiscussionEditor,
} from "../core/types";
import { HubItemEntity } from "../core/HubItemEntity";
import { fetchDiscussion } from "./fetch";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEditorConfig } from "../core/schemas/types";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { cloneObject } from "../util";
import { DiscussionEditorType } from "./_internal/DiscussionSchema";
import { enrichEntity } from "../core/enrichEntity";
import { getEditorSlug } from "../core/_internal/getEditorSlug";
import { hubItemEntityFromEditor } from "../core/_internal/hubItemEntityFromEditor";
import { setProp } from "../objects";

/**
 * Hub Discussion Class
 */

export class HubDiscussion
  extends HubItemEntity<IHubDiscussion>
  implements
    IWithStoreBehavior<IHubDiscussion>,
    IWithSharingBehavior,
    IWithEditorBehavior
{
  /**
   * Create an instance from an IHubDiscussion object
   * @param json JSON object to create a HubDiscussion from
   * @param context ArcGIS context
   * @returns a HubDiscussion
   */
  static fromJson(
    json: Partial<IHubDiscussion>,
    context: IArcGISContext
  ): HubDiscussion {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubDiscussion(pojo, context);
  }

  /**
   * Create a new HubDiscussion, returning a HubDiscussion instance.
   * Note: This does not persist the Discussion into the backing store
   * @param partialDiscussion a partial IHubDiscussion
   * @param context ArcGIS context
   * @returns promise that resolves a HubDiscussion
   */
  static async create(
    partialDiscussion: Partial<IHubDiscussion>,
    context: IArcGISContext,
    save = false
  ): Promise<HubDiscussion> {
    const pojo = this.applyDefaults(partialDiscussion, context);
    // return an instance of HubDiscussion
    const instance = HubDiscussion.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Discussion from the backing store and return a HubDiscussion instance.
   * @param identifier slug or item id
   * @param context ArcGIS context
   * @returns promise that resolves a HubDiscussion
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubDiscussion> {
    try {
      const entity = await fetchDiscussion(
        identifier,
        context.hubRequestOptions
      );
      // create an instance of HubDiscussion from the entity
      return HubDiscussion.fromJson(entity, context);
    } catch (ex) {
      throw (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
        ? new Error("Discussion not found.")
        : ex;
    }
  }

  private static applyDefaults(
    partialDiscussion: Partial<IHubDiscussion>,
    context: IArcGISContext
  ): IHubDiscussion {
    // ensure we have the orgUrlKey
    if (!partialDiscussion.orgUrlKey) {
      partialDiscussion.orgUrlKey = context.portal.urlKey as string;
    }
    // extend the partial over the defaults
    const pojo = {
      ...DEFAULT_DISCUSSION,
      ...partialDiscussion,
    } as IHubDiscussion;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes A partial IHubDiscussion
   */
  update(changes: Partial<IHubDiscussion>): void {
    if (this.isDestroyed) {
      throw new Error("HubDiscussion is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubDiscussion is already destroyed.");
    }

    if (this.entity.id) {
      const { updateDiscussion } = await import("./edit");
      // update it
      this.entity = await updateDiscussion(
        this.entity,
        this.context.hubRequestOptions
      );
    } else {
      const { createDiscussion } = await import("./edit");
      // create it
      this.entity = await createDiscussion(
        this.entity,
        this.context.hubRequestOptions
      );
    }

    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubDiscussion from the store
   * set a flag to indicate that it is destroyed
   * @returns a promise
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubDiscussion is already destroyed.");
    }
    const { deleteDiscussion } = await import("./edit");
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteDiscussion(this.entity.id, this.context.hubRequestOptions);
  }

  /*
   * Get the editor config for the HubDiscussion entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: DiscussionEditorType
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
    _editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubDiscussionEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubDiscussionEditor)
      : (cloneObject(this.entity) as IHubDiscussionEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    editor._slug = getEditorSlug(this.entity);
    return editor;
  }

  /**
   * Load the project from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubDiscussionEditor): Promise<IHubDiscussion> {
    // delegate to an item-specific fromEditor util to
    // handle shared "fromEditor" logic
    const res = await hubItemEntityFromEditor(editor, this.context);
    Object.entries(res).forEach(([key, value]) => {
      setProp(key, value, this);
    });

    // Save, which will also create new content if new
    await this.save();

    return this.entity;
  }
}
