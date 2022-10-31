import { createReaction, removeReaction } from "../src/reactions";
import * as req from "../src/request";
import { IDiscussionsRequestOptions, PostReaction } from "../src/types";

describe("reactions", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  };

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
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
