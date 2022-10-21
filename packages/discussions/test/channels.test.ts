import {
  createChannel,
  searchChannels,
  fetchChannel,
  updateChannel,
  removeChannel,
  fetchOptOut,
  createOptOut,
  removeOptOut,
  removeActivity,
} from "../src/channels";
import * as req from "../src/request";
import {
  IFetchChannelOptions,
  IHubRequestOptions,
  PostReaction,
  PostStatus,
  SharingAccess,
} from "../src/types";

describe("channels", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IHubRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  };

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("queries channels", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, params: query };
    searchChannels(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("creates channel", (done) => {
    const body = {
      access: SharingAccess.PUBLIC,
      groups: ["foo"],
      allowReply: true,
      allowAnonymous: true,
      softDelete: true,
      defaultPostStatus: PostStatus.APPROVED,
      allowReaction: true,
      allowedReactions: [PostReaction.HEART],
    };

    const options = { ...baseOpts, params: body };

    createChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("gets channel", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

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

  it("updates channel", (done) => {
    const channelId = "channelId";
    const body = {
      allowReaction: false,
    };

    const options = { ...baseOpts, channelId, params: body };

    updateChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    removeChannel(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("gets channel opt out status", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    fetchOptOut(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("creates channel opt out", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    createOptOut(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel opt out", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    removeOptOut(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel activity", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    removeActivity(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/activity`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
