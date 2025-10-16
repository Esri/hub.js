export {
  Cadence as NewsletterCadence,
  /* istanbul ignore next */
  DeliveryMethod,
  ICreateEventMetadata,
  ICreateTelemetryReportMetadata,
  INotificationSpec,
  ISubscribeMetadata,
  ISubscription,
  ISubscriptionMetadata,
  IUser,
  /* istanbul ignore next */
  SystemNotificationSpecNames,
  /* istanbul ignore next */
  SubscriptionAction,
} from "./orval/api/orval-newsletters";
import { IHubRequestOptions } from "../../hub-types";
import {
  GetSubscriptionsParams,
  ICreateSubscription,
  ICreateUser,
  ISubscribe,
  IUpdateSubscription,
  IUpdateUser,
} from "./orval/api/orval-newsletters";

/**
 * options for making requests against the Newsletters API
 *
 * @export
 * @interface INewslettersRequestOptions
 * @extends IHubRequestOptions
 */
export interface INewslettersRequestOptions
  extends Omit<IHubRequestOptions, "httpMethod" | "isPortal">,
    Pick<RequestInit, "mode" | "cache" | "credentials"> {
  httpMethod?: "GET" | "POST" | "PATCH" | "DELETE";
  isPortal?: boolean;
  token?: string;
  data?: {
    [key: string]: any;
  };
}

// users
export interface ICreateUserParams extends INewslettersRequestOptions {
  data: ICreateUser;
}

export interface IGetUserParams extends INewslettersRequestOptions {
  userId: string;
}
export interface IUpdateUserParams extends INewslettersRequestOptions {
  userId: string;
  data: IUpdateUser;
}
export interface IDeleteUserParams extends INewslettersRequestOptions {
  userId: string;
}

// subscribe (create user if not exists and subscription)
export interface ISubscribeParams extends INewslettersRequestOptions {
  data: ISubscribe;
}

// subscriptions
export interface ICreateSubscriptionParams extends INewslettersRequestOptions {
  data: ICreateSubscription;
}
export interface IGetSubscriptionsParams extends INewslettersRequestOptions {
  data: GetSubscriptionsParams;
}
export interface IGetSubscriptionParams extends INewslettersRequestOptions {
  subscriptionId: number;
}
export interface IUpdateSubscriptionParams extends INewslettersRequestOptions {
  subscriptionId: number;
  data: IUpdateSubscription;
}
