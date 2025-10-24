import type { IArcGISContext } from "../types/IArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IEditorConfig } from "../core/schemas/types";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
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
import { enrichEntity } from "../core/enrichEntity";
import { shouldShowDownloadsConfiguration } from "./_internal/shouldShowDownloadsConfiguration";
import { getDownloadConfigurationDisplayFormats } from "../downloads/_internal/getDownloadConfigurationDisplayFormats";

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
        this.context.hubRequestOptions
      );
    } else {
      // create it
      this.entity = await createContent(
        this.entity,
        this.context.hubRequestOptions
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
    await deleteContent(this.entity.id, this.context.hubRequestOptions);
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
  async toEditor(
    _editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubContentEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubContentEditor)
      : (cloneObject(this.entity) as IHubContentEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    if (
      shouldShowDownloadsConfiguration(
        this.entity,
        this.context.hubRequestOptions
      )
    ) {
      editor.downloadFormats = getDownloadConfigurationDisplayFormats(
        this.entity
      );
    }
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
      const thumb = editor._thumbnail as { blob?: Blob; fileName?: string };
      if (thumb.blob) {
        this.thumbnailCache = {
          file: thumb.blob,
          filename: thumb.fileName,
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
    entity.extent =
      (editor as { location?: { extent?: number[][] } }).location?.extent ?? [];

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
  private _checkDestroyed(): void {
    if (this.isDestroyed) {
      throw new Error("HubContent is already destroyed.");
    }
  }
}
