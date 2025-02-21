import {
  createReaction,
  createReactionV2,
  removeReaction,
  removeReactionV2,
} from "../src/reactions";
import * as hubCommon from "@esri/hub-common";
import { IDiscussionsRequestOptions, PostReaction } from "../src/types";

describe("reactions", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: undefined,
  };

  beforeEach(() => {
    requestSpy = spyOn(hubCommon, "discussionsApiRequest").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("creates a reaction to a post", (done) => {
    const postId = "postId";
    const body = { postId, value: PostReaction.THUMBS_UP };

    const options = { ...baseOpts, data: body };

    createReaction(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/reactions`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes a reaction to a post", (done) => {
    const reactionId = "reactionId";

    const options = { ...baseOpts, reactionId };

    removeReaction(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/reactions/${reactionId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
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
    requestSpyV2 = spyOn(hubCommon, "discussionsApiRequestV2").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("creates a reaction to a post", (done) => {
    const postId = "postId";
    const body = { postId, value: PostReaction.THUMBS_UP };

    const options = { ...baseOpts, data: body };

    createReactionV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/reactions`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes a reaction to a post", (done) => {
    const reactionId = "reactionId";

    const options = { ...baseOpts, reactionId };

    removeReactionV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/reactions/${reactionId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
