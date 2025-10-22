import type { Geometry } from "geojson";
import * as discussionsApiRequestModule from "../../../src/discussions/api/discussions-api-request";
import {
  IDiscussionsRequestOptions,
  IFetchPostParams,
  ICreatePost,
  ICreateChannelPost,
  IPagedResponse,
  IPost,
} from "../../../src/discussions/api/types";
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
import { SharingAccess } from "../../../src/discussions/api/enums/sharingAccess";
import { PostRelation } from "../../../src/discussions/api/enums/postRelation";
import { SearchPostsFormat } from "../../../src/discussions/api/enums/searchPostsFormat";
import { AclCategory } from "../../../src/discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../../src/discussions/api/enums/aclSubCategory";
import { Role } from "../../../src/discussions/api/enums/role";
import { PostStatus } from "../../../src/discussions/api/enums/postStatus";

describe("posts V1", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = spyOn(
      discussionsApiRequestModule,
      "discussionsApiRequest"
    ).and.returnValue(Promise.resolve(response));
  });

  it("queries posts with no parameters", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.and.returnValue(Promise.resolve(response));
    const options = { ...baseOpts };
    searchPosts(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          data: {},
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with parameters", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.and.returnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchPosts(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with channel relation", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channel: { id: "channelId" } } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.and.returnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      relations: [PostRelation.CHANNEL],
    };

    const options = { ...baseOpts, data: query };
    searchPosts(options)
      .then((results) => {
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
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with geometry", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.and.returnValue(Promise.resolve(response));
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
    searchPosts(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with featureGeometry", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpy.and.returnValue(Promise.resolve(response));
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
    searchPosts(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("exports posts as a CSV string", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    exportPosts(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          data: {
            ...options.data,
            f: SearchPostsFormat.CSV,
          },
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates post on unknown or non-existent channel", (done) => {
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
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates post with mention url on unknown or non-existent channel", (done) => {
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
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...baseOpts,
          data: body,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates post on known channel", (done) => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = { ...baseOpts, data: body };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates post on known channel with mention url", (done) => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = {
      ...baseOpts,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...baseOpts,
          data: body,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply", (done) => {
    const postId = "postId";
    const requestBody = {
      body: "foo",
    };

    const options = { ...baseOpts, postId, data: requestBody };
    createReply(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply with mention url", (done) => {
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
    createReply(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({
          postId,
          ...baseOpts,
          data: requestBody,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("gets post", (done) => {
    const postId = "postId";
    const response = { id: postId, channelId: "channelId" } as IPost;
    requestSpy.and.returnValue(Promise.resolve(response));

    const options = { ...baseOpts, postId };
    fetchPost(options as IFetchPostParams)
      .then((result) => {
        expect(result).toEqual(response);
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("gets post with channel relation", (done) => {
    const postId = "postId";
    const response = { id: postId, channel: { id: "channelId" } } as IPost;
    requestSpy.and.returnValue(Promise.resolve(response));

    const options = { ...baseOpts, relations: [PostRelation.CHANNEL], postId };
    fetchPost(options as IFetchPostParams)
      .then((result) => {
        expect(result).toEqual({
          ...response,
          channelId: "channelId",
        });
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes post", (done) => {
    const postId = "postId";

    const options = { ...baseOpts, postId };
    removePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body", (done) => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = { ...baseOpts, postId, data: body };
    updatePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body with mention url", (done) => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = {
      ...baseOpts,
      postId,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };

    updatePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({
          ...baseOpts,
          postId,
          data: body,
          httpMethod: "PATCH",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("updates post status", (done) => {
    const postId = "postId";

    const body = { status: PostStatus.APPROVED };

    const options = { ...baseOpts, postId, data: body };
    updatePostStatus(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/status`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
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
    requestSpyV2 = spyOn(
      discussionsApiRequestModule,
      "discussionsApiRequestV2"
    ).and.returnValue(Promise.resolve(response));
  });

  it("queries posts with no parameters", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.and.returnValue(Promise.resolve(response));
    const options = { ...baseOpts };
    searchPostsV2(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          data: {},
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with parameters", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.and.returnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchPostsV2(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with channel relation", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channel: { id: "channelId" } } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.and.returnValue(Promise.resolve(response));
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
      relations: [PostRelation.CHANNEL],
    };

    const options = { ...baseOpts, data: query };
    searchPostsV2(options)
      .then((results) => {
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
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with geometry", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.and.returnValue(Promise.resolve(response));
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
    searchPostsV2(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with featureGeometry", (done) => {
    const response: IPagedResponse<IPost> = {
      items: [{ id: "postId", channelId: "channelId" } as IPost],
      total: 1,
      nextStart: -1,
    };
    requestSpyV2.and.returnValue(Promise.resolve(response));
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
    searchPostsV2(options)
      .then((results) => {
        expect(results).toEqual(response);
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("exports posts as a CSV string", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    exportPostsV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({
          ...options,
          data: {
            ...options.data,
            f: SearchPostsFormat.CSV,
          },
          httpMethod: "POST",
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates post on known channel", (done) => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = { ...baseOpts, data: body };
    createPostV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates post on known channel with mention url", (done) => {
    const body: ICreatePost = {
      channelId: "abc123",
      body: "foo",
    };

    const options = {
      ...baseOpts,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    createPostV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...baseOpts,
          data: body,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply", (done) => {
    const postId = "postId";
    const requestBody = {
      body: "foo",
    };

    const options = { ...baseOpts, postId, data: requestBody };
    createReplyV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply with mention url", (done) => {
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
    createReplyV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({
          postId,
          ...baseOpts,
          data: requestBody,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("gets post", (done) => {
    const postId = "postId";
    const response = { id: postId, channelId: "channelId" } as IPost;
    requestSpyV2.and.returnValue(Promise.resolve(response));

    const options = { ...baseOpts, postId };
    fetchPostV2(options as IFetchPostParams)
      .then((result) => {
        expect(result).toEqual(response);
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("gets post with channel relation", (done) => {
    const postId = "postId";
    const response = { id: postId, channel: { id: "channelId" } } as IPost;
    requestSpyV2.and.returnValue(Promise.resolve(response));

    const options = { ...baseOpts, relations: [PostRelation.CHANNEL], postId };
    fetchPostV2(options as IFetchPostParams)
      .then((result) => {
        expect(result).toEqual({
          ...response,
          channelId: "channelId",
        });
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes post", (done) => {
    const postId = "postId";

    const options = { ...baseOpts, postId };
    removePostV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body", (done) => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = { ...baseOpts, postId, data: body };
    updatePostV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body with mention url", (done) => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = {
      ...baseOpts,
      postId,
      data: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };

    updatePostV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({
          ...baseOpts,
          postId,
          data: body,
          httpMethod: "PATCH",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("updates post status", (done) => {
    const postId = "postId";

    const body = { status: PostStatus.APPROVED };

    const options = { ...baseOpts, postId, data: body };
    updatePostStatusV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/status`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });
});
