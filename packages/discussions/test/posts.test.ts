import {
  createPost,
  searchPosts,
  fetchPost,
  updatePost,
  removePost,
  createReply,
  updatePostSharing,
  updatePostStatus
} from "../src/posts";
import * as req from "../src/request";
import {
  ICreateChannelPostOptions,
  ICreateChannelReplyOptions,
  ICreatePostOptions,
  ICreateReplyOptions,
  IFetchChannelPostOptions,
  IFetchPostOptions,
  IRemoveChannelPostOptions,
  IRemovePostOptions,
  ISearchChannelPostsOptions,
  ISearchPostsOptions,
  IUpdateChannelPostOptions,
  IUpdateChannelPostSharingOptions,
  IUpdateChannelPostStatusOptions,
  IUpdatePostOptions,
  IUpdatePostSharingOptions,
  IUpdatePostStatusOptions,
  PostStatus,
  SharingAccess
} from "../src/types";

describe("posts", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("queries posts [ISearchPostsOptions]", done => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"]
    };

    const options = { params: query };
    searchPosts(options as ISearchPostsOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts [ISearchChannelsPostsOptions]", done => {
    const channelId = "channelId";
    const query = {
      body: "foo"
    };

    const options = { channelId, params: query };
    searchPosts(options as ISearchChannelPostsOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("creates post [ICreatePostOptions]", done => {
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { params: body };
    createPost(options as ICreatePostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates post [ICreateChannelPostOptions]", done => {
    const channelId = "channelId";
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { channelId, params: body };
    createPost((options as unknown) as ICreateChannelPostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply [ICreateReplyOptions]", done => {
    const postId = "postId";
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { postId, params: body };
    createReply(options as ICreateReplyOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply [ICreateChannelReplyOptions]", done => {
    const postId = "postId";
    const channelId = "channelId";
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { channelId, postId, params: body };
    createReply((options as unknown) as ICreateChannelReplyOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}/reply`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("gets post [IGetPostOptions]", done => {
    const postId = "postId";

    const options = { postId };
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

  it("gets post [IGetChannelPostOptions]", done => {
    const postId = "postId";
    const channelId = "channelId";

    const options = { postId, channelId };
    fetchPost(options as IFetchChannelPostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes post [IDeletePostOptions]", done => {
    const postId = "postId";

    const options = { postId };
    removePost(options as IRemovePostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes post [IDeleteChannelPostOptions]", done => {
    const postId = "postId";
    const channelId = "channelId";

    const options = { postId, channelId };
    removePost(options as IRemoveChannelPostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body [IUpdatePostOptions]", done => {
    const postId = "postId";

    const body = { body: "foo" };

    const options = { postId, params: body };
    updatePost(options as IUpdatePostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body [IUpdateChannelPostOptions]", done => {
    const postId = "postId";
    const channelId = "channelId";

    const body = { body: "foo" };

    const options = { postId, channelId, params: body };
    updatePost(options as IUpdateChannelPostOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post sharing [IUpdatePostSharingOptions]", done => {
    const postId = "postId";

    const body = { access: SharingAccess.ORG };

    const options = { postId, params: body };
    updatePostSharing(options as IUpdatePostSharingOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/sharing`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post sharing [IUpdateChannelPostSharingOptions]", done => {
    const postId = "postId";
    const channelId = "channelId";

    const body = { access: SharingAccess.ORG };

    const options = { postId, channelId, params: body };
    updatePostSharing(options as IUpdateChannelPostSharingOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}/sharing`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post status [IUpdatePostStatusOptions]", done => {
    const postId = "postId";

    const body = { status: PostStatus.APPROVED };

    const options = { postId, params: body };
    updatePostStatus(options as IUpdatePostStatusOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/status`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post status [IUpdateChannelPostStatusOptions]", done => {
    const postId = "postId";
    const channelId = "channelId";

    const body = { status: PostStatus.APPROVED };

    const options = { postId, channelId, params: body };
    updatePostStatus(options as IUpdateChannelPostStatusOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}/status`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });
});
