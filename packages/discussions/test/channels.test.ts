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
  createChannelV2,
  searchChannelsV2,
  fetchChannelV2,
  updateChannelV2,
  removeChannelV2,
  fetchChannelNotifcationOptOutV2,
  createChannelNotificationOptOutV2,
  removeChannelNotificationOptOutV2,
  removeChannelActivityV2,
} from "../src/channels";
import * as hubCommon from "@esri/hub-common";
import {
  AclCategory,
  AclSubCategory,
  IDiscussionsRequestOptions,
  IFetchChannelParams,
  ICreateChannel,
  IUpdateChannel,
  ICreateChannelV2,
  IUpdateChannelV2,
  PostReaction,
  PostStatus,
  Role,
  SharingAccess,
} from "../src/types";

describe("channels V1", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = spyOn(hubCommon, "discussionsApiRequest").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("searchChannels exists", () => {
    expect(typeof searchChannels).toBe("function");
  });

  it("creates channel", (done) => {
    const body: ICreateChannel = {
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
    const body: IUpdateChannel = {
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

describe("channels V2", () => {
  let requestSpyV2: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpyV2 = spyOn(hubCommon, "discussionsApiRequestV2").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("searchChannelsV2 exists", () => {
    expect(typeof searchChannelsV2).toBe("function");
  });

  it("creates channel", (done) => {
    const body: ICreateChannelV2 = {
      name: "burrito",
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
          role: Role.READWRITE,
        },
      ],
      allowReply: true,
      softDelete: true,
      defaultPostStatus: PostStatus.APPROVED,
      allowReaction: true,
      allowedReactions: [PostReaction.HEART],
    };

    const options = { ...baseOpts, data: body };

    createChannelV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("gets channel", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    fetchChannelV2(options as IFetchChannelParams)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("updates channel", (done) => {
    const channelId = "channelId";
    const body: IUpdateChannelV2 = {
      allowReaction: false,
    };

    const options = { ...baseOpts, channelId, data: body };

    updateChannelV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    removeChannelV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("gets channel opt out status", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    fetchChannelNotifcationOptOutV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("creates channel opt out", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    createChannelNotificationOptOutV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
        expect(opts).toEqual({ ...options, httpMethod: "POST" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel opt out", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    removeChannelNotificationOptOutV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });

  it("deletes channel activity", (done) => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    removeChannelActivityV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels/${channelId}/activity`);
        expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
        done();
      })
      .catch(() => fail());
  });
});
