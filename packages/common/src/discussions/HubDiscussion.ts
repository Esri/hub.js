import { DEFAULT_DISCUSSION } from "./defaults";
import type { IArcGISContext } from "../types/IArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { fetchDiscussion } from "./fetch";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEditorConfig } from "../core/schemas/types";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { cloneObject } from "../util";
import { DiscussionEditorType } from "./_internal/DiscussionSchema";
import { enrichEntity } from "../core/enrichEntity";
import { getEditorSlug } from "../core/_internal/getEditorSlug";
import { truncateSlug } from "../items/_internal/slugs";
import { IWithSharingBehavior } from "../core/behaviors/IWithSharingBehavior";
import { IWithStoreBehavior } from "../core/behaviors/IWithStoreBehavior";
import { IEntityEditorContext } from "../core/types/HubEntityEditor";
import {
  IHubDiscussion,
  IHubDiscussionEditor,
} from "../core/types/IHubDiscussion";
import { IHubLocation } from "../core/types/IHubLocation";

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
    // TODO: Ideally we should delegate out to the
    // hubItemEntityFromEditor util to handle shared
    // "fromEditor" logic; however, when I attempted
    // to do this, I ran into issues with circular
    // dependencies and test failures that felt out
    // of scope for this work. For now, we'll copy
    // the relevant logic here.

    // 1. extract the ephemeral props we graft onto the
    // editor for later user
    const _thumbnail = editor._thumbnail as { blob?: Blob; fileName?: string };
    const _slug = editor._slug;

    // 2. remove the ephemeral props we graft onto the editor
    delete editor._thumbnail;
    delete editor._slug;

    const entity = cloneObject(editor) as IHubDiscussion;

    // 3. ensure orgUrlKey is set
    entity.orgUrlKey = editor.orgUrlKey
      ? (editor.orgUrlKey as string)
      : (this.context.portal.urlKey as string) || ("" as string);

    // ensure orgUrlKey is lowercase
    if (entity.orgUrlKey) {
      entity.orgUrlKey = entity.orgUrlKey.toLowerCase();
    }

    // 4. copy the configured location extent up one level
    // on the entity.
    entity.extent = (editor.location as IHubLocation)?.extent;

    // 5. Perform pre-save operations using the ephemeral
    // properties that were extracted above.

    // a. ensure the slug is truncated
    if (_slug) {
      // ensure the slug is truncated
      entity.slug = truncateSlug(_slug, entity.orgUrlKey);
    } else {
      // if no slug is passed in, save an empty string as
      // the slug, so that it is not saved as the orgUrlKey
      // truncated with an empty string
      entity.slug = "";
    }

    // b. conditionally set the thumbnailCache to
    // ensure that the configured thumbnail is updated
    // on the next save
    if (_thumbnail) {
      if (_thumbnail.blob) {
        this.thumbnailCache = {
          file: _thumbnail.blob,
          filename: _thumbnail.fileName,
          clear: false,
        };
      } else {
        this.thumbnailCache = {
          clear: true,
        };
      }
    }

    // Save, which will also create new content if new
    this.entity = entity;
    await this.save();

    return this.entity;
  }
}
