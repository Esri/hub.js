import { Geometry } from "geojson";
import {
  createPost,
  searchPosts,
  fetchPost,
  updatePost,
  removePost,
  createReply,
  updatePostSharing,
  updatePostStatus,
} from "../src/posts";
import * as req from "../src/request";
import {
  AclCategory,
  AclSubCategory,
  IDiscussionsRequestOptions,
  IFetchPostParams,
  PostStatus,
  Role,
  SharingAccess,
} from "../src/types";

describe("posts", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("queries posts with no parameters", (done) => {
    const options = { ...baseOpts };
    searchPosts(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...options,
          data: undefined,
          httpMethod: "GET",
        });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with parameters", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchPosts(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts with geometry", (done) => {
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
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...{
            ...options,
            data: { ...query, geometry: JSON.stringify(query.geometry) },
          },
          httpMethod: "GET",
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates post on unknown or non-existent channel", (done) => {
    const body = {
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
    const body = {
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
    const body = {
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
    const body = {
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

    const options = { ...baseOpts, postId };
    fetchPost(options as IFetchPostParams)
      .then(() => {
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

  it("updates post sharing", (done) => {
    const postId = "postId";

    const body = { access: SharingAccess.ORG };

    const options = { ...baseOpts, postId, data: body };
    updatePostSharing(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/sharing`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
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
