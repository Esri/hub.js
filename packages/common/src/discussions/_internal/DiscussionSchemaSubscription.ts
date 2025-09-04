import { IConfigurationSchema } from "../../core/schemas/types";
import { Cadence } from "../../newsletters/api/orval/api/orval-newsletters";

export const ITEM_ACTIVITIES = [
  "newsletters",
  "newContent",
  "newEvents",
  "itemDetailChanges",
  "metricUpdates",
  "collaborationRequests",
  "statusUpdates",
] as const;

export type ItemActivity = (typeof ITEM_ACTIVITIES)[number];

export const DISCUSSION_ACTIVITIES = ["newPosts", "pendingPosts"] as const;

export type DiscussionActivity = (typeof DISCUSSION_ACTIVITIES)[number];

export const discussionSubscriptionSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    cadence: {
      type: "string",
      default: Cadence.WEEKLY,
    },
    itemActivity: {
      type: "array",
      items: {
        type: "string",
        enum: [...ITEM_ACTIVITIES],
      },
      default: [...ITEM_ACTIVITIES],
    },
    channels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          subscriptions: {
            type: "array",
            items: {
              type: "string",
              enum: [...DISCUSSION_ACTIVITIES],
            },
            default: [...DISCUSSION_ACTIVITIES],
          },
        },
      },
    },
  },
};
