export {
  /* istanbul ignore next */
  EventAssociationEntityType,
  EventAccess,
  EventAttendanceType,
  EventStatus,
  ISearchEvents,
  IEventAssociation,
  ICreateEventAssociation,
  IOnlineMeeting,
  ICreateOnlineMeeting,
  ICreateEvent,
  ICreateRegistration,
  IEvent,
  IEventPermission,
  IEventLocation,
  IEventLocationGeometriesItem,
  ILocationSpatialReference,
  IEventLocationSpatialReference,
  ICreateLocationSpatialReference,
  IEventRegistrationCount,
  ICreateEventLocation,
  ICreateEventLocationGeometriesItem,
  IRegistration,
  IRegistrationPermission,
  IUpdateEvent,
  IUpdateRegistration,
  GetRegistrationsParams,
  IUser,
  RegistrationRole,
  RegistrationStatus,
  RegistrationSort,
  EventSortOrder,
  /* istanbul ignore next */
  EventSort,
  EventLocationType,
  IPagedRegistrationResponse,
  IPagedEventResponse,
} from "./orval/api/orval-events";
import { IHubRequestOptions } from "../../hub-types";
import {
  ICreateEvent,
  IUpdateEvent,
  ISearchEvents,
  ICreateRegistration,
  IUpdateRegistration,
  GetRegistrationsParams,
} from "./orval/api/orval-events";

/**
 * options for making requests against the Events API
 *
 * @export
 * @interface IEventsRequestOptions
 * @extends IHubRequestOptions
 */
export interface IEventsRequestOptions
  extends Omit<IHubRequestOptions, "httpMethod" | "isPortal">,
    Pick<RequestInit, "mode" | "cache" | "credentials"> {
  httpMethod?: "GET" | "POST" | "PATCH" | "DELETE";
  isPortal?: boolean;
  token?: string;
  data?: {
    [key: string]: any;
  };
}

export interface ICreateEventParams extends IEventsRequestOptions {
  data: ICreateEvent;
}
export interface ISearchEventsParams extends IEventsRequestOptions {
  data: ISearchEvents;
}
export interface IGetEventParams extends IEventsRequestOptions {
  eventId: string;
}
export interface IUpdateEventParams extends IEventsRequestOptions {
  eventId: string;
  data: IUpdateEvent;
}
export interface IDeleteEventParams extends IEventsRequestOptions {
  eventId: string;
}

export interface ICreateRegistrationParams extends IEventsRequestOptions {
  data: ICreateRegistration;
}
export interface IGetRegistrationsParams extends IEventsRequestOptions {
  data: GetRegistrationsParams;
}
export interface IGetRegistrationParams extends IEventsRequestOptions {
  registrationId: string;
}
export interface IUpdateRegistrationParams extends IEventsRequestOptions {
  registrationId: string;
  data: IUpdateRegistration;
}
export interface IDeleteRegistrationParams extends IEventsRequestOptions {
  registrationId: string;
}
