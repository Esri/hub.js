import { PostRelation } from "../../../discussions/api/enums/postRelation";

const RELATIONS_MAP: Record<string, PostRelation> = {
  channel: PostRelation.CHANNEL,
  channelAcl: PostRelation.CHANNEL_ACL,
  parent: PostRelation.PARENT,
  reactions: PostRelation.REACTIONS,
  replies: PostRelation.REPLIES,
  replyCount: PostRelation.REPLY_COUNT,
};

/**
 * Convert an array of `include` into an array of PostRelation enum values.
 * @param relations array of include (e.g. ["channel", "replies"]).
 * @returns PostRelation[] with order of first appearance preserved and duplicates removed.
 */
export function processRelations(relations: string[] = []): PostRelation[] {
  const results: PostRelation[] = [];
  for (const rel of relations) {
    const mapped = RELATIONS_MAP[rel];
    if (mapped && !results.includes(mapped)) {
      results.push(mapped);
    }
  }
  return results;
}
