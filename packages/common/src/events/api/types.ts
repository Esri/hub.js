export {
  AssociationEntityType,
  EventAccess,
  EventAttendanceType,
  EventStatus,
  GetEventsParams,
  IAddress,
  IAddressExtent,
  IAddressLocation,
  IAssociation,
  ICreateAssociation,
  IOnlineMeeting,
  ICreateOnlineMeeting,
  ICreateAddress,
  ICreateEvent,
  ICreateEventGeometry,
  ICreateRegistration,
  IEvent,
  IEventPermission,
  IEventCatalogItem,
  IEventGeometry,
  IRegistration,
  IRegistrationPermission,
  IUpdateEvent,
  IUpdateRegistration,
  GetRegistrationsParams,
  IUser,
  RegistrationRole,
  RegistrationStatus,
  RegistrationSort,
  SortOrder,
  EventSort,
  IPagedRegistrationResponse,
  IPagedEventResponse,
} from "./orval/api/orval-events";
import { IHubRequestOptions } from "../../types";
import {
  ICreateEvent,
  IUpdateEvent,
  GetEventsParams,
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
export interface IGetEventsParams extends IEventsRequestOptions {
  data: GetEventsParams;
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
  registrationId: number;
}
export interface IUpdateRegistrationParams extends IEventsRequestOptions {
  registrationId: number;
  data: IUpdateRegistration;
}
export interface IDeleteRegistrationParams extends IEventsRequestOptions {
  registrationId: number;
}
