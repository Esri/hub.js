/* tslint:disable:interface-over-type-literal */
/**
 * Generated by orval v6.24.0 🍺
 * Do not edit manually.
 * Hub Events Service
 * OpenAPI spec version: 0.0.1
 */
import { Awaited } from "../awaited-type";
import { customClient } from "../custom-client";
export type GetEventsParams = {
  /**
   * Include registrations with each event
   */
  includeRegistrations?: string;
  /**
   * Include creator with each event
   */
  includeCreator?: string;
  /**
   * latest ISO8601 start date-time for the events
   */
  startDateTimeBefore?: string;
  /**
   * earliest ISO8601 start date-time for the events
   */
  startDateTimeAfter?: string;
  /**
   * Comma separated sting list of AttendanceTypes
   */
  attendanceTypes?: string;
  /**
   * comma separated string list of event statuses
   */
  status?: string;
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
};

export interface IUpdateRegistration {
  /** Role of the user in the event */
  role?: RegistrationRole;
  /** Status of the registration */
  status?: RegistrationStatus;
  /** Attendance type for this registration */
  type?: EventAttendanceType;
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
  /** Valid ways to attend the event */
  attendanceType?: EventAttendanceType[];
  /** Description of the event */
  description?: string;
  /** Groups with edit access to the event */
  editGroups?: string[];
  /** ISO8601 end date-time for the event */
  endDateTime?: string;
  /** GeoJSON formatted geometry related to the event */
  geometry?: IUpdateEventGeometry;
  /** Flag to notify attendees */
  notifyAttendees?: boolean;
  /** Online meetings for the event */
  onlineMeetings?: ICreateOnlineMeeting[];
  /** Groups with read access to the event */
  readGroups?: string[];
  /** ISO8601 start date-time for the event */
  startDateTime?: string;
  /** Summary of the event */
  summary?: string;
  /** IANA time zone for the event */
  timeZone?: string;
  /** Title of the event */
  title?: string;
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

export interface IEvent {
  access: EventAccess;
  addresses?: IAddress[];
  allDay: boolean;
  allowRegistration: boolean;
  attendanceType: EventAttendanceType[];
  catalog: IEventCatalogItem[] | null;
  createdAt: string;
  createdById: string;
  creator?: IUser;
  description: string | null;
  editGroups: string[] | null;
  endDateTime: string;
  geometry: IEventGeometry;
  id: string;
  notifyAttendees: boolean;
  onlineMeetings?: IOnlineMeeting[];
  orgId: string;
  permission: IEventPermission;
  readGroups: string[] | null;
  recurrence: string | null;
  registrations?: IRegistration[];
  startDateTime: string;
  status: EventStatus;
  summary: string | null;
  timeZone: string;
  title: string;
  updatedAt: string;
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
  /** Valid ways to attend the event */
  attendanceType?: EventAttendanceType[];
  /** Description of the event */
  description?: string;
  /** Groups with edit access to the event */
  editGroups?: string[];
  /** Email for the subscriber. Will always be extracted from the token unless service token is used. */
  email?: string;
  /** ISO8601 end date-time for the event */
  endDateTime: string;
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
  /** ISO8601 start date-time for the event */
  startDateTime: string;
  /** Summary of the event */
  summary?: string;
  /** IANA time zone for the event */
  timeZone: string;
  /** Title of the event */
  title: string;
  /** Username for the subscriber. Will always be extracted from the token unless service token is used. */
  username?: string;
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
  return customClient<IEvent[]>(
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
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<IRegistration[]>(
    { url: `/api/events/v1/registrations`, method: "GET" },
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
