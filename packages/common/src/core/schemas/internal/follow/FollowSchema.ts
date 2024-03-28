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
      maxItems: 1,
      default: [],
    },
    entityId: {
      type: "array",
    },
    callToActionText: {
      type: "string",
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
