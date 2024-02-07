import { IConfigurationSchema } from "../../types";

export const FollowSchema: IConfigurationSchema = {
  type: "object",
  required: [],
  properties: {
    itemGalleryWithDefault: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 10,
      default: [],
    },
    entityId: {
      type: "string",
    },
    callToActionText: {
      type: "string",
      default:
        "By following this site you will get updates about new events, surveys, and tools that you can use to help us achieve our goals.",
    },
    callToActionAlign: {
      enum: ["start", "center", "end"],
      default: "center",
      type: "string",
    },
    buttonText: {
      type: "string",
      default: "Follow",
    },
    unfollowButtonText: {
      type: "string",
      default: "Unfollow",
    },
    buttonAlign: {
      enum: ["start", "center", "end"],
      default: "center",
      type: "string",
    },
    buttonStyle: {
      type: "string",
      enum: ["solid", "outline"],
      default: "solid",
    },
  },
};
