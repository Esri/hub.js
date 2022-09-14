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
  IFetchPostOptions,
  IHubRequestOptions,
  PostStatus,
  SharingAccess,
} from "../src/types";

describe("posts", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IHubRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  };

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("queries posts", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, params: query };
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

  it("creates post [ICreatePost]", (done) => {
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo",
    };

    const options = { ...baseOpts, params: body };
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

  it("creates post [ICreatePost] with mention url", (done) => {
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo",
    };

    const options = {
      ...baseOpts,
      params: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...baseOpts,
          params: body,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates post [ICreateChannelPost]", (done) => {
    const body = {
      channelId: "abc123",
      body: "foo",
    };

    const options = { ...baseOpts, params: body };
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

  it("creates post [ICreateChannelPost] with mention url", (done) => {
    const body = {
      channelId: "abc123",
      body: "foo",
    };

    const options = {
      ...baseOpts,
      params: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({
          ...baseOpts,
          params: body,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply [ICreatePost]", (done) => {
    const postId = "postId";
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo",
    };

    const options = { ...baseOpts, postId, params: body };
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

  it("creates reply [ICreatePost] with mention url", (done) => {
    const postId = "postId";
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo",
    };

    const options = {
      ...baseOpts,
      postId,
      params: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    createReply(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({
          ...baseOpts,
          postId,
          params: body,
          httpMethod: "POST",
          headers: { "mention-url": "https://some.hub.arcgis.com" },
        });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply [ICreateChannelPost]", (done) => {
    const postId = "postId";
    const body = {
      channelId: "abc123",
      body: "foo",
    };

    const options = { ...baseOpts, postId, params: body };
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

  it("creates reply [ICreateChannelPost] with mention url", (done) => {
    const postId = "postId";
    const body = {
      channelId: "abc123",
      body: "foo",
    };

    const options = {
      ...baseOpts,
      postId,
      params: body,
      mentionUrl: "https://some.hub.arcgis.com",
    };
    createReply(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({
          ...baseOpts,
          postId,
          params: body,
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
    fetchPost(options as IFetchPostOptions)
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

    const options = { ...baseOpts, postId, params: body };
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
      params: body,
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
          params: body,
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

    const options = { ...baseOpts, postId, params: body };
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

    const options = { ...baseOpts, postId, params: body };
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
