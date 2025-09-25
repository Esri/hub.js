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
