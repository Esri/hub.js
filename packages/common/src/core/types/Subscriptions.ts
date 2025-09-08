import { Cadence } from "../../newsletters-scheduler/api/orval/api/orval-newsletters-scheduler";
import { IHubCatalog } from "../../search/types/IHubCatalog";
import { HubEntityType } from "./HubEntityType";

/**
 * Enumerates the different kinds of subscriptions a user can have.
 * Used as a discriminant to define and differentiate between subscription types.
 */
export enum SubscriptionKind {
  DISCUSSION = "discussion",
  // future:
  // SITE = "site",
  // INITIATIVE = "initiative",
  // EVENT = "event",
}

/**
 * Defines the common fields shared by all Hub subscription types.
 * Extend this interface when defining a specific subscription model.
 */
interface IHubSubscription {
  cadence: Cadence;
  catalog: IHubCatalog;
  id: string;
  userId: string;
  entityId: string;
  entityType: HubEntityType;
}

/**
 * Defines a union of all Hub subscription types.
 * Currently only includes discussions, but designed to expand.
 */
export type HubSubscription = IHubDiscussionSubscription;
// | IHubSiteSubscription
// | IHubInitiativeSubscription
// | IHubEventSubscription
// ...

/**
 * Defines the shape of subscriptions to discussions.
 */
interface IHubDiscussionSubscription extends IHubSubscription {
  kind: SubscriptionKind.DISCUSSION;
  allowedChannelIds: string[];
  isPendingPostActionActive: boolean;
  isNewPostActionActive: boolean;
}
/*
interface IHubSiteSubscription extends IHubSubscription {
  kind: SubscriptionKind.SITE;
  newContentIds: string[];
  ...
}
interface IHubInitiativeSubscription extends IHubSubscription {
  kind: SubscriptionKind.INITIATIVE;
  pendingProjectAssociations: string[];
  ...
}
...
*/
