import { Geometry } from "geojson";
import {
  searchPostsV2,
  exportPostsV2,
  createPostV2,
  createReplyV2,
  fetchPostV2,
  removePostV2,
  updatePostV2,
  updatePostStatusV2,
} from "../../../src/discussions/api/posts";
import * as discussionsApiRequestModule from "../../../src/discussions/api/discussions-api-request";
import {
  IDiscussionsRequestOptions,
  IFetchPostParams,
  ICreatePost,
  PostStatus,
  SearchPostsFormat,
  SharingAccess,
} from "../../../src/discussions/api/types";

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
    const options = { ...baseOpts };
    searchPostsV2(options)
      .then(() => {
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
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchPostsV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/posts/search`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
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
    searchPostsV2(options)
      .then(() => {
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
      .then(() => {
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

    const options = { ...baseOpts, postId };
    fetchPostV2(options as IFetchPostParams)
      .then(() => {
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
