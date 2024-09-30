import { IEntityEditorContext, IHubUser } from "../core/types";
import { IArcGISContext } from "../ArcGISContext";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { IEditorConfig } from "../core/schemas/types";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { enrichEntity } from "../core/enrichEntity";
import { cloneObject } from "../util";
import { UserEditorType } from "./_internal/UserSchema";
import { DEFAULT_USER } from "./defaults";
import { updateUserCommunityOrgSettings } from "../utils/internal/updateCommunityOrgSettings";

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
   * @returns HubUser
   */
  static fromJson(json: Partial<IHubUser>, context: IArcGISContext): HubUser {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json);
    return new HubUser(pojo, context);
  }

  /**
   * Given a partial user object, apply defaults to it to ensure that a baseline of properties are set
   * @param partialUser
   * @returns IHubUser
   */
  private static applyDefaults(partialUser: Partial<IHubUser>): IHubUser {
    return { ...DEFAULT_USER, ...partialUser } as IHubUser;
  }

  /**
   * Method that returns the entity as a JSON object
   * We have this on the EntityItem class, but we don't implement that here
   * @returns IHubUser
   */
  toJson(): IHubUser {
    return cloneObject(this.entity);
  }

  /**
   * Save the HubUser to the backing store.
   *
   * Note that Hub does not currently support the creation of users,
   * so this function should only be used for updating users.
   *
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubUser is already destroyed.");
    }
    // 1. update user hub settings
    await this.context.updateUserHubSettings(this.entity.settings);

    // 2. update portal signin settings
    // TODO in later story -- note that there will need to be a
    // check for if the user is an org admin -- they cannot
    // POST to necessary endpoints if not
    if (
      this.context?.isCommunityOrg &&
      this.context?.currentUser?.role === "org_admin"
    ) {
      await updateUserCommunityOrgSettings(
        this.entity.hubOrgSettings,
        this.context
      );
    }

    // 3. update portal settings
    // TODO in later story

    return;
  }

  /**
   * Delete the HubUser from the store
   * set a flag to indicate that it is destroyed
   *
   * Note that Hub does not currently support the deletion of users,
   * so this function should not be used as of now.
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubUser is already destroyed.");
    }
    // TODO: implement delete here when we want this functionality
    this.isDestroyed = true;
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
