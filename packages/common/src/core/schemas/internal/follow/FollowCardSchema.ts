import { IConfigurationSchema } from "../../types";

export const FollowCardSchema: IConfigurationSchema = {
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
    callToAction: {
      type: "string",
      default:
        "By following this site you will get updates about new events, surveys, and tools that you can use to help us achieve our goals.",
    },
    callToActionAlignment: {
      enum: ["start", "center", "end"],
      default: "center",
      type: "string",
    },
    followStateText: {
      type: "string",
      default: "Follow",
    },
    unfollowStateText: {
      type: "string",
      default: "Unfollow",
    },
    buttonAlignment: {
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
