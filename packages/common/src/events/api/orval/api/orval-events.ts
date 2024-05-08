/* tslint:disable:interface-over-type-literal */
/**
 * Generated by orval v6.24.0 🍺
 * Do not edit manually.
 * Hub Events Service
 * OpenAPI spec version: 0.0.1
 */
import { Awaited } from "../awaited-type";
import { customClient } from "../custom-client";
export type GetRegistrationsParams = {
  /**
   * Event id being registered for
   */
  eventId?: string;
  /**
   * ArcGIS Online id for a user
   */
  userId?: string;
  /**
   * comma separated string list of registration roles
   */
  role?: string;
  /**
   * comma separated string list of registration statuses
   */
  status?: string;
  /**
   * comma separated string list of registration types
   */
  type?: string;
  /**
   * latest ISO8601 updatedAt for the registrations
   */
  updatedAtBefore?: string;
  /**
   * earliest ISO8601 updatedAt for the registrations
   */
  updatedAtAfter?: string;
  /**
   * filter to be matched to firstName, lastName, or username
   */
  name?: string;
  /**
   * the max amount of registrations to return
   */
  num?: string;
  /**
   * the index to start at
   */
  start?: string;
  /**
   * property to sort results by
   */
  sortBy?: RegistrationSort;
  /**
   * sort order desc or asc
   */
  sortOrder?: SortOrder;
};

export type GetEventsParams = {
  /**
   * Comma separated string list of EventAccess
   */
  access?: string;
  /**
   * Comma separated string list of associated entityIds
   */
  entityIds?: string;
  /**
   * Comma separated string list of associated entity types
   */
  entityTypes?: string;
  /**
   * Comma separated string list of relation fields to include in response
   */
  include?: string;
  /**
   * latest ISO8601 start date-time for the events
   */
  startDateTimeBefore?: string;
  /**
   * earliest ISO8601 start date-time for the events
   */
  startDateTimeAfter?: string;
  /**
   * Comma separated string list of AttendanceTypes
   */
  attendanceTypes?: string;
  /**
   * Comma separated string list of categories
   */
  categories?: string;
  /**
   * comma separated string list of event statuses
   */
  status?: string;
  /**
   * Comma separated string list of tags
   */
  tags?: string;
  /**
   * string to match within an event title
   */
  title?: string;
  /**
   * the max amount of events to return
   */
  num?: string;
  /**
   * the index to start at
   */
  start?: string;
  /**
   * Event property to sort results by
   */
  sortBy?: EventSort;
  /**
   * sort results order desc or asc
   */
  sortOrder?: SortOrder;
};

export interface IUpdateRegistration {
  /** Role of the user in the event */
  role?: RegistrationRole;
  /** Status of the registration */
  status?: RegistrationStatus;
  /** Attendance type for this registration */
  type?: EventAttendanceType;
}

export interface IPagedRegistrationResponse {
  items: IRegistration[];
  nextStart: number;
  total: number;
}

export enum RegistrationSort {
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  firstName = "firstName",
  lastName = "lastName",
  username = "username",
}
export interface ICreateRegistration {
  /** ArcGIS Online id for a user. Will always be extracted from the token unless service token is used. */
  agoId?: string;
  /** Email for the subscriber. Will always be extracted from the token unless service token is used. */
  email?: string;
  /** Event id being registered for */
  eventId: string;
  /** First name for the subscriber. Will always be extracted from the token unless service token is used. */
  firstName?: string;
  /** Last name for the subscriber. Will always be extracted from the token unless service token is used. */
  lastName?: string;
  /** Role of the user in the event */
  role?: RegistrationRole;
  /** Attendance type for this registration */
  type: EventAttendanceType;
  /** Username for the subscriber. Will always be extracted from the token unless service token is used. */
  username?: string;
}

/**
 * GeoJSON formatted geometry related to the event
 */
export type IUpdateEventGeometry = { [key: string]: any };

export interface IUpdateEvent {
  /** Access level of the event */
  access?: EventAccess;
  /** Addresses for the event */
  addresses?: ICreateAddress[];
  /** Flag for all day event */
  allDay?: boolean;
  /** Boolean to indicate if users can register for an event */
  allowRegistration?: boolean;
  /** Items associated with the event */
  associations?: ICreateAssociation[];
  /** Valid ways to attend the event */
  attendanceType?: EventAttendanceType[];
  /** categories for the event */
  categories?: string[];
  /** Description of the event */
  description?: string;
  /** Groups with edit access to the event */
  editGroups?: string[];
  /** end date string formatted YYYY-MM-DD */
  endDate?: string;
  /** end time string 24 hour formatted HH:MM:SS */
  endTime?: string;
  /** GeoJSON formatted geometry related to the event */
  geometry?: IUpdateEventGeometry;
  /** Flag to notify attendees */
  notifyAttendees?: boolean;
  /** Online meetings for the event */
  onlineMeetings?: ICreateOnlineMeeting[];
  /** Groups with read access to the event */
  readGroups?: string[];
  /** start date string formatted YYYY-MM-DD */
  startDate?: string;
  /** start time string 24 hour formatted HH:MM:SS */
  startTime?: string;
  /** Status of the event */
  status?: EventStatus;
  /** Summary of the event */
  summary?: string;
  /** Tags for the event */
  tags?: string[];
  /** IANA time zone for the event */
  timeZone?: string;
  /** Title of the event */
  title?: string;
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}
export enum EventSort {
  title = "title",
  startDateTime = "startDateTime",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}
export interface IRegistrationPermission {
  canDelete: boolean;
  canEdit: boolean;
}

export type IEventGeometry = { [key: string]: any } | null;

export type IEventCatalogItem = { [key: string]: any };

export interface IEventPermission {
  canDelete: boolean;
  canEdit: boolean;
  canSetAccessToOrg: boolean;
  canSetAccessToPrivate: boolean;
  canSetAccessToPublic: boolean;
  canSetStatusToCancelled: boolean;
  canSetStatusToRemoved: boolean;
}

export enum RegistrationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  BLOCKED = "BLOCKED",
}
export enum RegistrationRole {
  OWNER = "OWNER",
  ORGANIZER = "ORGANIZER",
  ATTENDEE = "ATTENDEE",
}
export enum EventStatus {
  PLANNED = "PLANNED",
  CANCELED = "CANCELED",
  REMOVED = "REMOVED",
}
export interface IOnlineMeeting {
  capacity: number | null;
  createdAt: string;
  details: string | null;
  eventId: string;
  updatedAt: string;
  url: string;
}

export interface IUser {
  agoId: string;
  createdAt: string;
  deleted: boolean;
  email: string;
  firstName: string;
  lastName: string;
  optedOut: boolean;
  updatedAt: string;
  username: string;
}

export interface IAssociation {
  entityId: string;
  entityType: AssociationEntityType;
  eventId: string;
}

export interface IEvent {
  access: EventAccess;
  addresses?: IAddress[];
  allDay: boolean;
  allowRegistration: boolean;
  associations?: IAssociation[];
  attendanceType: EventAttendanceType[];
  catalog: IEventCatalogItem[] | null;
  categories: string[];
  createdAt: string;
  createdById: string | null;
  creator?: IUser;
  description: string | null;
  editGroups: string[];
  endDate: string;
  endDateTime: string;
  endTime: string;
  geometry: IEventGeometry;
  id: string;
  notifyAttendees: boolean;
  onlineMeetings?: IOnlineMeeting[];
  orgId: string;
  permission: IEventPermission;
  readGroups: string[];
  recurrence: string | null;
  registrations?: IRegistration[];
  startDate: string;
  startDateTime: string;
  startTime: string;
  status: EventStatus;
  summary: string | null;
  tags: string[];
  timeZone: string;
  title: string;
  updatedAt: string;
}

export interface IPagedEventResponse {
  items: IEvent[];
  nextStart: number;
  total: number;
}

export interface IRegistration {
  createdAt: string;
  createdBy?: IUser;
  createdById: string;
  event?: IEvent;
  eventId: string;
  id: number;
  permission: IRegistrationPermission;
  role: RegistrationRole;
  status: RegistrationStatus;
  type: EventAttendanceType;
  updatedAt: string;
  user?: IUser;
  userId: string;
}

export type IAddressLocation = { [key: string]: any };

export type IAddressExtent = { [key: string]: any };

export interface IAddress {
  address: string;
  address2: string | null;
  capacity: number | null;
  createdAt: string;
  description: string | null;
  eventId: string;
  extent: IAddressExtent;
  geoAddress: string;
  geoAddrType: string;
  geoScore: number;
  location: IAddressLocation;
  updatedAt: string;
  venue: string | null;
}

/**
 * GeoJSON formatted geometry related to the event
 */
export type ICreateEventGeometry = { [key: string]: any };

export interface ICreateOnlineMeeting {
  /** Capacity of the online meeting. Minimum value is 1 */
  capacity?: number;
  /** Details related to the online meeting */
  details?: string;
  /** Url for the online meeting */
  url: string;
}

export enum EventAttendanceType {
  VIRTUAL = "VIRTUAL",
  IN_PERSON = "IN_PERSON",
}
export interface ICreateEvent {
  /** Access level of the event */
  access?: EventAccess;
  /** Addresses for the event. Required if attendanceType includes IN_PERSON */
  addresses?: ICreateAddress[];
  /** ArcGIS Online id for a user. Will always be extracted from the token unless service token is used. */
  agoId?: string;
  /** Flag for all day event */
  allDay?: boolean;
  /** Boolean to indicate if users can register for an event */
  allowRegistration?: boolean;
  /** Items associated with the event */
  associations?: ICreateAssociation[];
  /** Valid ways to attend the event */
  attendanceType?: EventAttendanceType[];
  /** categories for the event */
  categories?: string[];
  /** Description of the event */
  description?: string;
  /** Groups with edit access to the event */
  editGroups?: string[];
  /** Email for the subscriber. Will always be extracted from the token unless service token is used. */
  email?: string;
  /** end date string formatted YYYY-MM-DD */
  endDate: string;
  /** end time string 24 hour formatted HH:MM:SS */
  endTime: string;
  /** First name for the subscriber. Will always be extracted from the token unless service token is used. */
  firstName?: string;
  /** GeoJSON formatted geometry related to the event */
  geometry?: ICreateEventGeometry;
  /** Last name for the subscriber. Will always be extracted from the token unless service token is used. */
  lastName?: string;
  /** Flag to notify attendees */
  notifyAttendees?: boolean;
  /** Online meetings for the event. Required if attendanceType includes VIRTUAL */
  onlineMeetings?: ICreateOnlineMeeting[];
  /** Groups with read access to the event */
  readGroups?: string[];
  /** start date string formatted YYYY-MM-DD */
  startDate: string;
  /** start time string 24 hour formatted HH:MM:SS */
  startTime: string;
  /** Summary of the event */
  summary?: string;
  /** Tags for the event */
  tags?: string[];
  /** IANA time zone for the event */
  timeZone: string;
  /** Title of the event */
  title: string;
  /** Username for the subscriber. Will always be extracted from the token unless service token is used. */
  username?: string;
}

export enum AssociationEntityType {
  Hub_Site_Application = "Hub Site Application",
  Hub_Initiative = "Hub Initiative",
  Hub_Project = "Hub Project",
}
export interface ICreateAssociation {
  /** Entity Id */
  entityId: string;
  /** Entity type */
  entityType: AssociationEntityType;
}

export enum EventAccess {
  PRIVATE = "PRIVATE",
  ORG = "ORG",
  PUBLIC = "PUBLIC",
}
export interface ICreateAddress {
  /** Street address */
  address: string;
  /** Secondary address information (room, etc) */
  address2?: string;
  /** Capacity of this location. Minimum value is 1 */
  capacity?: number;
  /** Description for the address */
  description?: string;
  /** Venue information for the address */
  venue?: string;
}

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const createEvent = (
  iCreateEvent: ICreateEvent,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IEvent>(
    {
      url: `/api/events/v1/events`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: iCreateEvent,
    },
    options
  );
};

export const getEvents = (
  params?: GetEventsParams,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IPagedEventResponse>(
    { url: `/api/events/v1/events`, method: "GET", params },
    options
  );
};

export const getEvent = (
  id: string,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IEvent>(
    { url: `/api/events/v1/events/${id}`, method: "GET" },
    options
  );
};

export const updateEvent = (
  id: string,
  iUpdateEvent: IUpdateEvent,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IEvent>(
    {
      url: `/api/events/v1/events/${id}`,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: iUpdateEvent,
    },
    options
  );
};

export const deleteEvent = (
  id: string,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IEvent>(
    { url: `/api/events/v1/events/${id}`, method: "DELETE" },
    options
  );
};

export const createRegistration = (
  iCreateRegistration: ICreateRegistration,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IRegistration>(
    {
      url: `/api/events/v1/registrations`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: iCreateRegistration,
    },
    options
  );
};

export const getRegistrations = (
  params?: GetRegistrationsParams,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IPagedRegistrationResponse>(
    { url: `/api/events/v1/registrations`, method: "GET", params },
    options
  );
};

export const getRegistration = (
  id: number,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IRegistration>(
    { url: `/api/events/v1/registrations/${id}`, method: "GET" },
    options
  );
};

export const updateRegistration = (
  id: number,
  iUpdateRegistration: IUpdateRegistration,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IRegistration>(
    {
      url: `/api/events/v1/registrations/${id}`,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: iUpdateRegistration,
    },
    options
  );
};

export const deleteRegistration = (
  id: number,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IRegistration>(
    { url: `/api/events/v1/registrations/${id}`, method: "DELETE" },
    options
  );
};

export type CreateEventResult = NonNullable<
  Awaited<ReturnType<typeof createEvent>>
>;
export type GetEventsResult = NonNullable<
  Awaited<ReturnType<typeof getEvents>>
>;
export type GetEventResult = NonNullable<Awaited<ReturnType<typeof getEvent>>>;
export type UpdateEventResult = NonNullable<
  Awaited<ReturnType<typeof updateEvent>>
>;
export type DeleteEventResult = NonNullable<
  Awaited<ReturnType<typeof deleteEvent>>
>;
export type CreateRegistrationResult = NonNullable<
  Awaited<ReturnType<typeof createRegistration>>
>;
export type GetRegistrationsResult = NonNullable<
  Awaited<ReturnType<typeof getRegistrations>>
>;
export type GetRegistrationResult = NonNullable<
  Awaited<ReturnType<typeof getRegistration>>
>;
export type UpdateRegistrationResult = NonNullable<
  Awaited<ReturnType<typeof updateRegistration>>
>;
export type DeleteRegistrationResult = NonNullable<
  Awaited<ReturnType<typeof deleteRegistration>>
>;
