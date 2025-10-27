import { describe, it, expect } from "vitest";
import { processRelations } from "../../../../src/search/_internal/hubDiscussionsHelpers/processRelations";
import { PostRelation } from "../../../../src/discussions/api/enums/postRelation";

describe("processRelations", () => {
  it("returns empty array for empty input", () => {
    expect(processRelations([])).toEqual([]);
  });

  it("maps valid bare tokens to PostRelation values", () => {
    const tokens = [
      "channel",
      "parent",
      "replies",
      "replyCount",
      "reactions",
      "channelAcl",
    ];
    const result = processRelations(tokens);
    expect(result).toEqual([
      PostRelation.CHANNEL,
      PostRelation.PARENT,
      PostRelation.REPLIES,
      PostRelation.REPLY_COUNT,
      PostRelation.REACTIONS,
      PostRelation.CHANNEL_ACL,
    ]);
  });

  it("deduplicates duplicates while preserving first occurrence order", () => {
    const tokens = [
      "replies",
      "channel",
      "replies", // duplicate
      "replyCount",
      "channel", // duplicate
      "reactions",
      "reactions", // duplicate
      "parent",
      "channelAcl",
      "parent", // duplicate
    ];
    const result = processRelations(tokens);
    expect(result).toEqual([
      PostRelation.REPLIES,
      PostRelation.CHANNEL,
      PostRelation.REPLY_COUNT,
      PostRelation.REACTIONS,
      PostRelation.PARENT,
      PostRelation.CHANNEL_ACL,
    ]);
  });

  it("ignores unknown tokens", () => {
    const tokens = ["channel", "bogus", "replies", "nonsense"];
    const result = processRelations(tokens);
    expect(result).toEqual([PostRelation.CHANNEL, PostRelation.REPLIES]);
  });
});
