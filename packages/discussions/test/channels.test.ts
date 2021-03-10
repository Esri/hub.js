import {
  createChannel,
  searchChannels,
  getChannel,
  updateChannel,
  deleteChannel
} from "../src/channels";
import * as req from "../src/request";
import { PostReaction, PostStatus, SharingAccess } from "../src/types";

describe("channels", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      new Promise(resolve => {
        resolve(response);
      })
    );
  });

  it("queries channels", done => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"]
    };

    const options = { params: { query } };
    searchChannels(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, method: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("creates channel", done => {
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      allowReply: true,
      allowAnonymous: true,
      softDelete: true,
      defaultPostStatus: PostStatus.APPROVED,
      allowReaction: true,
      allowedReactions: [PostReaction.HEART]
    };

    const options = { params: { body } };

    createChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, method: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("gets channel", done => {
    const channelId = 1;

    const options = { params: { channelId } };

    getChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, method: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("updates channel", done => {
    const channelId = 1;
    const body = {
      allowReaction: false
    };

    const options = { params: { channelId, body } };

    updateChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, method: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel", done => {
    const channelId = 1;

    const options = { params: { channelId } };

    deleteChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, method: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
