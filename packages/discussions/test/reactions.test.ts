import { createReaction, removeReaction } from "../src/reactions";
import * as req from "../src/request";
import {
  ICreateReactionOptions,
  IRemoveReactionOptions,
  PostReaction
} from "../src/types";

describe("reactions", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("creates a reaction to a post", done => {
    const postId = "postId";
    const body = { value: PostReaction.THUMBS_UP };

    const options = { postId, params: body };

    createReaction(options as ICreateReactionOptions)
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

    const options = { postId, reactionId };

    removeReaction(options as IRemoveReactionOptions)
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
