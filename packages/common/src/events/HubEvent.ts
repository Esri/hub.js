import { IGroup } from "@esri/arcgis-rest-types";
import { HubItemEntity } from "../core/HubItemEntity";
import { IHubEventEditor, IHubEvent } from "../core/types/IHubEvent";
import { IWithEditorBehavior, IWithSharingBehavior } from "../core/behaviors";
import { SettableAccessLevel } from "../core/types/types";
import { IArcGISContext } from "../ArcGISContext";
import { fetchEvent } from "./fetch";
import { buildDefaultEventEntity } from "./defaults";
import { IEntityEditorContext } from "../core/types";
import { IEditorConfig } from "../core/schemas/types";
import { getEditorConfig } from "../core/schemas/getEditorConfig";
import { cloneObject } from "../util";
import { EventEditorType } from "./_internal/EventSchemaCreate";

/**
 * Defines the properties of a Hub Event object
 * @internal
 */
export class HubEvent
  extends HubItemEntity<IHubEvent>
  implements IWithSharingBehavior, IWithEditorBehavior
{
  static fromJson(json: Partial<IHubEvent>, context: IArcGISContext): HubEvent {
    // merge what we have with the default values
    const pojo = this.applyDefaults(json, context);
    return new HubEvent(pojo, context);
  }

  /**
   * Fetch an Event from the API and return a HubEvent instance.
   * @param identifier slug or item id
   * @param context ArcGIS context
   * @returns promise that resolves a HubEvent
   */
  static async fetch(
    identifier: string,
    context: IArcGISContext
  ): Promise<HubEvent> {
    try {
      const entity = await fetchEvent(identifier, context.hubRequestOptions);
      // create an instance of HubDiscussion from the entity
      return HubEvent.fromJson(entity, context);
    } catch (ex) {
      throw new Error("Event not found.");
      // throw (ex as Error).message ===
      //   "CONT_0001: Item does not exist or is inaccessible."
      //   ? new Error("Discussion not found.")
      //   : ex;
    }
  }

  private static applyDefaults(
    partialEvent: Partial<IHubEvent>,
    context: IArcGISContext
  ): IHubEvent {
    // TODO: Figure out how to approach slugs for Events
    // TODO: remove orgUrlKey if either:
    //  1. back-end generates the slug at time of create/update
    //  2. slug is derived on client from title & ID appears, e.g. `my-event-clu34rsub00003b6thiioms4a`
    // ensure we have the orgUrlKey
    if (!partialEvent.orgUrlKey) {
      partialEvent.orgUrlKey = context.portal.urlKey;
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
      const { updateEvent } = await import("./edit");
      this.entity = await updateEvent(
        this.entity,
        this.context.hubRequestOptions
      );
    } else {
      const { createEvent } = await import("./edit");
      this.entity = await createEvent(
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
    const { deleteEvent } = await import("./api/events");
    await deleteEvent({
      eventId: this.entity.id,
      ...this.context.hubRequestOptions,
    });
    this.isDestroyed = true;
  }

  /**
   * Share the Entity with the specified group id
   * @param groupId The ID of the group to share the Event to
   */
  async shareWithGroup(groupId: string): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Unshare the Event with the specified group id
   * @param groupId The ID of the group to unshar ethe Event with
   */
  async unshareWithGroup(groupId: string): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Sets the access level of the event
   * @param access The access level to set the Event to
   */
  async setAccess(access: SettableAccessLevel): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Return a list of groups the Entity is shared to.
   */
  async sharedWith(): Promise<IGroup[]> {
    throw new Error("not implemented");
  }

  async getEditorConfig(
    i18nScope: string,
    type: EventEditorType
  ): Promise<IEditorConfig> {
    // delegate to the schema subsystem
    return getEditorConfig(i18nScope, type, this.entity, this.context);
  }

  async toEditor(
    editorContext: IEntityEditorContext = {},
    include: string[] = []
  ): Promise<IHubEventEditor> {
    const editor = cloneObject(this.entity) as IHubEventEditor;
    return editor;
  }

  async fromEditor(editor: IHubEventEditor): Promise<IHubEvent> {
    const entity = cloneObject(editor) as IHubEvent;
    this.entity = entity;
    await this.save();
    return this.entity;
  }
}
