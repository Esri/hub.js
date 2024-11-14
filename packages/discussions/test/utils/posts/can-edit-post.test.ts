import { IGroup } from "@esri/arcgis-rest-portal";
import {
  IChannel,
  IDiscussionsUser,
  IPost,
  SharingAccess,
} from "../../../src/types";
import { CANNOT_DISCUSS } from "../../../src/utils/constants";
import { canEditPost, canModifyPost } from "../../../src/utils/posts";
import { ChannelPermission } from "../../../src/utils/channel-permission";

describe("canModifyPost", () => {
  it("returns false if the user did not create the post", () => {
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "notJohn" } as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canModifyPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns false if the user is not logged in", () => {
    const post = { id: "postId" } as IPost; // asAnonymous post
    const user = {} as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canModifyPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns false if the user undefined", () => {
    const post = { id: "postId" } as IPost; // asAnonymous post
    const user = undefined as unknown as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canModifyPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns false if the user created the post but can longer write to channel", () => {
    const canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    ).and.returnValue(false);
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "john" } as IDiscussionsUser;
    const channel = { channelAcl: [] } as unknown as IChannel;

    const result = canModifyPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns true if the user created the post and can still write to channel", () => {
    const canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    ).and.returnValue(true);
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "john" } as IDiscussionsUser;
    const channel = { channelAcl: [] } as unknown as IChannel;

    const result = canModifyPost(post, user, channel);
    expect(result).toBe(true);
  });

  describe("Legacy Permissions", () => {
    describe("public channel", () => {
      it("returns true if user is creator", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = { username: "john" } as IDiscussionsUser;
        const channel = { access: SharingAccess.PUBLIC } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });
    });

    describe("private channel", () => {
      it("returns true if user is creator and is a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["bbb"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator, is a member of one of the channel groups, but group is non-discussable", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [
            { id: "bbb", typeKeywords: [CANNOT_DISCUSS] },
          ] as any as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["bbb"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator and is not a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["zzz"],
        } as IChannel; // user's group not included

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if channel and user groups are empty", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });
    });

    describe("org channel", () => {
      it("returns true if user is creator and is a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["bbb"],
          orgs: ["zzz"], // not user's org
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator, is a member of one of the channel groups, but group is non-discussable", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [
            { id: "bbb", typeKeywords: [CANNOT_DISCUSS] },
          ] as any as IGroup[],
          orgs: ["zzz"], // not user's org
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["bbb"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator, is not a member of one of the channel groups, and not in channel orgs", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["zzz"], // user's group not included
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator, channel and user groups are empty, and user not in channel orgs", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns true if user is creator and is a member of one of the channel orgs (no channel groups)", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          orgId: "ccc",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["ccc"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator and is not a member of one of the channel orgs (no channel groups)", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          orgId: "ccc",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["zzz"], // user's org not included
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });
    });
  });
});

describe("canEditPost", () => {
  it("returns false if the user did not create the post", () => {
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "notJohn" } as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canEditPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns false if the user is not logged in", () => {
    const post = { id: "postId" } as IPost; // asAnonymous post
    const user = {} as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canEditPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns false if the user undefined", () => {
    const post = { id: "postId" } as IPost; // asAnonymous post
    const user = undefined as unknown as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canEditPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns false if the user created the post but can longer write to channel", () => {
    const canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    ).and.returnValue(false);
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "john" } as IDiscussionsUser;
    const channel = { channelAcl: [] } as unknown as IChannel;

    const result = canEditPost(post, user, channel);
    expect(result).toBe(false);
  });

  it("returns true if the user created the post and can still write to channel", () => {
    const canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    ).and.returnValue(true);
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "john" } as IDiscussionsUser;
    const channel = { channelAcl: [] } as unknown as IChannel;

    const result = canEditPost(post, user, channel);
    expect(result).toBe(true);
  });

  describe("Legacy Permissions", () => {
    describe("public channel", () => {
      it("returns true if user is creator", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = { username: "john" } as IDiscussionsUser;
        const channel = { access: SharingAccess.PUBLIC } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(true);
      });
    });

    describe("private channel", () => {
      it("returns true if user is creator and is a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["bbb"],
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator, is a member of one of the channel groups, but group is non-discussable", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [
            { id: "bbb", typeKeywords: [CANNOT_DISCUSS] },
          ] as any as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["bbb"],
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator and is not a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["zzz"],
        } as IChannel; // user's group not included

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if channel and user groups are empty", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });
    });

    describe("org channel", () => {
      it("returns true if user is creator and is a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["bbb"],
          orgs: ["zzz"], // not user's org
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator, is a member of one of the channel groups, but group is non-discussable", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [
            { id: "bbb", typeKeywords: [CANNOT_DISCUSS] },
          ] as any as IGroup[],
          orgs: ["zzz"], // not user's org
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["bbb"],
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator, is not a member of one of the channel groups, and not in channel orgs", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["zzz"], // user's group not included
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator, channel and user groups are empty, and user not in channel orgs", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns true if user is creator and is a member of one of the channel orgs (no channel groups)", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          orgId: "ccc",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["ccc"],
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator and is not a member of one of the channel orgs (no channel groups)", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          orgId: "ccc",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["zzz"], // user's org not included
        } as IChannel;

        const result = canEditPost(post, user, channel);
        expect(result).toBe(false);
      });
    });
  });
});
