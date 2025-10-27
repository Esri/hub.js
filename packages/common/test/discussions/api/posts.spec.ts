import type { Geometry } from "geojson";
import { vi, afterEach, beforeEach, describe, it, expect } from "vitest";
import * as discussionsApiRequestModule from "../../../src/discussions/api/discussions-api-request";
import {
  IDiscussionsRequestOptions,
  IFetchPostParams,
  ICreatePost,
  ICreateChannelPost,
  IPagedResponse,
  IPost,
} from "../../../src/discussions/api/types";
import { SharingAccess } from "../../../src/discussions/api/enums/sharingAccess";
import { PostRelation } from "../../../src/discussions/api/enums/postRelation";
import { SearchPostsFormat } from "../../../src/discussions/api/enums/searchPostsFormat";
import { AclCategory } from "../../../src/discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../../src/discussions/api/enums/aclSubCategory";
import { Role } from "../../../src/discussions/api/enums/role";
import { PostStatus } from "../../../src/discussions/api/enums/postStatus";
import {
  createPost,
  createPostV2,
  createReply,
  createReplyV2,
  exportPosts,
  exportPostsV2,
  fetchPost,
  fetchPostV2,
  removePost,
  removePostV2,
  searchPosts,
  searchPostsV2,
  updatePost,
  updatePostStatus,
  updatePostStatusV2,
  updatePostV2,
} from "../../../src/discussions/api/posts/posts";

describe("posts V1", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = vi
      .spyOn(discussionsApiRequestModule, "discussionsApiRequest")
      .mockReturnValue(Promise.resolve(response));
  });

  afterEach(() => vi.restoreAllMocks());

  it("queries posts with no parameters", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.mockReturnValue(Promise.resolve(response));
    const options = { ...baseOpts };
    return searchPosts(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        data: {},
        httpMethod: "POST",
      });
    });
  });

  it("queries posts with parameters", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.mockReturnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    return searchPosts(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("queries posts with channel relation", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channel: { id: "channelId" } } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.mockReturnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      relations: [PostRelation.CHANNEL],
    };

    const options = { ...baseOpts, data: query };
    return searchPosts(options).then((results) => {
      expect(results).toEqual({
        ...response,
        items: [
          {
            id: "postId",
            channelId: "channelId",
            channel: { id: "channelId" },
          } as IPost,
        ],
      });
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("queries posts with geometry", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.mockReturnValue(Promise.resolve(response));
    const geometry: Geometry = {
      type: "Polygon",
      coordinates: [
        [
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90],
          [180, -90],
        ],
      ],
    };
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      geometry,
    };

    const options = { ...baseOpts, data: query };
    return searchPosts(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        httpMethod: "POST",
      });
    });
  });

  it("queries posts with featureGeometry", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.mockReturnValue(Promise.resolve(response));
    const geometry: Geometry = {
      type: "Polygon",
      coordinates: [
        [
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90],
          [180, -90],
        ],
      ],
    };
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      featureGeometry: geometry,
    };

    const options = { ...baseOpts, data: query };
    return searchPosts(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        httpMethod: "POST",
      });
    });
  });

  it("exports posts as a CSV string", () => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    return exportPosts(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        data: {
          ...options.data,
          f: SearchPostsFormat.CSV,
        },
        httpMethod: "POST",
      });
    });
  });

  it("creates post on unknown or non-existent channel", () => {
    const body: ICreateChannelPost = {
      access: SharingAccess.PRIVATE,
      groups: ["groupId"],
      body: "foo",
      channelAclDefinition: [
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.ADMIN,
          key: "groupId",
          role: Role.OWNER,
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          key: "groupId",
          role: Role.READ,
        },
      ],
    };

    const options = { ...baseOpts, data: body };
    return createPost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("creates post with mention url on unknown or non-existent channel", () => {
    const body: ICreateChannelPost = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo",
    };

    const options = {
      ...baseOpts,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    return createPost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts`);
      expect(opts).toEqual({
        ...baseOpts,
        data: body,
        httpMethod: "POST",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("creates post on known channel", () => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = { ...baseOpts, data: body };
    return createPost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("creates post on known channel with mention url", () => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = {
      ...baseOpts,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    return createPost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts`);
      expect(opts).toEqual({
        ...baseOpts,
        data: body,
        httpMethod: "POST",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("creates reply", () => {
    const postId = "postId";
    const requestBody = {
      body: "foo",
    };

    const options = { ...baseOpts, postId, data: requestBody };
    return createReply(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}/reply`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("creates reply with mention url", () => {
    const postId = "postId";
    const requestBody = {
      body: "foo",
    };

    const options = {
      postId,
      ...baseOpts,
      data: requestBody,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    return createReply(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}/reply`);
      expect(opts).toEqual({
        postId,
        ...baseOpts,
        data: requestBody,
        httpMethod: "POST",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("gets post", () => {
    const postId = "postId";
    const response = { id: postId, channelId: "channelId" } as IPost;
    requestSpy.mockReturnValue(Promise.resolve(response));

    const options = { ...baseOpts, postId };
    return fetchPost(options as IFetchPostParams).then((result) => {
      expect(result).toEqual(response);
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("gets post with channel relation", () => {
    const postId = "postId";
    const response = { id: postId, channel: { id: "channelId" } } as IPost;
    requestSpy.mockReturnValue(Promise.resolve(response));

    const options = { ...baseOpts, relations: [PostRelation.CHANNEL], postId };
    return fetchPost(options as IFetchPostParams).then((result) => {
      expect(result).toEqual({
        ...response,
        channelId: "channelId",
      });
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("deletes post", () => {
    const postId = "postId";

    const options = { ...baseOpts, postId };
    return removePost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });

  it("updates post body", () => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = { ...baseOpts, postId, data: body };
    return updatePost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
    });
  });

  it("updates post body with mention url", () => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = {
      ...baseOpts,
      postId,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };

    return updatePost(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({
        ...baseOpts,
        postId,
        data: body,
        httpMethod: "PATCH",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("updates post status", () => {
    const postId = "postId";

    const body = { status: PostStatus.APPROVED };

    const options = { ...baseOpts, postId, data: body };
    return updatePostStatus(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}/status`);
      expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
    });
  });
});

describe("posts V2", () => {
  let requestSpyV2: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpyV2 = vi
      .spyOn(discussionsApiRequestModule, "discussionsApiRequestV2")
      .mockReturnValue(Promise.resolve(response));
  });

  it("queries posts with no parameters", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.mockReturnValue(Promise.resolve(response));
    const options = { ...baseOpts };
    return searchPostsV2(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        data: {},
        httpMethod: "POST",
      });
    });
  });

  it("queries posts with parameters", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.mockReturnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    return searchPostsV2(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("queries posts with channel relation", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channel: { id: "channelId" } } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.mockReturnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      relations: [PostRelation.CHANNEL],
    };

    const options = { ...baseOpts, data: query };
    return searchPostsV2(options).then((results) => {
      expect(results).toEqual({
        ...response,
        items: [
          {
            id: "postId",
            channelId: "channelId",
            channel: { id: "channelId" },
          } as IPost,
        ],
      });
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("queries posts with geometry", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.mockReturnValue(Promise.resolve(response));
    const geometry: Geometry = {
      type: "Polygon",
      coordinates: [
        [
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90],
          [180, -90],
        ],
      ],
    };
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      geometry,
    };

    const options = { ...baseOpts, data: query };
    return searchPostsV2(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        httpMethod: "POST",
      });
    });
  });

  it("queries posts with featureGeometry", () => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.mockReturnValue(Promise.resolve(response));
    const geometry: Geometry = {
      type: "Polygon",
      coordinates: [
        [
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90],
          [180, -90],
        ],
      ],
    };
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      featureGeometry: geometry,
    };

    const options = { ...baseOpts, data: query };
    return searchPostsV2(options).then((results) => {
      expect(results).toEqual(response);
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        httpMethod: "POST",
      });
    });
  });

  it("exports posts as a CSV string", () => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    return exportPostsV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/search`);
      expect(opts).toEqual({
        ...options,
        data: {
          ...options.data,
          f: SearchPostsFormat.CSV,
        },
        httpMethod: "POST",
      });
    });
  });

  it("creates post on known channel", () => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = { ...baseOpts, data: body };
    return createPostV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("creates post on known channel with mention url", () => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = {
      ...baseOpts,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    return createPostV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts`);
      expect(opts).toEqual({
        ...baseOpts,
        data: body,
        httpMethod: "POST",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("creates reply", () => {
    const postId = "postId";
    const requestBody = {
      body: "foo",
    };

    const options = { ...baseOpts, postId, data: requestBody };
    return createReplyV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}/reply`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("creates reply with mention url", () => {
    const postId = "postId";
    const requestBody = {
      body: "foo",
    };

    const options = {
      postId,
      ...baseOpts,
      data: requestBody,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    return createReplyV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}/reply`);
      expect(opts).toEqual({
        postId,
        ...baseOpts,
        data: requestBody,
        httpMethod: "POST",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("gets post", () => {
    const postId = "postId";
    const response = { id: postId, channelId: "channelId" } as IPost;
    requestSpyV2.mockReturnValue(Promise.resolve(response));

    const options = { ...baseOpts, postId };
    return fetchPostV2(options as IFetchPostParams).then((result) => {
      expect(result).toEqual(response);
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("gets post with channel relation", () => {
    const postId = "postId";
    const response = { id: postId, channel: { id: "channelId" } } as IPost;
    requestSpyV2.mockReturnValue(Promise.resolve(response));

    const options = { ...baseOpts, relations: [PostRelation.CHANNEL], postId };
    return fetchPostV2(options as IFetchPostParams).then((result) => {
      expect(result).toEqual({
        ...response,
        channelId: "channelId",
      });
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("deletes post", () => {
    const postId = "postId";

    const options = { ...baseOpts, postId };
    return removePostV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });

  it("updates post body", () => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = { ...baseOpts, postId, data: body };
    return updatePostV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
    });
  });

  it("updates post body with mention url", () => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = {
      ...baseOpts,
      postId,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };

    return updatePostV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}`);
      expect(opts).toEqual({
        ...baseOpts,
        postId,
        data: body,
        httpMethod: "PATCH",
        headers: { "mention-url": "https://some.hub.arcgis.com" },
      });
    });
  });

  it("updates post status", () => {
    const postId = "postId";

    const body = { status: PostStatus.APPROVED };

    const options = { ...baseOpts, postId, data: body };
    return updatePostStatusV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/posts/${postId}/status`);
      expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
    });
  });
});
