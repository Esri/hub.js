import { IHubRequestOptions } from "../../types";
import {
  IRegistrationStatus as RegistrationStatus, // enum export fixed in the upcoming orval release (6.24.0). Revisit when published
  IRegistrationRole as RegistrationRole, // enum export fixed in the upcoming orval release (6.24.0). Revisit when published
  IEventStatus as EventStatus, // enum export fixed in the upcoming orval release (6.24.0). Revisit when published
  IEventAttendanceTypeItem as EventAttendanceType, // enum export fixed in the upcoming orval release (6.24.0). Revisit when published
  IUser,
  IEvent,
  IRegistration,
  UpdateEventDto as IUpdateEvent,
  CreateEventDto as ICreateEvent,
  UpdateRegistrationDto as IUpdateRegistration,
  CreateRegistrationDto as ICreateRegistration,
  CreateEventResult as ICreateEventResponse,
  GetEventsResult as IGetEventsResponse,
  GetEventResult as IGetEventResponse,
  UpdateEventResult as IUpdateEventResponse,
  DeleteEventResult as IDeleteEventResponse,
  CreateRegistrationResult as ICreateRegistrationResponse,
  GetRegistrationsResult as IGetRegistrationsResponse,
  GetRegistrationResult as IGetRegistrationResponse,
  UpdateRegistrationResult as IUpdateRegistrationResponse,
  DeleteRegistrationResult as IDeleteRegistrationResponse,
  ConfirmRegistrationResult as IConfirmRegistrationResponse,
} from "./orval/api/orval";

export {
  RegistrationStatus,
  RegistrationRole,
  EventStatus,
  EventAttendanceType,
  IUser,
  IEvent,
  IRegistration,
  IUpdateEvent,
  ICreateEvent,
  IUpdateRegistration,
  ICreateRegistration,
  ICreateEventResponse,
  IGetEventsResponse,
  IGetEventResponse,
  IUpdateEventResponse,
  IDeleteEventResponse,
  ICreateRegistrationResponse,
  IGetRegistrationsResponse,
  IGetRegistrationResponse,
  IUpdateRegistrationResponse,
  IDeleteRegistrationResponse,
  IConfirmRegistrationResponse,
};

/**
 * options for making requests against the Events API
 *
 * @export
 * @interface IEventsRequestOptions
 * @extends {RequestInit}
 */
// NOTE: this is as close to implementing @esri/hub-common IHubRequestOptions as possible
// only real exception is needing to extend httpMethod to include PATCH and DELETE
// also making isPortal optional for convenience
// picking fields from requestInit for development against local api
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
// export interface IGetEventsParams extends IEventsRequestOptions {
//   data: any;
// }
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
// export interface IGetRegistrationsParams extends IEventsRequestOptions {
//   data: any;
// }
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
// export interface IConfirmRegistrationParams extends IEventsRequestOptions {
//   data: any;
// }
