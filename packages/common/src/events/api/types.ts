export {
  IUpdateRegistration,
  ICreateRegistration,
  IUpdateEvent,
  EventStatus,
  RegistrationStatus,
  RegistrationRole,
  IUser,
  IRegistration,
  // ICreateEventLocationsItem,
  EventAttendanceType,
  IEvent,
  ICreateEvent,
} from "./orval/api/orval-events";
import { IHubRequestOptions } from "../../types";
import {
  ICreateEvent,
  IUpdateEvent,
  ICreateRegistration,
  IUpdateRegistration,
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
