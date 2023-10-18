import {
  createHubGroup,
  updateHubGroup,
  fetchHubGroup,
  deleteHubGroup,
} from "./HubGroups";
import { convertHubGroupToGroup } from "./_internal/convertHubGroupToGroup";
import { IHubGroup, IHubGroupEditor } from "../core/types/IHubGroup";
import { DEFAULT_GROUP } from "./defaults";
import {
  IEntityPermissionPolicy,
  IPermissionAccessResponse,
  Permission,
  addPermissionPolicy,
  checkPermission,
  removePermissionPolicy,
} from "../permissions";
import { IWithStoreBehavior } from "../core/behaviors/IWithStoreBehavior";
import { IWithPermissionBehavior } from "../core/behaviors/IWithPermissionBehavior";
import { IArcGISContext } from "../ArcGISContext";
import { cloneObject } from "../util";
import { IEditorConfig } from "../core";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { setGroupThumbnail } from "./setGroupThumbnail";
import { getGroupThumbnailUrl } from "../search/utils";
import { deleteGroupThumbnail } from "./deleteGroupThumbnail";
import { GroupEditorType } from "./_internal/GroupSchema";
import { IEntityEditorContext } from "../core";
import { enrichEntity } from "../core/enrichEntity";

/**
 * Hub Group Class
 */
export class HubGroup
  implements
    IWithStoreBehavior<IHubGroup>,
    IWithPermissionBehavior,
    IWithEditorBehavior
{
  protected context: IArcGISContext;
  protected entity: IHubGroup;
  protected isDestroyed = false;
  protected thumbnailCache: { file?: any; filename?: string; clear?: boolean } =
    null;

  private constructor(group: IHubGroup, context: IArcGISContext) {
    this.entity = group;
    this.context = context;
  }

  /**
   * Whether the user can edit the group,
   * only the owner or admins of the group can
   */
  get canEdit(): boolean {
    return (
      (this.entity.memberType &&
        (this.entity.memberType === "owner" ||
          this.entity.memberType === "admin")) ||
      this.entity.owner === this.context.currentUser.username
    );
  }

  /**
   * Whether the user can delete the group
   * only the owner or admins of the group can
   */
  get canDelete(): boolean {
    return this.canEdit;
  }

  /**
   * Whether the group is protected, if so, it can't be deleted
   */
  get isProtected(): boolean {
    return this.entity.protected;
  }

  /**
   * Create an instance from an IHubGroup object
   * @param json - JSON object to create a HubGroup from
   * @param context - ArcGIS context
   * @returns
   */
  static fromJson(json: Partial<IHubGroup>, context: IArcGISContext): HubGroup {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json);
    return new HubGroup(pojo, context);
  }

  /**
   * Create a new HubGroup, returning a HubGroup instance.
   * Note: This does not persist the Group into the backing store
   * @param partialGroup
   * @param context
   * @returns
   */
  static async create(
    partialGroup: Partial<IHubGroup>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubGroup> {
    const pojo = this.applyDefaults(partialGroup);
    // return an instance of HubGroup
    const instance = HubGroup.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Group from the backing store and return a HubGroup instance.
   * @param identifier - Identifier of the group to load
   * @param context
   * @returns
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubGroup> {
    try {
      const group = await fetchHubGroup(identifier, context.userRequestOptions);
      // create an instance of HubGroup from the group
      return HubGroup.fromJson(group, context);
    } catch (ex) {
      if (
        (ex as Error).message ===
        "COM_0003: Group does not exist or is inaccessible."
      ) {
        throw new Error(`Group not found.`);
      } else {
        throw ex;
      }
    }
  }

  private static applyDefaults(partialGroup: Partial<IHubGroup>): IHubGroup {
    // extend the partial over the defaults
    return { ...DEFAULT_GROUP, ...partialGroup } as IHubGroup;
  }

  /**
   * Return the backing entity as an object literal
   */
  toJson(): IHubGroup {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    return cloneObject(this.entity);
  }

  /**
   * Apply a new state to the instance
   * @param changes
   */
  update(changes: Partial<IHubGroup>): void {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    // merge partial onto existing entity
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the HubGroup to the backing store
   * @returns
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    if (this.entity.id) {
      // update it
      this.entity = await updateHubGroup(
        this.entity,
        this.context.userRequestOptions
      );
    } else {
      // create it
      this.entity = await createHubGroup(
        this.entity,
        this.context.userRequestOptions
      );
    }
    return;
  }

  /**
   * Delete the HubGroup from the store
   * set a flag to indicate that it is destroyed
   * @returns
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubGroup is already destroyed.");
    }
    this.isDestroyed = true;
    // Delegate to module fn
    await deleteHubGroup(this.entity.id, this.context.userRequestOptions);
  }

  /**
   * Check if current user has a specific permission, accounting for
   * both system and entity level policies
   * @param permission
   * @returns
   */
  checkPermission(permission: Permission): IPermissionAccessResponse {
    return checkPermission(permission, this.context, this.entity);
  }

  /**
   * Get all policies related to a specific permission
   * @param permission
   * @returns
   */
  getPermissionPolicies(permission: Permission): IEntityPermissionPolicy[] {
    const permissions = this.entity.permissions;
    return permissions.filter((p) => p.permission === permission);
  }

  /**
   * Add a policy to the entity
   * @param policy
   */
  addPermissionPolicy(policy: IEntityPermissionPolicy): void {
    this.entity.permissions = addPermissionPolicy(
      this.entity.permissions,
      policy
    );
  }

  /**
   * Remove a policy from the entity
   * @param permission
   * @param id
   */
  removePermissionPolicy(permission: Permission, id: string): void {
    this.entity.permissions = removePermissionPolicy(
      this.entity.permissions,
      permission,
      id
    );
  }

  /*
   * Get the editor config for the HubGroup entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @param options optional hash of dynamic uiSchema element options
   */
  async getEditorConfig(
    i18nScope: string,
    type: GroupEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the group as an editor object
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubGroupEditor> {
    // 1. optionally enrich entity and cast to editor
    const editor = include.length
      ? ((await enrichEntity(
          cloneObject(this.entity),
          include,
          this.context.hubRequestOptions
        )) as IHubGroupEditor)
      : (cloneObject(this.entity) as IHubGroupEditor);

    // 2. Apply transforms to relevant entity values so they
    // can be consumed by the editor

    return editor;
  }

  /**
   * Load the group from the editor object
   * @param editor
   * @returns
   */
  async fromEditor(editor: IHubGroupEditor): Promise<IHubGroup> {
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

    if (this.thumbnailCache) {
      if (this.thumbnailCache.clear) {
        await deleteGroupThumbnail(
          this.entity.id,
          this.context.userRequestOptions
        );
      } else {
        await setGroupThumbnail(
          this.entity.id,
          this.thumbnailCache.file,
          this.thumbnailCache.filename,
          this.context.userRequestOptions,
          this.entity.owner
        );

        // Note: updating the thumbnail alone does not update the modified date of the group
        // thus we can just set props on the entity w/o re-fetching
        this.entity.thumbnail = `thumbnail/${this.thumbnailCache.filename}`;
        // Cover the Hub Group to an IGoup
        const group = convertHubGroupToGroup(this.entity);
        this.entity.thumbnailUrl = getGroupThumbnailUrl(
          this.context.userRequestOptions.portal,
          group
        );
        // clear the thumbnail cache
        this.thumbnailCache = null;
      }
    }

    // convert back to an entity. Apply any reverse transforms used in
    // of the toEditor method
    const entity = cloneObject(editor) as IHubGroup;

    // create it if it does not yet exist...
    if (isCreate) {
      throw new Error("Cannot create group using the Editor.");
    } else {
      // ...otherwise, update the in-memory entity and save it
      this.entity = entity;
      await this.save();
    }

    return this.entity;
  }
}
