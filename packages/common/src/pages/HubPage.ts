import {
  DEFAULT_PAGE,
  ENTERPRISE_PAGE_ITEM_TYPE,
  HUB_PAGE_ITEM_TYPE,
} from "./defaults";
import { EditorType } from "../core/schemas/types";
import {
  IHubPage,
  IWithStoreBehavior,
  IWithSharingBehavior,
  UiSchemaElementOptions,
  IHubPageEditor,
  IEntityEditorContext,
} from "../core";

import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { getEntityEditorSchemas } from "../core/schemas/getEntityEditorSchemas";
import { IArcGISContext } from "../ArcGISContext";
import { HubItemEntity } from "../core/HubItemEntity";
import {
  IEditorConfig,
  IWithEditorBehavior,
} from "../core/behaviors/IWithEditorBehavior";

import { createPage, deletePage, fetchPage, updatePage } from "./HubPages";

import { PageEditorType } from "./_internal/PageSchema";
import { cloneObject } from "../util";

/*
  TODO:
  - when creating a site, we currently do some stuff we probably don't want to do anymore:
    - protect the item
    - allow for uploading assets - i think this is not used
    - sharing to the collaboration group if it exists
*/

/**
 * Hub Page Class
 * NOTE: This is a minimal implementation.
 */
export class HubPage
  extends HubItemEntity<IHubPage>
  implements
    IWithStoreBehavior<IHubPage>,
    IWithSharingBehavior,
    IWithEditorBehavior
{
  /**
   * Private constructor so we don't have `new` all over the place. Allows for
   * more flexibility in how we create the HubPageManager over time.
   * @param context
   */
  private constructor(page: IHubPage, context: IArcGISContext) {
    super(page, context);
  }

  /**
   * Create an instance from an IHubPage object
   * @param json - JSON object to create a HubPage from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(json: Partial<IHubPage>, context: IArcGISContext): HubPage {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubPage(pojo, context);
  }

  /**
   *
   * Create a new HubPage, returning a HubPage instance.
   * By default, this does not save the page to the backing store.
   * @param partialPage
   * @param context
   * @returns
   */
  static async create(
    partialPage: Partial<IHubPage>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubPage> {
    const pojo = this.applyDefaults(partialPage, context);
    // return an instance of HubPage
    const instance = HubPage.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Page from the backing store and return a HubPage instance.
   * @param identifier - Identifier of the page to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubPage> {
    // fetch the page by id or slug
    try {
      const page = await fetchPage(identifier, context.hubRequestOptions);
      // create an instance of HubPage from the page
      return HubPage.fromJson(page, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "CONT_0001: Item does not exist or is inaccessible."
      ) {
        throw new Error(`Page not found.`);
      } else {
        throw ex;
      }
    }
  }

  static async getEditorConfig(
    i18nScope: string,
    type: PageEditorType,
    options: UiSchemaElementOptions[] = []
  ): Promise<IEditorConfig> {
    return getEntityEditorSchemas(i18nScope, type, options);
  }

  private static applyDefaults(
    partialPage: Partial<IHubPage>,
    context: IArcGISContext
  ): IHubPage {
    // ensure we have the orgUrlKey
    if (!partialPage.orgUrlKey) {
      partialPage.orgUrlKey = context.portal.urlKey;
    }
    // extend the partial over the defaults
    const pojo = { ...DEFAULT_PAGE, ...partialPage } as IHubPage;
    pojo.type = context.isPortal
      ? ENTERPRISE_PAGE_ITEM_TYPE
      : HUB_PAGE_ITEM_TYPE;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubPage>): void {
    if (this.isDestroyed) {
      throw new Error("HubPage is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the HubPage to the backing store.
   * Currently Pages are stored as Items in Portal
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubPage is already destroyed.");
    }

    if (this.entity.id) {
      // update it
      this.entity = await updatePage(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createPage(
        this.entity,
        this.context.userRequestOptions
      );
    }
    // call the after save hook on superclass
    await super.afterSave();

    return;
  }

  /**
   * Delete the HubPage from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubPage is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deletePage(this.entity.id, this.context.userRequestOptions);
  }
  /*
   * Get the editor config for the HubProject entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: EditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the project as an editor object
   * @param editorContext
   * @returns
   */
  toEditor(editorContext: IEntityEditorContext = {}): IHubPageEditor {
    // Cast the entity to it's editor
    const editor = cloneObject(this.entity) as IHubPageEditor;

    // Add other transforms here...
    return editor;
  }

  /**
   * Load the project from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubPageEditor): Promise<IHubPage> {
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
    const entity = cloneObject(editor) as IHubPage;

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
}
