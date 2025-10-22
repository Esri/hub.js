import { vi, afterEach } from "vitest";
import * as discussionsApiRequestModule from "../../../src/discussions/api/discussions-api-request";
import { PostReaction } from "../../../src/discussions/api/enums/postReaction";
import {
  createReaction,
  createReactionV2,
  removeReaction,
  removeReactionV2,
} from "../../../src/discussions/api/reactions/reactions";
import { IDiscussionsRequestOptions } from "../../../src/discussions/api/types";

describe("reactions", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: undefined,
  };

  beforeEach(() => {
    requestSpy = vi
      .spyOn(discussionsApiRequestModule, "discussionsApiRequest")
      .mockReturnValue(Promise.resolve(response));
  });

  afterEach(() => vi.restoreAllMocks());

  it("creates a reaction to a post", () => {
    const postId = "postId";
    const body = { postId, value: PostReaction.THUMBS_UP };

    const options = { ...baseOpts, data: body };

    return createReaction(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/reactions`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("deletes a reaction to a post", () => {
    const reactionId = "reactionId";

    const options = { ...baseOpts, reactionId };

    return removeReaction(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/reactions/${reactionId}`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });
});

describe("reactions V2", () => {
  let requestSpyV2: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: undefined,
  };

  beforeEach(() => {
    requestSpyV2 = vi
      .spyOn(discussionsApiRequestModule, "discussionsApiRequestV2")
      .mockReturnValue(Promise.resolve(response));
  });

  it("creates a reaction to a post", () => {
    const postId = "postId";
    const body = { postId, value: PostReaction.THUMBS_UP };

    const options = { ...baseOpts, data: body };

    return createReactionV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/reactions`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("deletes a reaction to a post", () => {
    const reactionId = "reactionId";

    const options = { ...baseOpts, reactionId };

    return removeReactionV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/reactions/${reactionId}`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });
});
