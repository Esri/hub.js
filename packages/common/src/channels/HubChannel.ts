import { IArcGISContext } from "../types";
import { IWithEditorBehavior } from "../core/behaviors/IWithEditorBehavior";
import { IWithStoreBehavior } from "../core/behaviors/IWithStoreBehavior";
import { IEditorConfig } from "../core/schemas/types";
import { IEntityEditorContext } from "../core/types/HubEntityEditor";
import { IHubChannel, IHubChannelEditor } from "../core/types/IHubChannel";
import { cloneObject } from "../util";
import { ChannelEditorType } from "./_internal/ChannelSchema";
import { buildDefaultChannel } from "./_internal/buildDefaultChannel";
import {
  IConvertToCardModelOpts,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";

export class HubChannel
  implements IWithStoreBehavior<IHubChannel>, IWithEditorBehavior
{
  protected context: IArcGISContext;
  protected entity: IHubChannel;
  protected isDestroyed: boolean = false;

  constructor(entity: IHubChannel, context: IArcGISContext) {
    this.context = context;
    this.entity = entity;
  }

  /**
   * Create an instance from an IHubChannel object
   * @param json - JSON object to create a HubChannel from
   * @param context - ArcGIS context
   * @returns a HubChannel instance
   */
  static fromJson(
    json: Partial<IHubChannel>,
    context: IArcGISContext
  ): HubChannel {
    const pojo = this.applyDefaults(json, context);
    return new HubChannel(pojo, context);
  }

  /**
   * Create a new HubChannel, returning a HubChannel instance.
   * Note: This does not persist the Channel into the backing store
   * @param partialChannel A partial IHubChannel object
   * @param context ArcGIS Context
   * @returns a HubChannel instance
   */
  static async create(
    partialChannel: Partial<IHubChannel>,
    context: IArcGISContext,
    save: boolean = false
  ): Promise<HubChannel> {
    const pojo = this.applyDefaults(partialChannel, context);
    const instance = HubChannel.fromJson(pojo, context);
    if (save) {
      await instance.save();
    }
    return instance;
  }

  /**
   * Fetch a Channel from the backing store and return a HubChannel instance.
   * @param identifier - Identifier of the channel to load
   * @param context - An IArcGISContext object
   * @returns a HubChannel instance
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubChannel> {
    try {
      const { fetchHubChannel } = await import("./fetch");
      const entity = await fetchHubChannel(identifier, context);
      return HubChannel.fromJson(entity, context);
    } catch (e) {
      // TODO: any specific error handling? see HubProject fetch...
      throw new Error("Channel not found.");
    }
  }

  /**
   * Given a partial channel, apply defaults to it to ensure that a baseline of properties are set
   * @param partialChannel A partial IHubChannel object
   * @param context - ArcGIS Context
   * @returns an IHubChannel object
   */
  private static applyDefaults(
    partialChannel: Partial<IHubChannel>,
    context: IArcGISContext
  ): IHubChannel {
    const pojo = {
      ...buildDefaultChannel(context.currentUser.orgId),
      ...partialChannel,
    } as IHubChannel;
    return pojo;
  }

  /**
   * Can the current user edit the channel?
   * @returns boolean
   */
  get canEdit(): boolean {
    return this.entity.canEdit;
  }

  /**
   * Can the current user delete the channel?
   * @returns boolean
   */
  get canDelete() {
    return this.entity.canDelete;
  }

  /**
   * The orgId of the channel
   * @returns the orgId of the channel
   */
  get orgId() {
    return this.entity.orgId;
  }

  /**
   * Return the backing entity as an object literal
   * @returns an IHubChannel
   */
  toJson(): IHubChannel {
    if (this.isDestroyed) {
      throw new Error("HubChannel is already destroyed.");
    }
    return cloneObject(this.entity);
  }

  /**
   * Apply a new state to the instance
   * @param changes A partial IHubChannel object
   */
  update(changes: Partial<IHubChannel>): void {
    if (this.isDestroyed) {
      throw new Error("HubChannel is already destroyed.");
    }
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Save the HubChannel to the backing store.
   * @returns a promise
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubChannel is already destroyed.");
    }

    const { updateHubChannel, createHubChannel } = await import("./edit");

    if (this.entity.id) {
      this.entity = await updateHubChannel(this.entity, this.context);
    } else {
      this.entity = await createHubChannel(this.entity, this.context);
    }
  }

  /**
   * Delete the HubChannel from the store
   * set a flag to indicate that it is destroyed
   * @returns a promise
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubChannel is already destroyed.");
    }
    const { deleteHubChannel } = await import("./edit");
    this.isDestroyed = true;
    await deleteHubChannel(this.entity.id, this.context);
  }

  /**
   * TODO
   * @param opts
   * @returns
   */
  convertToCardModel(opts?: IConvertToCardModelOpts): IHubCardViewModel {
    // TODO
    throw new Error("not implemented");
  }

  /**
   * Get a specifc editor config for the HubChannel entity.
   * @param i18nScope A string representing the i18n scope for translated strings
   * @param type One of the supported ChannelEditorType strings
   * @returns a promise that resolves a IEditorConfig object
   */
  async getEditorConfig(
    i18nScope: string,
    type: ChannelEditorType
  ): Promise<IEditorConfig> {
    const { getEditorConfig } = await import("../core/schemas/getEditorConfig");
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the channel as an editor object
   * @param editorContext An IEntityEditorContext object
   * @param include An optional array of includes
   * @returns a promise that resolves an IHubChannelEditor object
   */
  async toEditor(
    editorContext: IEntityEditorContext,
    include?: string[]
  ): Promise<IHubChannelEditor> {
    const { transformEntityToEditor } = await import(
      "./_internal/transformEntityToEditor"
    );
    return transformEntityToEditor(this.entity);
  }

  /**
   * Load the channel from the editor object
   * @param editor An IHubChannelEditor object
   * @returns a promise that resolves an IHubChannel
   */
  async fromEditor(editor: IHubChannelEditor): Promise<IHubChannel> {
    const { transformEditorToEntity } = await import(
      "./_internal/transformEditorToEntity"
    );
    return {
      ...this.entity,
      ...transformEditorToEntity(editor),
    };
  }
}
