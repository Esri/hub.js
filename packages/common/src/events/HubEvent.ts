import { IGroup } from "@esri/arcgis-rest-portal";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubEventEditor, IHubEvent } from "../core/types/IHubEvent";
import { IWithEditorBehavior } from "../core/behaviors";
import { SettableAccessLevel } from "../core/types/types";
import { IArcGISContext } from "../ArcGISContext";
import { fetchEvent } from "./fetch";
import { buildDefaultEventEntity } from "./defaults";
import { IEntityEditorContext } from "../core/types";
import { IEditorConfig } from "../core/schemas/types";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { cloneObject } from "../util";
import { EventEditorType } from "./_internal/EventSchemaCreate";
import { shareEventWithGroups } from "./_internal/shareEventWithGroups";
import { unshareEventWithGroups } from "./_internal/unshareEventWithGroups";
import HubError from "../HubError";
import { updateEvent } from "./api/events";
import { EventAccess } from "./api/orval/api/orval-events";
import { getEventGroups } from "./getEventGroups";

/**
 * Defines the properties of a Hub Event object
 * @internal
 */
export class HubEvent
  extends HubItemEntity<IHubEvent>
  implements IWithEditorBehavior
{
  /**
   * Create an instance from a HubEvent object
   * @param json - JSON object to create a HubEvent from
   * @param context - ArcGIS context
   * @returns HubEvent
   */
  static fromJson(json: Partial<IHubEvent>, context: IArcGISContext): HubEvent {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubEvent(pojo, context);
  }

  /**
   * Fetch an Event from the API and return a HubEvent instance.
   * @param identifier slug or item id
   * @param context ArcGIS context
   * @returns Promise<HubEvent>
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubEvent> {
    try {
      const entity = await fetchEvent(identifier, context.hubRequestOptions);
      // create an instance of HubEvent from the entity
      return HubEvent.fromJson(entity, context);
    } catch (ex) {
      throw new Error("Event not found.");
    }
  }

  private static applyDefaults(
    partialEvent: Partial<IHubEvent>,
    context: IArcGISContext
  ): IHubEvent {
    // ensure we have the orgUrlKey
    if (!partialEvent.orgUrlKey) {
      partialEvent.orgUrlKey = context.portal?.urlKey;
    }
    // extend the partial over the defaults
    const pojo = {
      ...buildDefaultEventEntity(),
      ...partialEvent,
    } as IHubEvent;
    return pojo;
  }

  /**
   * Apply a new state to the instance
   * @param changes A partial IHubEvent
   */
  update(changes: Partial<IHubEvent>): void {
    if (this.isDestroyed) {
      throw new Error("HubEvent is already destroyed.");
    }
    this.entity = { ...this.entity, ...changes };
  }

  /**
   * Creates or saves the Event.
   */
  async save(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubEvent is already destroyed.");
    }

    if (this.entity.id) {
      const { updateHubEvent } = await import("./edit");
      this.entity = await updateHubEvent(
        this.entity,
        this.context.hubRequestOptions
      );
    } else {
      const { createHubEvent } = await import("./edit");
      this.entity = await createHubEvent(
        this.entity,
        this.context.hubRequestOptions
      );
    }

    // not calling `afterSave` intentionally, doesn't apply to events
  }

  /**
   * Deletes the Event
   */
  async delete(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error("HubEvent is already destroyed.");
    }
    const { deleteHubEvent } = await import("./edit");
    await deleteHubEvent(this.entity.id, this.context.hubRequestOptions);
    this.isDestroyed = true;
  }

  /**
   * Share the Entity with the specified group id
   * @param groupId The ID of the group to share the Event to
   */
  async shareWithGroup(groupId: string): Promise<void> {
    if (!this.context.currentUser) {
      throw new HubError(
        "Share Event With Group",
        "Cannot share event with group when no user is logged in."
      );
    }
    this.entity = (await shareEventWithGroups(
      [groupId],
      this.entity,
      this.context
    )) as IHubEvent;
  }

  /**
   * Share the Entity with the specified group ids
   * @param groupIds The IDs of the groups to share the Event to
   */
  async shareWithGroups(groupIds: string[]): Promise<void> {
    this.entity = (await shareEventWithGroups(
      groupIds,
      this.entity,
      this.context
    )) as IHubEvent;
  }

  /**
   * Unshare the Event with the specified group id
   * @param groupId The ID of the group to unshar ethe Event with
   */
  async unshareWithGroup(groupId: string): Promise<void> {
    this.entity = (await unshareEventWithGroups(
      [groupId],
      this.entity,
      this.context
    )) as IHubEvent;
  }

  /**
   * Unshare the Event with the specified group ids
   * @param groupIds The IDs of the groups to unshare the Event with
   */
  async unshareWithGroups(groupIds: string[]): Promise<void> {
    this.entity = (await unshareEventWithGroups(
      groupIds,
      this.entity,
      this.context
    )) as IHubEvent;
  }

  /**
   * Sets the access level of the event
   * @param access The access level to set the Event to
   */
  async setAccess(access: SettableAccessLevel): Promise<void> {
    await updateEvent({
      eventId: this.entity.id,
      data: {
        access: access.toUpperCase() as EventAccess,
      },
      ...this.context.hubRequestOptions,
    });
    this.entity.access = access;
  }

  /**
   * Return a list of groups the Entity is shared to.
   */
  async sharedWith(): Promise<IGroup[]> {
    return getEventGroups(this.entity.id, this.context);
  }

  /*
   * Get the editor config for the HubEvent entity.
   * @param i18nScope translation scope to be interpolated into the uiSchema
   * @param type editor type - corresonds to the returned uiSchema
   * @returns Promise<IEditorConfig>
   */
  async getEditorConfig(
    i18nScope: string,
    type: EventEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  /**
   * Return the HubEvent object as an editor object
   * @param editorContext
   * @param include
   * @returns Promise<IHubEventEditor>
   */
  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubEventEditor> {
    const editor = cloneObject(this.entity) as IHubEventEditor;
    return editor;
  }

  /**
   * Load the HubEvent object from the editor object
   * @param editor
   * @param editorContext
   * @returns Promise<IHubEvent>
   */
  async fromEditor(editor: IHubEventEditor): Promise<IHubEvent> {
    const thumbnail = editor._thumbnail;
    const entity = cloneObject(editor) as IHubEvent;

    if (thumbnail) {
      entity.thumbnailUrl = thumbnail.url || null;
    }

    this.entity = entity;
    await this.save();
    return this.entity;
  }
}
