import {
  cloneObject,
  IArcGISContext,
  IEditorConfig,
  IEntityEditorContext,
} from "..";
import { IHubUser, IWithEditorBehavior } from "../core";
import { UserEditorType } from "./_internal/UserSchema";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { enrichEntity } from "../core/enrichEntity";

export class HubUser implements IWithEditorBehavior {
  protected context: IArcGISContext;
  protected entity: IHubUser;
  protected isDestroyed = false;

  private constructor(user: IHubUser, context: IArcGISContext) {
    this.entity = user;
    this.context = context;
  }

  /**
   * Create an instance from an IHubUser object
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
    const DEFAULT_USER = {};
    // extend the partial over the defaults
    return { ...DEFAULT_USER, ...partialUser } as IHubUser;
  }

  /** Save the HubGroup to the backing store */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    // if (this.entity.id) {
    //   // update it
    //   this.entity = await updateHubGroup(
    //     this.entity,
    //     this.context.userRequestOptions
    //   );
    // } else {
    //   // create it
    //   this.entity = await createHubGroup(
    //     this.entity,
    //     this.context.userRequestOptions
    //   );
    // }
    return;
  }

  /*
   * Get the editor config for the HubUser entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   */
  async getEditorConfig(
    i18nScope: string,
    type: UserEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

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

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor

    return editor;
  }

  async fromEditor(editor: IHubUser): Promise<IHubUser> {
    const entity = cloneObject(editor) as IHubUser;

    // save or create group
    this.entity = entity;
    await this.save();

    return this.entity;
  }
}
