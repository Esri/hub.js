import { postToSearchResult } from "../../../../src/search/_internal/hubDiscussionsHelpers/postToSearchResult";
import { IPost } from "../../../../src/discussions/api/types";

describe("postToSearchResult", () => {
  let post: IPost;
  beforeEach(() => {
    post = {
      id: "p1",
      title: "My post title",
      body: "My post body",
      createdAt: "2024-04-22T12:56:00.189Z",
      updatedAt: "2024-04-22T12:57:00.189Z",
      creator: { username: "jdoe" },
    } as unknown as IPost;
  });

  it("maps minimal post fields to IHubSearchResult shape", () => {
    const result = postToSearchResult(post);
    expect(result).toEqual({
      access: null,
      createdDate: expect.any(Date) as any,
      createdDateSource: "post.createdAt",
      family: "post",
      id: post.id,
      location: { type: "none" },
      name: post.title,
      owner: post.creator,
      rawResult: post,
      source: "",
      summary: post.body,
      type: "Post",
      updatedDate: expect.any(Date) as any,
      updatedDateSource: "post.updatedAt",
    });
  });
});
