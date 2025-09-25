import {
  createChannel,
  createChannelNotificationOptOut,
  createChannelNotificationOptOutV2,
  createChannelV2,
  fetchChannel,
  fetchChannelNotifcationOptOut,
  fetchChannelNotifcationOptOutV2,
  fetchChannelV2,
  removeChannel,
  removeChannelActivity,
  removeChannelActivityV2,
  removeChannelNotificationOptOut,
  removeChannelNotificationOptOutV2,
  removeChannelV2,
  searchChannels,
  searchChannelsV2,
  updateChannel,
  updateChannelV2,
} from "../../../src/discussions/api/channels/channels";
import * as discussionsApiRequestModule from "../../../src/discussions/api/discussions-api-request";
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
} from "../../../src/discussions/api/types";

describe("channels V1", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = spyOn(
      discussionsApiRequestModule,
      "discussionsApiRequest"
    ).and.returnValue(Promise.resolve(response));
  });

  it("searchChannels", (done) => {
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
    requestSpyV2 = spyOn(
      discussionsApiRequestModule,
      "discussionsApiRequestV2"
    ).and.returnValue(Promise.resolve(response));
  });

  it("searchChannelsV2", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchChannelsV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
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
