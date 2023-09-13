import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";

import {
  IEditorConfig,
  IWithEditorBehavior,
} from "../core/behaviors/IWithEditorBehavior";
import {
  IHubContentEditor,
  IHubEditableContent,
} from "../core/types/IHubEditableContent";
import { IWithStoreBehavior } from "../core/behaviors/IWithStoreBehavior";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEntityEditorContext } from "../core/types/HubEntityEditor";
import { cloneObject } from "../util";
import { editorToContent } from "./edit";
import { ContentEditorType } from "./_internal/ContentSchema";

export class HubContent
  extends HubItemEntity<IHubEditableContent>
  implements IWithStoreBehavior<IHubEditableContent>, IWithEditorBehavior
{
  private constructor(content: IHubEditableContent, context: IArcGISContext) {
    super(content, context);
  }

  /**
   * Create an instance from an IHubEditableContent object
   * @param json - JSON object to create a HubContent from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubEditableContent>,
    context?: IArcGISContext
  ): HubContent {
    // TODO: merge what we have with the default values
    // const pojo = this.applyDefaults(json, context);
    const pojo = json as IHubEditableContent;
    return new HubContent(pojo, context);
  }

  /**
   * Save the HubContent to the backing store. Currently Projects are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    this._checkDestroyed();
    const { createContent, updateContent } = await import("./edit");

    if (this.entity.id) {
      // update it
      this.entity = await updateContent(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createContent(
        this.entity,
        this.context.userRequestOptions
      );
    }
    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubEditableContent>): void {
    this._checkDestroyed();
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Delete the HubContent from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    this._checkDestroyed();
    this.isDestroyed = true;
    const { deleteContent } = await import("./edit");
    // Delegate to module fn
    await deleteContent(this.entity.id, this.context.userRequestOptions);
  }

  /*
   * Get the editor config for the HubProject entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: ContentEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the project as an editor object
   * @param editorContext
   * @returns
   */
  toEditor(editorContext: IEntityEditorContext = {}): IHubContentEditor {
    // Cast the entity to it's editor
    const editor = cloneObject(this.entity) as IHubContentEditor;

    // Add other transforms here...
    // NOTE: Be sure to add tests for any transforms in the test suite
    return editor;
  }

  /**
   * Load the project from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubContentEditor): Promise<IHubEditableContent> {
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

    // convert back to an entity. Apply any reverse transforms used in
    // of the toEditor method
    const entity = editorToContent(editor, this.context.portal);

    // copy the location extent up one level
    entity.extent = editor.location?.extent;

    // create it if it does not yet exist...
    if (isCreate) {
      throw new Error("Cannot create content using the Editor.");
    } else {
      // ...otherwise, update the in-memory entity and save it
      this.entity = entity;
      await this.save();
    }

    return this.entity;
  }

  // TODO: move this to HubItemEntity
  private _checkDestroyed() {
    if (this.isDestroyed) {
      throw new Error("HubContent is already destroyed.");
    }
  }
}
