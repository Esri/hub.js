/* tslint:disable:interface-over-type-literal */
import { Awaited } from "../awaited-type";

/**
 * Generated by orval v6.24.0 🍺
 * Do not edit manually.
 * Hub Newsletters Scheduler
 * OpenAPI spec version: 0.0.1
 */
import { customClient } from "../custom-client";
export type ISubscriptionMetadata = { [key: string]: any };

export type ISubscriptionCatalog = { [key: string]: any } | null;

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

export interface INotificationSpec {
  createdAt: string;
  createdById: string;
  description: string;
  id: number;
  name: string;
  updatedAt: string;
}

export enum DeliveryMethod {
  EMAIL = "EMAIL",
}
export interface ISubscription {
  actions: SubscriptionActions[];
  active: boolean;
  cadence: Cadence;
  catalog?: ISubscriptionCatalog;
  createdAt: string;
  deliveryMethod: DeliveryMethod;
  entityId: string;
  entityType: SubscriptionEntityType;
  id: number;
  lastDelivery: string;
  metadata: ISubscriptionMetadata;
  notificationSpec?: INotificationSpec;
  notificationSpecId: number;
  updatedAt: string;
  user?: IUser;
  userId: string;
}

export enum SystemNotificationSpecNames {
  TELEMETRY_REPORT = "TELEMETRY_REPORT",
  EVENT = "EVENT",
  DISCUSSION_ON_ENTITY = "DISCUSSION_ON_ENTITY",
}
export enum SubscriptionEntityType {
  DISCUSSION = "DISCUSSION",
}
export enum Cadence {
  ON_EVENT = "ON_EVENT",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}
export enum SubscriptionActions {
  DISCUSSION_POST_PENDING = "DISCUSSION_POST_PENDING",
}
export interface INotify {
  /** An array of actions representing user selections that further customize the subscription behavior */
  actions?: SubscriptionActions[];
  /** Frequency of the subscription */
  cadence: Cadence;
  /** The AGO id of the entity associated with the subscription */
  entityId?: string;
  /** The type of entity associated with the subscription entityId */
  entityType?: SubscriptionEntityType;
  /** Notification spec name for the subscription */
  notificationSpecName: SystemNotificationSpecNames;
}

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const notify = (
  iNotify: INotify,
  options?: SecondParameter<typeof customClient>
) => {
  return customClient<ISubscription[]>(
    {
      url: `/api/newsletters-scheduler/v1/subscriptions/notify`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: iNotify,
    },
    options
  );
};

export type NotifyResult = NonNullable<Awaited<ReturnType<typeof notify>>>;
