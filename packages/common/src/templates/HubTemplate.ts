import { IArcGISContext } from "../ArcGISContext";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEditorConfig } from "../core/behaviors/IWithEditorBehavior";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubTemplate, IHubTemplateEditor } from "../core/types/IHubTemplate";
import { TemplateEditorType } from "./_internal/TemplateSchema";
import { DEFAULT_TEMPLATE } from "./defaults";
import {
  createTemplate,
  deleteTemplate,
  editorToTemplate,
  updateTemplate,
} from "./edit";
import { fetchTemplate } from "./fetch";
import { IEntityEditorContext } from "../core/types";
import { enrichEntity } from "../core/enrichEntity";
import { cloneObject } from "../util";

/**
 * Hub Template Class - this class encapsulates the standard
 * operations for a "Solution" item despite the Hub team not
 * "owning" this item type. Our primary goal is to allow
 * editing of the item's meta information, manage sharing, etc.
 */
export class HubTemplate extends HubItemEntity<IHubTemplate> {
  /**
   * Private constructor to allow for future
   * template-specific logic
   * @param template
   * @param context
   */
  private constructor(template: IHubTemplate, context: IArcGISContext) {
    super(template, context);
  }

  /**
   * Create an HubTemplate instance from an IHubTemplate object
   * @param json - JSON object to create a HubTemplate from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(
    json: Partial<IHubTemplate>,
    context: IArcGISContext
  ): HubTemplate {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubTemplate(pojo, context);
  }

  /**
   * Create a new HubTemplate, returning a HubTemplate instance.
   * This does not automatically persist the Template into
   * the backing store unless save is set to true
   *
   * NOTE: we have no immediate plans to allow template creation
   * from the context of the Hub application, but scaffolding this
   * method for potential future implementation. The underlying
   * createTemplate function will throw an error if attempted.
   * @param partialTemplate
   * @param context
   * @param save
   */
  static async create(
    partialTemplate: Partial<IHubTemplate>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubTemplate> {
    const pojo = this.applyDefaults(partialTemplate, context);
    const instance = HubTemplate.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a HubTemplate from the backing store and return
   * a HubTemplate instance
   * @param identifier
   * @param context
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubTemplate> {
    try {
      const initiativeTemplate = await fetchTemplate(
        identifier,
        context.requestOptions
      );
      return HubTemplate.fromJson(initiativeTemplate, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Template ${identifier} not found.`);
      } else {
        throw ex;
      }
    }
  }

  /**
   * Given a partial Template, apply defaults to
   * it to ensure that a baseline of properties are set
   * @param partialTemplate
   * @param context
   */
  private static applyDefaults(
    partialTemplate: Partial<IHubTemplate>,
    context: IArcGISContext
  ): IHubTemplate {
    // ensure we have the orgUrlKey
    if (!partialTemplate.orgUrlKey) {
      partialTemplate.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_TEMPLATE, ...partialTemplate } as IHubTemplate;
    return pojo;
  }

  /*
   * Get a specific editor config for the HubTemplate entity.
   * @param i18nScope
   * @param type
   */
  async getEditorConfig(
    i18nScope: string,
    type: TemplateEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Transform template entity into an editor object
   * @param editorContext
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubTemplateEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubTemplateEditor)
      : (cloneObject(this.entity) as IHubTemplateEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor

    return editor;
  }

  /**
   * Transform editor values into a template entity
   * @param editor
   */
  async fromEditor(editor: IHubTemplateEditor): Promise<IHubTemplate> {
    // Setting the thumbnailCache will ensure that the
    // thumbnail is updated on the next save
    if (editor._thumbnail) {
      if (editor._thumbnail.blob) {
        this.thumbnailCache = {
          file: editor._thumbnail.blob,
          filename: editor._thumbnail.filename,
          clear: false,
        };
      } else {
        this.thumbnailCache = {
          clear: true,
        };
      }
    }

    delete editor._thumbnail;

    const entity = editorToTemplate(editor, this.context.portal);

    // save, which will also create
    this.entity = entity;
    await this.save();

    return this.entity;
  }

  /**
   * Update the instance's internal entity state
   * @param changes
   */
  update(changes: Partial<IHubTemplate>): void {
    if (this.isDestroyed) {
      throw new Error("HubTemplate is already destroyed.");
    }

    this.entity = { ...this.entity, ...changes };
  }

  /** Save the HubTemplate to the backing store */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubTemplate is already destroyed.");
    }

    // 1. create or update. Note: the underlying createTemplate
    // function will throw an error because we don't currently
    // allow for template creation from the context of Hub
    this.entity = this.entity.id
      ? await updateTemplate(this.entity, this.context.userRequestOptions)
      : await createTemplate(this.entity, this.context.userRequestOptions);

    // 2. call the after save hook on HubItemEntity superclass
    await super.afterSave();
  }

  /**
   * Delete the Hub Template's backing item and set a flag
   * indicating it's been destroyed
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubTemplate is already destroyed.");
    }

    this.isDestroyed = true;
    await deleteTemplate(this.entity.id, this.context.userRequestOptions);
  }
}
