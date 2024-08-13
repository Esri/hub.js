import {
  HubEventAttendanceType,
  HubEventCapacityType,
} from "../../events/types";
import { IWithCatalogs } from "../traits/IWithCatalog";
import { IWithPermissions } from "../traits/IWithPermissions";
import { IWithSlug } from "../traits/IWithSlug";

import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubEvent
  extends IHubItemEntity,
    IWithPermissions,
    IWithSlug,
    IWithCatalogs {
  /**
   * True when users can be registered to attend the event
   */
  allowRegistration: boolean;

  /**
   * The attendnace type of the event. Either `online`, `inPerson` or `both`
   */
  attendanceType: HubEventAttendanceType;

  /**
   * True when the user can change the access of the event to `public`, `org` or `private`
   */
  canChangeAccess: boolean;

  /**
   * True when the user can change the access of the event to `org`
   */
  canChangeAccessOrg: boolean;

  /**
   * True when the user can change the access of the event to `private`
   */
  canChangeAccessPrivate: boolean;

  /**
   * True when the user can change the access of the event to `public`
   */
  canChangeAccessPublic: boolean;

  /**
   * True when the user can change the status of the event to `cancelled` or `removed`
   */
  canChangeStatus: boolean;

  /**
   * True when the user can change the status of the event to `cancelled`
   */
  canChangeStatusCancelled: boolean;

  /**
   * True when the user can change the status of the event to `removed`
   */
  canChangeStatusRemoved: boolean;

  /**
   * An Array of edit group IDs the event is shared with
   */
  editGroupIds: string[];

  /**
   * The end date of the event
   */
  endDate: string;

  /**
   * The end date & time of the event
   */
  endDateTime: Date;

  /**
   * The end time of the event
   */
  endTime: string;

  /**
   * The maximum capacity for in-person attendance
   */
  inPersonCapacity: number | null;

  /**
   * The capacity type for an in-person event, either `unlimited` or `fixed`
   */
  inPersonCapacityType: HubEventCapacityType;

  /**
   * The current number of in-person registrants with a registration status of `accepted`
   */
  inPersonRegistrationCount: number;

  /**
   * True when the event is an all day event
   */
  isAllDay: boolean;

  /**
   * True when the event has been canceled
   */
  isCanceled: boolean;

  /**
   * True when the event is planned
   */
  isPlanned: boolean;

  /**
   * True when the event has been removed
   */
  isRemoved: boolean;

  /**
   * True when the event takes place in the past
   */
  isPast: boolean;

  /**
   * If attendees should be notified of event updates
   */
  notifyAttendees: boolean;

  /**
   * The maximum attendance capacity for an online event
   */
  onlineCapacity: number | null;

  /**
   * The current number of online registrants with a registration status of `accepted`
   */
  onlineRegistrationCount: number;

  /**
   * The capacity type for an online event, either `unlimited` or `fixed`
   */
  onlineCapacityType: HubEventCapacityType;

  /**
   * The details for an online event
   */
  onlineDetails?: string | null;

  /**
   * The URL for an online event
   */
  onlineUrl?: string | null;

  /**
   * An Array of view group IDs the event is shared with
   */
  readGroupIds: string[];

  /**
   * A collection of objects containing the ids & types for entities that the event references
   */
  references: Array<Record<string, string>>;

  /**
   * The start date of the event
   */
  startDate: string;

  /**
   * The start date & time of the event
   */
  startDateTime: Date;

  /**
   * The start time of the event
   */
  startTime: string;

  /**
   * The time zone of the event
   */
  timeZone: string;
}

export type IHubEventEditor = IHubItemEntityEditor<IHubEvent> & {};
