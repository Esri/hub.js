import { createReaction, removeReaction } from "../src/reactions";
import * as req from "../src/request";
import { IHubRequestOptions, PostReaction } from "../src/types";

describe("reactions", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IHubRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null
  };

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("creates a reaction to a post", done => {
    const postId = "postId";
    const body = { value: PostReaction.THUMBS_UP };

    const options = { ...baseOpts, postId, params: body };

    createReaction(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reactions`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes a reaction to a post", done => {
    const postId = "postId";
    const reactionId = "reactionId";

    const options = { ...baseOpts, postId, reactionId };

    removeReaction(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reactions/${reactionId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
