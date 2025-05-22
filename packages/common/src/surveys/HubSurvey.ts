import type { IArcGISContext } from "../types/IArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { enrichEntity } from "../core/enrichEntity";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEditorConfig } from "../core/schemas/types";
import { DEFAULT_SURVEY } from "./defaults";
import {
  HubEntityEditor,
  IEntityEditorContext,
} from "../core/types/HubEntityEditor";
import { IHubSurvey, IHubSurveyEditor } from "../core/types/IHubSurvey";
import { cloneObject } from "../util";
import { SurveyEditorType } from "./_internal/SurveySchema";
import { deleteSurvey, updateSurvey } from "./edit";
import { fetchSurvey } from "./fetch";

/**
 * Hub Survey Class
 */
export class HubSurvey
  extends HubItemEntity<IHubSurvey>
  implements IWithEditorBehavior
{
  /**
   * Create an instance from a HubSurvey object
   * @param json - JSON object to create a HubSurvey from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubSurvey>,
    context: IArcGISContext
  ): HubSurvey {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubSurvey(pojo, context);
  }

  /**
   * Fetch a Survey from the backing store and return a HubSurvey instance.
   * @param identifier - Identifier of the survey to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubSurvey> {
    // fetch the survey by id
    try {
      const survey = await fetchSurvey(identifier, context.userRequestOptions);
      // create an instance of HubSurvey from the survey
      return HubSurvey.fromJson(survey, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Survey not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(
    partialSurvey: Partial<IHubSurvey>,
    context: IArcGISContext
  ): IHubSurvey {
    // ensure we have the orgUrlKey
    if (!partialSurvey.orgUrlKey) {
      partialSurvey.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_SURVEY, ...partialSurvey } as IHubSurvey;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes A partial IHubSurvey
   */
  update(changes: Partial<IHubSurvey>): void {
    if (this.isDestroyed) {
      throw new Error("HubSurvey is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the class instance
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubSurvey is already destroyed.");
    }

    if (this.entity.id) {
      // update it
      this.entity = await updateSurvey(
        this.entity,
        this.context.userRequestOptions
      );
    }

    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubSurvey object from the store
   * set a flag to indicate that it is destroyed
   * @returns a promise
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubSurvey is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteSurvey(this.entity.id, this.context.userRequestOptions);
  }

  /*
   * Get the editor config for the HubSurvey entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   */
  getEditorConfig(
    i18nScope: string,
    type: SurveyEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the Survey object as an editor object
   * @param editorContext
   * @param include
   * @returns
   */
  async toEditor(
    editorContext?: IEntityEditorContext,
    include: string[] = []
  ): Promise<HubEntityEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubSurveyEditor)
      : (cloneObject(this.entity) as IHubSurveyEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor
    return editor;
  }

  /**
   * Load the Survey object from the editor object
   * @param editor
   * @param editorContext
   * @returns IHubSurvey
   */
  async fromEditor(
    editor: HubEntityEditor,
    _editorContext?: IEntityEditorContext
  ): Promise<IHubSurvey> {
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
    const entity = cloneObject(editor) as IHubSurvey;

    // copy the location extent up one level
    entity.extent =
      (editor as { location?: { extent?: number[][] } }).location?.extent ?? [];

    // Save, which will also create new content if new
    this.entity = entity;
    await this.save();

    return this.entity;
  }
}
