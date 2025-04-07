import {
  createChannelV2,
  searchChannelsV2,
  fetchChannelV2,
  updateChannelV2,
  removeChannelV2,
  fetchChannelNotifcationOptOutV2,
  createChannelNotificationOptOutV2,
  removeChannelNotificationOptOutV2,
  removeChannelActivityV2,
} from "../../../src/discussions/api/channels";
import * as discussionsApiRequestModule from "../../../src/discussions/api/discussions-api-request";
import {
  AclCategory,
  AclSubCategory,
  IDiscussionsRequestOptions,
  IFetchChannelParams,
  ICreateChannelV2,
  IUpdateChannelV2,
  PostReaction,
  PostStatus,
  Role,
  SharingAccess,
} from "../../../src/discussions/api/types";

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
