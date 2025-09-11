import { IPermissionPolicy } from "../../permissions/types/IPermissionPolicy";
import { ChannelPermissions } from "./ChannelPermissions";

/**
 * @private
 * An array of all supported channel permissions
 */
// export const ChannelPermissions = [
//   "hub:channel",
//   "hub:channel:create",
//   "hub:channel:delete",
//   "hub:channel:edit",
//   "hub:channel:view",
//   "hub:channel:owner",
//   "hub:channel:manage",
//   "hub:channel:read",
//   "hub:channel:write",
//   "hub:channel:readWrite",
//   "hub:channel:moderate",
// ] as const;

/**
 * @private
 * A union type representing all the supported channel permissions
 */
export type ChannelPermission = (typeof ChannelPermissions)[number];

/**
 * A pseudo-permission used as a placeholder for the "None" permission option
 */
export const ChannelNonePermission = "hub:channel:none";

/**
 * @private
 * A map of all supported channel permissions
 */
export const CHANNEL_PERMISSIONS: Record<
  | "channelRoot"
  | "channelCreate"
  | "channelDelete"
  | "channelEdit"
  | "channelView"
  | "channelOwner"
  | "channelManage"
  | "channelRead"
  | "channelWrite"
  | "channelReadWrite"
  | "channelModerate",
  ChannelPermission
> = {
  channelRoot: "hub:channel",
  channelCreate: "hub:channel:create",
  channelDelete: "hub:channel:delete",
  channelEdit: "hub:channel:edit",
  channelView: "hub:channel:view",
  channelOwner: "hub:channel:owner",
  channelManage: "hub:channel:manage",
  channelRead: "hub:channel:read",
  channelWrite: "hub:channel:write",
  channelReadWrite: "hub:channel:readWrite",
  channelModerate: "hub:channel:moderate",
};

export const ChannelPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: CHANNEL_PERMISSIONS.channelCreate,
    dependencies: ["hub:discussion"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
];
