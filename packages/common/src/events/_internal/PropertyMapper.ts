import {
  PropertyMapper,
  mapEntityToStore,
  mapStoreToEntity,
} from "../../core/_internal/PropertyMapper";
import { IHubEvent } from "../../core/types/IHubEvent";
import { SettableAccessLevel } from "../../core/types/types";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { cloneObject } from "../../util";
import {
  EventAccess,
  EventAttendanceType,
  EventLocationType,
  EventStatus,
  IEvent,
  IEventLocation,
  IOnlineMeeting,
} from "../api/orval/api/orval-events";
import { HubEventAttendanceType, HubEventCapacityType } from "../types";
import { computeLinks } from "./computeLinks";
import { getEventSlug } from "./getEventSlug";
import { getLocationFromEvent } from "./getLocationFromEvent";

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
    const obj = mapStoreToEntity(store, entity, this.mappings);

    obj.type = "Event";
    const access = store.access.toLowerCase() as SettableAccessLevel;
    if (
      access === "private" &&
      (store.readGroups.length > 0 || store.editGroups.length > 0)
    ) {
      obj.access = "shared";
    } else {
      obj.access = access;
    }
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
    obj.onlineCapacity = store.onlineMeeting?.capacity ?? null;
    obj.onlineCapacityType = store.onlineMeeting?.capacity
      ? HubEventCapacityType.Fixed
      : HubEventCapacityType.Unlimited;
    obj.inPersonCapacity = store.inPersonCapacity ?? null;
    obj.inPersonCapacityType = store.inPersonCapacity
      ? HubEventCapacityType.Fixed
      : HubEventCapacityType.Unlimited;
    obj.onlineDetails = store.onlineMeeting?.details ?? null;
    obj.onlineUrl = store.onlineMeeting?.url ?? null;
    obj.canChangeAccess = [
      store.permission.canSetAccessToPublic,
      store.permission.canSetAccessToOrg,
      store.permission.canSetAccessToPrivate,
    ].every(Boolean);
    obj.canChangeStatus = [
      store.permission.canSetStatusToCancelled,
      store.permission.canSetStatusToRemoved,
    ].some(Boolean);
    obj.referencedContentIds = store.associations.map(
      ({ entityId }) => entityId
    );
    obj.referencedContentIdsByType = store.associations.map(
      ({ entityId, entityType }) => ({ entityId, entityType })
    );

    // Handle Dates
    obj.createdDate = new Date(store.createdAt);
    obj.startDateTime = new Date(store.startDateTime);
    obj.endDateTime = new Date(store.endDateTime);
    obj.isPast = obj.endDateTime < new Date();
    obj.createdDateSource = "createdAt";
    obj.updatedDate = new Date(store.updatedAt);
    obj.updatedDateSource = "updatedAt";

    // Ensure we have a catalog and that its at the current schema
    obj.catalog = upgradeCatalogSchema(obj.catalog || {});

    obj.links = computeLinks(store as IEvent);
    obj.slug = getEventSlug(store as IEvent);

    obj.view = {
      showMap: !!store.location,
    };
    obj.location = getLocationFromEvent(store);

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
    const clonedEntity = cloneObject(entity);

    const obj = mapEntityToStore(clonedEntity, store, this.mappings);

    const access = clonedEntity.access;
    if (access === "shared") {
      obj.access = EventAccess.PRIVATE;
    } else {
      obj.access = access.toUpperCase() as EventAccess;
    }

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
      obj.onlineMeeting = {
        details: clonedEntity.onlineDetails,
        capacity:
          clonedEntity.onlineCapacityType === HubEventCapacityType.Fixed
            ? clonedEntity.onlineCapacity
            : null,
        url: clonedEntity.onlineUrl,
      } as IOnlineMeeting;
    }
    if (
      [HubEventAttendanceType.InPerson, HubEventAttendanceType.Both].includes(
        clonedEntity.attendanceType
      )
    ) {
      obj.inPersonCapacity =
        clonedEntity.inPersonCapacityType === HubEventCapacityType.Fixed
          ? clonedEntity.inPersonCapacity
          : null;
    } else {
      obj.inPersonCapacity = null;
    }

    // override startTime & endTime for all-day events
    if (clonedEntity.isAllDay) {
      clonedEntity.startTime = "00:00:00";
      clonedEntity.endTime = "23:59:59";
    }

    obj.location =
      clonedEntity.location && clonedEntity.location.type !== "none"
        ? ({
            type: clonedEntity.location.type as EventLocationType,
            spatialReference: clonedEntity.location.spatialReference,
            extent: clonedEntity.location.extent,
            geometries: clonedEntity.location.geometries,
            placeName: clonedEntity.location.name,
          } as IEventLocation)
        : null;

    return obj;
  }
}
