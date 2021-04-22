import {
  createChannel,
  searchChannels,
  fetchChannel,
  updateChannel,
  removeChannel
} from "../src/channels";
import * as req from "../src/request";
import {
  ICreateChannelOptions,
  IFetchChannelOptions,
  IRemoveChannelOptions,
  ISearchChannelsOptions,
  IUpdateChannelOptions,
  PostReaction,
  PostStatus,
  SharingAccess
} from "../src/types";

describe("channels", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("queries channels", done => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"]
    };

    const options = { params: query };
    searchChannels(options as ISearchChannelsOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
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

    const options = { params: body };

    createChannel(options as ICreateChannelOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("gets channel", done => {
    const channelId = "channelId";

    const options = { channelId };

    fetchChannel(options as IFetchChannelOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("updates channel", done => {
    const channelId = "channelId";
    const body = {
      allowReaction: false
    };

    const options = { channelId, params: body };

    updateChannel(options as IUpdateChannelOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel", done => {
    const channelId = "channelId";

    const options = { channelId };

    removeChannel(options as IRemoveChannelOptions)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
