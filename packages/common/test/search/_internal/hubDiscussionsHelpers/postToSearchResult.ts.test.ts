import { postToSearchResult } from "../../../../src/search/_internal/hubDiscussionsHelpers/postToSearchResult";
import { IPost } from "../../../../src/discussions/api/types";
import { AccessLevel } from "../../../../src/core/types/types";

describe("postToSearchResult", () => {
  let post: IPost;
  beforeEach(() => {
    post = {
      id: "p1",
      title: "My post title",
      body: "My post body",
      status: "published",
      discussion: "d1",
      postType: "text",
      channelId: "c1",
      channel: { id: "c1", name: "General" },
      parentId: undefined,
      parent: undefined,
      replies: [],
      replyCount: 0,
      reactions: [],
      createdAt: "2024-04-22T12:56:00.189Z",
      updatedAt: "2024-04-22T12:57:00.189Z",
      creator: { username: "jdoe" },
      editor: { username: "jdoe" },
    } as unknown as IPost;
  });

  it("should return an IHubSearchResult for the post", () => {
    const result = postToSearchResult(post);
    expect(result).toEqual({
      id: post.id,
      type: "Post",
      title: post.title,
      name: post.title,
      body: post.body,
      status: post.status,
      discussion: post.discussion,
      postType: post.postType,
      channelId: post.channelId,
      channel: post.channel,
      parentId: post.parentId,
      parent: post.parent,
      replies: post.replies,
      replyCount: post.replyCount,
      reactions: post.reactions,
      createdDate: jasmine.any(Date) as any,
      createdDateSource: "post.createdAt",
      updatedDate: jasmine.any(Date) as any,
      updatedDateSource: "post.updatedAt",
      creator: post.creator,
      editor: post.editor,
      access: null as AccessLevel,
      family: "post",
    });
    expect(result.createdDate).toEqual(jasmine.any(Date) as any);
    expect(result.updatedDate).toEqual(jasmine.any(Date) as any);
    expect(result.name).toEqual(post.title);
    expect(result.access).toEqual(null as AccessLevel);
    expect(result.family).toEqual("post" as const);
    expect(result.body).toEqual(post.body);
    expect(result.status).toEqual(post.status);
    expect(result.discussion).toEqual(post.discussion);
    expect(result.postType).toEqual(post.postType);
    expect(result.channelId).toEqual(post.channelId);
    expect(result.channel).toEqual(post.channel);
    expect(result.parentId).toEqual(post.parentId);
    expect(result.parent).toEqual(post.parent);
    expect(result.replies).toEqual(post.replies);
    expect(result.replyCount).toEqual(post.replyCount);
    expect(result.reactions).toEqual(post.reactions);
    expect(result.creator).toEqual(post.creator);
    expect(result.editor).toEqual(post.editor);
  });

  it("should handle missing fields", () => {
    post.body = undefined;
    post.replies = undefined;
    post.reactions = undefined;
    const result = postToSearchResult(post);
    expect(result.body).toBeUndefined();
    expect(result.replies).toBeUndefined();
    expect(result.reactions).toBeUndefined();
  });
});
