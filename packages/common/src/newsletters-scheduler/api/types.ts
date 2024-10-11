export {
  ISubscriptionMetadata,
  ISubscriptionCatalog,
  IUser,
  INotificationSpec,
  DeliveryMethod,
  ISubscription,
  SystemNotificationSpecNames,
  SubscriptionEntityType,
  Cadence,
  SubscriptionActions,
  INotify,
} from "./orval/api/orval-newsletters-scheduler";
import { IHubRequestOptions } from "../../types";
import { INotify } from "./orval/api/orval-newsletters-scheduler";

/**
 * options for making requests against the Newsletters Scheduler API
 *
 * @export
 * @interface INewslettersSchedulerRequestOptions
 * @extends IHubRequestOptions
 */
export interface INewslettersSchedulerRequestOptions
  extends Omit<IHubRequestOptions, "httpMethod" | "isPortal">,
    Pick<RequestInit, "mode" | "cache" | "credentials"> {
  httpMethod?: "GET" | "POST" | "PATCH" | "DELETE";
  isPortal?: boolean;
  token?: string;
  data?: {
    [key: string]: any;
  };
}

export interface INotifyParams extends INewslettersSchedulerRequestOptions {
  data: INotify;
}