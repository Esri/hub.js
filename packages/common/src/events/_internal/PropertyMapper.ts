import {
  PropertyMapper,
  mapEntityToStore,
  mapStoreToEntity,
} from "../../core/_internal/PropertyMapper";
import { HubActionLink } from "../../core/types/ActionLinks";
import { IHubEvent } from "../../core/types/IHubEvent";
import { SettableAccessLevel } from "../../core/types/types";
import { cloneObject } from "../../util";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  IEvent,
  IOnlineMeeting,
} from "../api/orval/api/orval-events";
import { HubEventAttendanceType, HubEventOnlineCapacityType } from "../types";
import { computeLinks } from "./computeLinks";
import { getEventSlug } from "./getEventSlug";
import { getEventThumbnail } from "./getEventThumbnail";

/**
 * @private
 * Manage forward and backward property mappings to
 * streamline conversion between a Hub Event, and
 * the backing Store objects.
 */
export class EventPropertyMapper extends PropertyMapper<
  Partial<IHubEvent>,
  Partial<IEvent>
> {
  /**
   * Map properties from a Store object, on to an Entity object.
   *
   * Used when constructing an Entity from a fetched Store object,
   * in which case the Entity should be an empty object (`{}`).
   *
   * Can also be used to apply changes to an Entity from a Store,
   * in which case an existing Entity can be passed in.
   * @param store
   * @param entity
   * @returns
   */
  storeToEntity(
    store: Partial<IEvent>,
    entity: Partial<IHubEvent>
  ): Partial<IHubEvent> {
    // TODO: support locations
    // TODO: thumbnail & thumbnail url

    const obj = mapStoreToEntity(store, entity, this.mappings);

    obj.type = "Event";
    obj.access = store.access.toLowerCase() as SettableAccessLevel;
    obj.isCanceled = store.status === EventStatus.CANCELED;
    obj.isPlanned = store.status === EventStatus.PLANNED;
    obj.isRemoved = store.status === EventStatus.REMOVED;
    if (
      store.attendanceType.includes(EventAttendanceType.IN_PERSON) &&
      store.attendanceType.includes(EventAttendanceType.VIRTUAL)
    ) {
      obj.attendanceType = HubEventAttendanceType.Both;
    } else if (store.attendanceType.includes(EventAttendanceType.IN_PERSON)) {
      obj.attendanceType = HubEventAttendanceType.InPerson;
    } else {
      obj.attendanceType = HubEventAttendanceType.Online;
    }
    obj.onlineCapacity = store.onlineMeetings?.[0]?.capacity ?? null;
    obj.onlineCapacityType = store.onlineMeetings?.[0]?.capacity
      ? HubEventOnlineCapacityType.Fixed
      : HubEventOnlineCapacityType.Unlimited;
    obj.onlineDetails = store.onlineMeetings?.[0]?.details ?? null;
    obj.onlineUrl = store.onlineMeetings?.[0]?.url ?? null;
    obj.canChangeAccess = [
      store.permission.canSetAccessToPublic,
      store.permission.canSetAccessToOrg,
      store.permission.canSetAccessToPrivate,
    ].every(Boolean);
    obj.canChangeStatus = [
      store.permission.canSetStatusToCancelled,
      store.permission.canSetStatusToRemoved,
    ].some(Boolean);

    // Handle Dates
    obj.createdDate = new Date(store.createdAt);
    obj.startDateTime = new Date(store.startDateTime);
    obj.endDateTime = new Date(store.endDateTime);
    obj.isPast = obj.endDateTime < new Date();
    obj.createdDateSource = "createdAt";
    obj.updatedDate = new Date(store.updatedAt);
    obj.updatedDateSource = "updatedAt";
    obj.links = computeLinks(store as IEvent);
    obj.slug = getEventSlug(store as IEvent);
    obj.thumbnailUrl = getEventThumbnail();

    const heroActions: HubActionLink[] = [];
    if (store.allowRegistration) {
      let tooltip;
      if (obj.isCanceled) {
        tooltip = "{{tooltip.register.isCancelled:translate}}";
      } else if (obj.isPast) {
        tooltip = "{{tooltip.register.eventHasEnded:translate}}";
      }
      heroActions.push({
        kind: "well-known",
        action: "register",
        label: "{{actions.register:translate}}",
        disabled: obj.isCanceled || obj.isPast,
        tooltip,
      });
    }
    obj.view = { heroActions };

    return obj;
  }

  /**
   * Map properties from an entity object onto a model.
   *
   * Typically the model will already exist, and this
   * method is used to transfer changes to the model
   * prior to storage.
   * @param entity
   * @param store
   * @returns
   */
  entityToStore(
    entity: Partial<IHubEvent>,
    store: Partial<IEvent>
  ): Partial<IEvent> {
    // TODO: support locations
    // TODO: thumbnail & thumbnail url

    const clonedEntity = cloneObject(entity);

    const obj = mapEntityToStore(clonedEntity, store, this.mappings);

    obj.access = clonedEntity.access.toUpperCase() as EventAccess;

    if (clonedEntity.isRemoved) {
      obj.status = EventStatus.REMOVED;
    } else if (clonedEntity.isCanceled) {
      obj.status = EventStatus.CANCELED;
    } else {
      obj.status = EventStatus.PLANNED;
    }

    if (clonedEntity.attendanceType === HubEventAttendanceType.Both) {
      obj.attendanceType = [
        EventAttendanceType.IN_PERSON,
        EventAttendanceType.VIRTUAL,
      ];
    } else if (
      clonedEntity.attendanceType === HubEventAttendanceType.InPerson
    ) {
      obj.attendanceType = [EventAttendanceType.IN_PERSON];
    } else {
      obj.attendanceType = [EventAttendanceType.VIRTUAL];
    }

    if (
      [HubEventAttendanceType.Online, HubEventAttendanceType.Both].includes(
        clonedEntity.attendanceType
      )
    ) {
      obj.onlineMeetings = [
        {
          details: clonedEntity.onlineDetails,
          capacity:
            clonedEntity.onlineCapacityType === HubEventOnlineCapacityType.Fixed
              ? clonedEntity.onlineCapacity
              : null,
          url: clonedEntity.onlineUrl,
        } as IOnlineMeeting,
      ];
    }

    // override startTime & endTime for all-day events
    if (clonedEntity.isAllDay) {
      clonedEntity.startTime = "00:00:00";
      clonedEntity.endTime = "23:59:59";
    }

    return obj;
  }
}
