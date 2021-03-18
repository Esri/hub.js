import { createReaction, removeReaction } from "../src/reactions";
import * as req from "../src/request";
import { PostReaction } from "../src/types";

describe("reactions", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("creates a reaction to a post", done => {
    const postId = 1;
    const body = { value: PostReaction.THUMBS_UP };

    const options = { params: { postId, body } };

    createReaction(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reactions`);
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes a reaction to a post", done => {
    const postId = 1;
    const reactionId = 2;

    const options = { params: { postId, reactionId } };

    removeReaction(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/posts/${postId}/reactions/${reactionId}`);
        expect(opts).toEqual({ ...options, method: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
