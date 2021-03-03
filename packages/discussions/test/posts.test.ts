import {
  createPost,
  searchPosts,
  findPost,
  updatePost,
  deletePost,
  createReply,
  updatePostSharing,
  updatePostStatus
} from "../src/posts";
import * as req from "../src/request";
import { PostStatus, SharingAccess } from "../src/types";

describe("posts", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      new Promise(resolve => {
        resolve(response);
      })
    );
  });

  it("queries posts [IQueryPostsOptions]", done => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"]
    };

    const options = { params: { query } };
    searchPosts(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, method: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("queries posts [IQueryChannelsPostsOptions]", done => {
    const channelId = 1;
    const query = {
      body: "foo"
    };

    const options = { params: { query, channelId } };
    searchPosts(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts`);
        expect(opts).toEqual({ ...options, method: "GET" });
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

    const options = { params: { body } };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates post [ICreateChannelPostOptions]", done => {
    const channelId = 1;
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { params: { body, channelId } };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${options.params.channelId}/posts`);
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply [ICreateReplyOptions]", done => {
    const postId = 2;
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { params: { body, postId } };
    createReply(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reply`);
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates reply [ICreateChannelReplyOptions]", done => {
    const postId = 2;
    const channelId = 1;
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { params: { body, channelId, postId } };
    createReply(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(
          `/channels/${options.params.channelId}/posts/${postId}/reply`
        );
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("creates posts [ICreatePostOptions]", done => {
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      body: "foo"
    };

    const options = { params: { body } };
    createPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts`);
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("finds post [IFindPostOptions]", done => {
    const postId = 2;

    const options = { params: { postId } };
    findPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("finds post [IFindChannelPostOptions]", done => {
    const postId = 2;
    const channelId = 1;

    const options = { params: { postId, channelId } };
    findPost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes post [IDeletePostOptions]", done => {
    const postId = 2;

    const options = { params: { postId } };
    deletePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes post [IDeleteChannelPostOptions]", done => {
    const postId = 2;
    const channelId = 1;

    const options = { params: { postId, channelId } };
    deletePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body [IUpdatePostOptions]", done => {
    const postId = 2;

    const body = { body: "foo" };

    const options = { params: { postId, body } };
    updatePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post body [IUpdateChannelPostOptions]", done => {
    const postId = 2;
    const channelId = 1;

    const body = { body: "foo" };

    const options = { params: { postId, channelId, body } };
    updatePost(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post sharing [IUpdatePostSharingOptions]", done => {
    const postId = 2;

    const body = { access: SharingAccess.ORG };

    const options = { params: { postId, body } };
    updatePostSharing(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post sharing [IUpdateChannelPostSharingOptions]", done => {
    const postId = 2;
    const channelId = 1;

    const body = { access: SharingAccess.ORG };

    const options = { params: { postId, channelId, body } };
    updatePostSharing(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post status [IUpdatePostStatusOptions]", done => {
    const postId = 2;

    const body = { status: PostStatus.APPROVED };

    const options = { params: { postId, body } };
    updatePostStatus(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("updates post status [IUpdateChannelPostStatusOptions]", done => {
    const postId = 2;
    const channelId = 1;

    const body = { status: PostStatus.APPROVED };

    const options = { params: { postId, channelId, body } };
    updatePostStatus(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/posts/${postId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });
});
