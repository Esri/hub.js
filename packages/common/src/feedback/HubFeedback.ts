import {
  HubEntity,
  HubEntityEditor,
  IArcGISContext,
  IEditorConfig,
  IEntityEditorContext,
  IHubFeedbackEditor,
  IWithEditorBehavior,
  cloneObject,
} from "..";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubFeedback } from "../core/types";
import { FeedbackEditorType } from "./_internal/FeedbackSchema";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { deleteFeedback } from "./edit";
import { updateFeedback } from "./edit";
import { enrichEntity } from "../core/enrichEntity";

export class HubFeedback
  extends HubItemEntity<IHubFeedback>
  implements IWithEditorBehavior
{
  /**
   * Apply a new state to the instance
   * @param changes A partial IHubFeedback
   */
  update(changes: Partial<IHubFeedback>): void {
    if (this.isDestroyed) {
      throw new Error("HubFeedback is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the class instance
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubFeedback is already destroyed.");
    }

    if (this.entity.id) {
      // update it
      this.entity = await updateFeedback(
        this.entity,
        this.context.userRequestOptions
      );
    }

    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubFeedback object from the store
   * set a flag to indicate that it is destroyed
   * @returns a promise
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubFeedback is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteFeedback(this.entity.id, this.context.userRequestOptions);
  }

  /*
   * Get the editor config for the HubFeedback entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   */
  getEditorConfig(
    i18nScope: string,
    type: FeedbackEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the feedback object as an editor object
   * @param editorContext
   * @param include
   * @returns
   */
  async toEditor(
    editorContext: IEntityEditorContext,
    include?: string[]
  ): Promise<HubEntityEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubFeedbackEditor)
      : (cloneObject(this.entity) as IHubFeedbackEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    return editor;
  }

  /**
   * Load the feedback object from the editor object
   * @param editor
   * @param editorContext
   * @returns IHubFeedback
   */
  async fromEditor(
    editor: HubEntityEditor,
    editorContext?: IEntityEditorContext
  ): Promise<HubEntity> {
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

    // convert back to an entity. Apply any reverse transforms used in
    // of the toEditor method
    const entity = cloneObject(editor) as IHubFeedback;

    // copy the location extent up one level
    entity.extent = editor.location?.extent;

    // Save, which will also create new content if new
    this.entity = entity;
    await this.save();

    return this.entity;
  }
}
