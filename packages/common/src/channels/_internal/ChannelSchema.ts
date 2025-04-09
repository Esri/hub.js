import { IConfigurationSchema } from "../../core/schemas/types";
import {
  CHANNEL_PERMISSIONS,
  ChannelNonePermission,
} from "./ChannelBusinessRules";

/**
 * @private
 * The supported channel editor types
 */
export const ChannelEditorTypes = [
  "hub:channel:create",
  "hub:channel:edit",
] as const;

/**
 * @private
 * The union of all supported channel editor types
 */
export type ChannelEditorType = (typeof ChannelEditorTypes)[number];

/**
 * @private
 * The channel editor schema
 */
export const ChannelSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    blockWords: {
      type: "string",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      format: "blockWords",
    },
    publicConfigs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          entityId: { type: "string" },
          entityType: { type: "string" },
          roles: {
            type: "object",
            properties: {
              anonymous: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [
                      ChannelNonePermission,
                      CHANNEL_PERMISSIONS.channelRead,
                    ],
                    default: ChannelNonePermission,
                  },
                  id: { type: "string" },
                },
              },
              authenticated: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [
                      ChannelNonePermission,
                      CHANNEL_PERMISSIONS.channelRead,
                      CHANNEL_PERMISSIONS.channelReadWrite,
                    ],
                    default: ChannelNonePermission,
                  },
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    orgConfigs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          entityId: { type: "string" },
          entityType: { type: "string" },
          roles: {
            type: "object",
            properties: {
              member: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [
                      ChannelNonePermission,
                      CHANNEL_PERMISSIONS.channelRead,
                      CHANNEL_PERMISSIONS.channelReadWrite,
                    ],
                    default: ChannelNonePermission,
                  },
                  id: { type: "string" },
                },
              },
              admin: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [CHANNEL_PERMISSIONS.channelOwner],
                    default: CHANNEL_PERMISSIONS.channelOwner,
                  },
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    groupConfigs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          entityId: { type: "string" },
          entityType: { type: "string" },
          roles: {
            type: "object",
            properties: {
              member: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [
                      ChannelNonePermission,
                      CHANNEL_PERMISSIONS.channelRead,
                      CHANNEL_PERMISSIONS.channelReadWrite,
                      CHANNEL_PERMISSIONS.channelModerate,
                      CHANNEL_PERMISSIONS.channelManage,
                      CHANNEL_PERMISSIONS.channelOwner,
                    ],
                    default: ChannelNonePermission,
                  },
                  id: { type: "string" },
                },
              },
              admin: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [
                      ChannelNonePermission,
                      CHANNEL_PERMISSIONS.channelRead,
                      CHANNEL_PERMISSIONS.channelReadWrite,
                      CHANNEL_PERMISSIONS.channelModerate,
                      CHANNEL_PERMISSIONS.channelManage,
                      CHANNEL_PERMISSIONS.channelOwner,
                    ],
                    default: ChannelNonePermission,
                  },
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    userConfigs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          entityId: { type: "string" },
          entityType: { type: "string" },
          roles: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    enum: [
                      ChannelNonePermission,
                      CHANNEL_PERMISSIONS.channelRead,
                      CHANNEL_PERMISSIONS.channelReadWrite,
                    ],
                    default: ChannelNonePermission,
                  },
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    allowAsAnonymous: {
      type: "boolean",
      default: false,
    },
  },
  required: ["name"],
};
