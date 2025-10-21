import { vi, afterEach } from "vitest";
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
    requestSpy = vi
      .spyOn(discussionsApiRequestModule, "discussionsApiRequest")
      .mockReturnValue(Promise.resolve(response));
  });

  afterEach(() => vi.restoreAllMocks());

  it("searchChannels", () => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    return searchChannels(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("creates channel", () => {
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

    return createChannel(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("gets channel", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return fetchChannel(options as IFetchChannelParams).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("updates channel", () => {
    const channelId = "channelId";
    const body: IUpdateChannel = {
      allowReaction: false,
    };

    const options = { ...baseOpts, channelId, data: body };

    return updateChannel(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}`);
      expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
    });
  });

  it("deletes channel", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return removeChannel(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });

  it("gets channel opt out status", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return fetchChannelNotifcationOptOut(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("creates channel opt out", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return createChannelNotificationOptOut(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("deletes channel opt out", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return removeChannelNotificationOptOut(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });

  it("deletes channel activity", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return removeChannelActivity(options).then(() => {
      expect(requestSpy.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpy.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/activity`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
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
    requestSpyV2 = vi
      .spyOn(discussionsApiRequestModule, "discussionsApiRequestV2")
      .mockReturnValue(Promise.resolve(response));
  });

  it("searchChannelsV2", () => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    return searchChannelsV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("creates channel", () => {
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

    return createChannelV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("gets channel", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return fetchChannelV2(options as IFetchChannelParams).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("updates channel", () => {
    const channelId = "channelId";
    const body: IUpdateChannelV2 = {
      allowReaction: false,
    };

    const options = { ...baseOpts, channelId, data: body };

    return updateChannelV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}`);
      expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
    });
  });

  it("deletes channel", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return removeChannelV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });

  it("gets channel opt out status", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return fetchChannelNotifcationOptOutV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
      expect(opts).toEqual({ ...options, httpMethod: "GET" });
    });
  });

  it("creates channel opt out", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return createChannelNotificationOptOutV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
      expect(opts).toEqual({ ...options, httpMethod: "POST" });
    });
  });

  it("deletes channel opt out", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return removeChannelNotificationOptOutV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/notifications/opt-out`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });

  it("deletes channel activity", () => {
    const channelId = "channelId";

    const options = { ...baseOpts, channelId };

    return removeChannelActivityV2(options).then(() => {
      expect(requestSpyV2.mock.calls.length).toEqual(1);
      const [url, opts] = requestSpyV2.mock.calls[0];
      expect(url).toEqual(`/channels/${channelId}/activity`);
      expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
    });
  });
});
