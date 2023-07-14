import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../../src/types";
import { canModifyChannel } from "../../../src/utils/channels";
import { ChannelPermission } from "../../../src/utils/channel-permission";

describe("canModifyChannel", () => {
  describe("With channelAcl Permissions", () => {
    let canModifyChannelSpy: jasmine.Spy;

    beforeAll(() => {
      canModifyChannelSpy = spyOn(
        ChannelPermission.prototype,
        "canModifyChannel"
      );
    });

    beforeEach(() => {
      canModifyChannelSpy.calls.reset();
    });

    it("return true if channelPermission.canModifyChannel is true", () => {
      canModifyChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

      expect(canModifyChannelSpy.calls.count()).toBe(1);
      const [arg1, arg2] = canModifyChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.creator);
    });

    it("return false if channelPermission.canModifyChannel is false", () => {
      canModifyChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);

      expect(canModifyChannelSpy.calls.count()).toBe(1);
      const [arg1, arg2] = canModifyChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.creator);
    });
  });

  describe("With Legacy Permissions", () => {
    it("returns false if the user is not authenticated", () => {
      const user = {} as IDiscussionsUser;
      const userNull = { username: null } as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);
      expect(canModifyChannel(channel, userNull)).toBe(false);
    });

    it("returns false if the user is undefined", () => {
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canModifyChannel(channel)).toBe(false);
    });

    it("returns true if the user created the channel", () => {
      const user = { username: "john" } as IDiscussionsUser;
      const channel = { creator: "john" } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);
    });

    describe("public channel", () => {
      it("returns true if the user is an admin of one of the channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "admin" }, // admin
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          groups: ["aaa", "bbb"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(true);
      });

      it("returns true if the user is an owner of one of the channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "owner" }, // owner
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          groups: ["aaa", "bbb"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(true);
      });

      it("returns false if the user is not an owner or admin of any channel groups, and not in channel orgs", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" }, // member
            },
            {
              id: "bbb",
              userMembership: { memberType: "member" }, // member
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          groups: ["aaa", "bbb"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns false if the user is a group admin or owner but not in channel groups and not in channel orgs", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "admin" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "owner" },
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          groups: ["zzz"], // user groups not included
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns false if the user is not in any groups and not in any orgs", () => {
        const user = { username: "john" } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          groups: ["zzz"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns true if the user not in channel groups, is an orgAdmin and the users org is in the channel orgs", () => {
        const user = {
          username: "john",
          orgId: "aaa",
          role: "org_admin",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: ["aaa"],
        } as IChannel;

        const result = canModifyChannel(channel, user);
        expect(result).toBe(true);
      });

      it("returns false if the user not in channel groups, is an orgAdmin but the users org is not in the channel orgs", () => {
        const user = {
          username: "john",
          orgId: "aaa",
          role: "org_admin",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: ["zzz"], // user not in this org
        } as IChannel;

        const result = canModifyChannel(channel, user);
        expect(result).toBe(false);
      });
    });

    describe("private channel", () => {
      it("returns true if the user is an admin of one of the channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "admin" }, // admin
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["aaa", "bbb"],
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(true);
      });

      it("returns true if the user is an owner of one of the channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "owner" }, // owner
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["aaa", "bbb"],
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(true);
      });

      it("returns false if the user is not an owner or admin of any channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" }, // member
            },
            {
              id: "bbb",
              userMembership: { memberType: "member" }, // member
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["aaa", "bbb"],
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns false if the user is a group admin or owner but not in channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "admin" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "owner" },
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["zzz"], // user groups not included
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns false if the user is not in any groups", () => {
        const user = { username: "john" } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["zzz"],
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });
    });

    describe("org channel", () => {
      it("returns true if the user is an admin of one of the channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "admin" }, // admin
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["aaa", "bbb"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(true);
      });

      it("returns true if the user is an owner of one of the channel groups", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "owner" }, // owner
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["aaa", "bbb"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(true);
      });

      it("returns false if the user is not an owner or admin of any channel groups, and not in channel orgs", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "member" }, // member
            },
            {
              id: "bbb",
              userMembership: { memberType: "member" }, // member
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["aaa", "bbb"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns false if the user is a group admin or owner but not in channel groups and not in channel orgs", () => {
        const user = {
          username: "john",
          groups: [
            {
              id: "aaa",
              userMembership: { memberType: "admin" },
            },
            {
              id: "bbb",
              userMembership: { memberType: "owner" },
            },
          ] as unknown as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["zzz"], // user groups not included
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns false if the user is not in any groups and not in any orgs", () => {
        const user = { username: "john" } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          groups: ["zzz"],
          orgs: ["zzz"], // user not in org
        } as IChannel;

        expect(canModifyChannel(channel, user)).toBe(false);
      });

      it("returns true if the user not in channel groups, is an orgAdmin and the users org is in the channel orgs", () => {
        const user = {
          username: "john",
          orgId: "aaa",
          role: "org_admin",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["aaa"],
        } as IChannel;

        const result = canModifyChannel(channel, user);
        expect(result).toBe(true);
      });

      it("returns false if the user not in channel groups, is an orgAdmin but the users org is not in the channel orgs", () => {
        const user = {
          username: "john",
          orgId: "aaa",
          role: "org_admin",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["zzz"], // user not in this org
        } as IChannel;

        const result = canModifyChannel(channel, user);
        expect(result).toBe(false);
      });
    });
  });
});
