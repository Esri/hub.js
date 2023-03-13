import {
  createChannel,
  searchChannels,
  fetchChannel,
  updateChannel,
  removeChannel,
  fetchChannelNotifcationOptOut,
  createChannelNotificationOptOut,
  removeChannelNotificationOptOut,
  removeChannelActivity,
} from "../src/channels";
import * as req from "../src/request";
import {
  AclCategory,
  AclSubCategory,
  IDiscussionsRequestOptions,
  IFetchChannelParams,
  PostReaction,
  PostStatus,
  Role,
  SharingAccess,
} from "../src/types";

describe("channels", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

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

    const options = { ...baseOpts, data: query };
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
      channelAclDefinition: [
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.ADMIN,
          key: "groupId",
          role: Role.OWNER,
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          key: "groupId",
          role: Role.READ,
        },
      ],
      access: SharingAccess.PRIVATE,
      groups: ["groupId"],
      allowReply: true,
      allowAnonymous: true,
      softDelete: true,
      defaultPostStatus: PostStatus.APPROVED,
      allowReaction: true,
      allowedReactions: [PostReaction.HEART],
    };

    const options = { ...baseOpts, data: body };

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

    fetchChannel(options as IFetchChannelParams)
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

    const options = { ...baseOpts, channelId, data: body };

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

    fetchChannelNotifcationOptOut(options)
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

    createChannelNotificationOptOut(options)
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

    removeChannelNotificationOptOut(options)
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

    removeChannelActivity(options)
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
