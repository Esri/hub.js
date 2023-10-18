import { HubItemEntity } from "../core/HubItemEntity";
import {
  IHubInitiativeTemplate,
  IWithCatalogBehavior,
  IWithCardBehavior,
  IConvertToCardModelOpts,
  IHubCardViewModel,
  IEntityEditorContext,
  IHubInitiativeTemplateEditor,
  HubEntity,
  IEditorConfig,
} from "../core";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { EntityEditorType } from "../core/schemas/types";

import { IArcGISContext } from "..";
import { Catalog } from "../search";
import { DEFAULT_INITIATIVE_TEMPLATE } from "./defaults";
import { fetchInitiativeTemplate } from "./fetch";
import { initiativeTemplateToCardModel } from "./view";
import { cloneObject } from "../util";
import {
  createInitiativeTemplate,
  editorToInitiativeTemplate,
  updateInitiativeTemplate,
  deleteInitiativeTemplate,
} from "./edit";
import { enrichEntity } from "../core/enrichEntity";

/**
 * Hub Initiative Template Class
 */
export class HubInitiativeTemplate
  extends HubItemEntity<IHubInitiativeTemplate>
  implements IWithCatalogBehavior, IWithEditorBehavior, IWithCardBehavior
{
  private _catalog: Catalog;

  private constructor(
    initiativeTemplate: IHubInitiativeTemplate,
    context: IArcGISContext
  ) {
    super(initiativeTemplate, context);
    this._catalog = Catalog.fromJson(initiativeTemplate.catalog, this.context);
  }

  get catalog(): Catalog {
    return this._catalog;
  }

  /**
   * Create an instance from an IHubInitiativeTemplate object
   * @param json - JSON object to create a HubInitiativeTemplate from
   * @param context - ArcGIS context
   * @returns - instance of HubInitiativeTemplate
   */
  static fromJson(
    json: Partial<IHubInitiativeTemplate>,
    context: IArcGISContext
  ): HubInitiativeTemplate {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubInitiativeTemplate(pojo, context);
  }

  /**
   * Create a new HubInitiativeTemplate, returning a HubInitiativeTemplate instance.
   * Note: This does not persist the HubInitiativeTemplate into the backing store
   * @param partialInitiativeTemplate
   * @param context
   * @param save
   * @returns
   */
  static async create(
    partialInitiativeTemplate: Partial<IHubInitiativeTemplate>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubInitiativeTemplate> {
    const pojo = this.applyDefaults(partialInitiativeTemplate, context);
    // return an instance of HubInitiativeTemplate
    const instance = HubInitiativeTemplate.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a HubInitiativeTemplate from the backing store and return a HubInitiativeTemplate instance.
   * @param identifier - Identifier of the initiative template to load
   * @param context
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubInitiativeTemplate> {
    // fetch the initiative template by id or slug
    try {
      const initiativeTemplate = await fetchInitiativeTemplate(
        identifier,
        context.requestOptions
      );
      // create an instance of HubInitiativeTemplate from the initiative template
      return HubInitiativeTemplate.fromJson(initiativeTemplate, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Initiative Template not found.`);
      } else {
        throw ex;
      }
    }
  }

  /**
   * Given a partial initiative template, apply defaults to it to ensure that a baseline of properties are set
   * @param partialInitiativeTemplate
   * @param context
   * @returns
   */
  private static applyDefaults(
    partialInitiativeTemplate: Partial<IHubInitiativeTemplate>,
    context: IArcGISContext
  ): IHubInitiativeTemplate {
    // ensure we have the orgUrlKey
    if (!partialInitiativeTemplate.orgUrlKey) {
      partialInitiativeTemplate.orgUrlKey = context.portal.urlKey;
    }
    const pojo = {
      ...DEFAULT_INITIATIVE_TEMPLATE,
      ...partialInitiativeTemplate,
    } as IHubInitiativeTemplate;
    return pojo;
  }

  /**
   * Convert the project entity into a card view model that can
   * be consumed by the suite of hub gallery components
   * @param opts - view model options
   * @returns
   */
  convertToCardModel(opts?: IConvertToCardModelOpts): IHubCardViewModel {
    return initiativeTemplateToCardModel(this.entity, this.context, opts);
  }

  /**
   * Get the editor config for the HubInitiativeTemplate entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type -- corresponds to the returned uiSchema
   */
  async getEditorConfig(
    i18nScope: string,
    type: EntityEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the initiative template as an editor object
   * @param editorContext
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubInitiativeTemplateEditor> {
    // cast the entity to its editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubInitiativeTemplateEditor)
      : (cloneObject(this.entity) as IHubInitiativeTemplateEditor);

    // for now, just return
    return editor;
  }

  /**
   * Load the initiative template from the editor object
   * @param editor
   */
  async fromEditor(editor: IHubInitiativeTemplateEditor): Promise<HubEntity> {
    // Setting the thumbnailCache will ensure that the thumbnail is updated on next save
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

    const entity = editorToInitiativeTemplate(editor, this.context.portal);

    // save, which will also create an entity if we don't have an id for it
    this.entity = entity;
    await this.save();

    return this.entity;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubInitiativeTemplate>): void {
    if (this.isDestroyed) {
      throw new Error("HubInitiativeTemplate is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };

    // update internal instances
    if (changes.catalog) {
      this._catalog = Catalog.fromJson(this.entity.catalog, this.context);
    }
  }

  /**
   * Save the HubInitiativeTemplate to the backing store.
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubInitiativeTemplate is already destroyed.");
    }
    // get the catalog and permission configs
    this.entity.catalog = this._catalog.toJson();

    if (this.entity.id) {
      // update it
      this.entity = await updateInitiativeTemplate(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createInitiativeTemplate(
        this.entity,
        this.context.userRequestOptions
      );
    }
    // call the after save hook on superclass
    await super.afterSave();
  }

  /**
   * Delete the HubInitiativeTemplate from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubInitiativeTemplate is already destroyed.");
    }
    this.isDestroyed = true;
    await deleteInitiativeTemplate(
      this.entity.id,
      this.context.userRequestOptions
    );
  }
}
