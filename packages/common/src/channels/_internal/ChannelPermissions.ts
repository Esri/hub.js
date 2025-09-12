/**
 * @private
 * An array of all supported channel permissions
 */
export const ChannelPermissions = [
  "hub:channel",
  "hub:channel:create",
  "hub:channel:delete",
  "hub:channel:edit",
  "hub:channel:view",
  "hub:channel:owner",
  "hub:channel:manage",
  "hub:channel:read",
  "hub:channel:write",
  "hub:channel:readWrite",
  "hub:channel:moderate",
] as const;
