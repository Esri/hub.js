import { IEntityEditorContext, IHubUser } from "../core/types";
import { IArcGISContext } from "../ArcGISContext";
import {
  EditorType,
  getEditorConfig,
  IEditorConfig,
  IWithEditorBehavior,
} from "../core";
import { enrichEntity } from "../core/enrichEntity";
import { cloneObject } from "../util";
import { UserEditorType } from "./_internal/UserSchema";

export class HubUser implements IWithEditorBehavior {
  protected context: IArcGISContext;
  protected entity: IHubUser;
  protected isDestroyed = false;

  private constructor(user: IHubUser, context: IArcGISContext) {
    this.entity = user;
    this.context = context;
  }

  /**
   * Create an instance from a IHubUser object
   * @param json - JSON object to create a HubProject from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(json: Partial<IHubUser>, context: IArcGISContext): HubUser {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json);
    return new HubUser(pojo, context);
  }

  private static applyDefaults(partialUser: Partial<IHubUser>): IHubUser {
    // TODO: move to defaults
    const DEFAULT_USER = {};
    return { ...DEFAULT_USER, ...partialUser } as IHubUser;
  }

  /**
   * Save the HubUser to the backing store
   * TODO: fill this out
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubUser is already destroyed. ");
    }

    return;
  }

  /**
   * Get the editor config for the HubUser entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresponds to the returned uiSchema
   */
  async getEditorConfig(
    i18nScope: string,
    type: UserEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Transforms entity values into editor values
   * @param editorContext
   * @param include
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubUser> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubUser)
      : (cloneObject(this.entity) as IHubUser);

    // 2. Apply transforms to relevant entity values
    // so they can be consumed by editor

    return editor;
  }

  /**
   * Transforms editor values into entity values
   * @param editor
   */
  async fromEditor(editor: IHubUser): Promise<IHubUser> {
    const entity = cloneObject(editor) as IHubUser;

    // save user
    this.entity = entity;
    await this.save();

    return this.entity;
  }
}
