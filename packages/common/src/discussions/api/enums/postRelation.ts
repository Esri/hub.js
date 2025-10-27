/**
 * relations of post entity
 *
 * @export
 * @enum {string}
 */
export enum PostRelation {
  REPLIES = "replies",
  REPLY_COUNT = "replyCount",
  REACTIONS = "reactions",
  PARENT = "parent",
  CHANNEL = "channel",
  CHANNEL_ACL = "channelAcl",
}
