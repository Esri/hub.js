import { IUser } from "@esri/arcgis-rest-auth";
import { IGroup } from "@esri/arcgis-rest-types";
import { SharingAccess, IChannel } from "../../../src/types";
import {
  canModifyChannel,
  canReadFromChannel,
  isChannelInclusive,
} from "../../../src/utils/channels";

const orgId1 = "3ef";
const orgId2 = "4dc";
const orgId3 = "zzz";
const groupId1 = "foo";
const groupId2 = "bar";
const groupId3 = "baz";

const fakeUser = (props: any = { username: "jdoe", orgId: "3ef" }) =>
  props as IUser;
const fakeGroup = (id: string, memberType: string) =>
  ({ id, userMembership: { memberType } } as IGroup);
const fakeChannel = (props: any) => props as IChannel;

describe("Util: isChannelInclusive", () => {
  describe("outer visibility: team", () => {
    const outer = fakeChannel({
      access: SharingAccess.PRIVATE,
      orgs: [orgId1],
      groups: [groupId1],
    });
    it("returns void when outer and inner access and groups are identical", () => {
      const inner = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(() => isChannelInclusive(outer, inner)).not.toThrowError();
    });
    it("throws when outer and inner access differ", () => {
      const inner = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(() => isChannelInclusive(outer, inner)).toThrowError(
        "replies to private post must be shared to same team"
      );
    });
    it("throws when outer and inner groups differ", () => {
      const inner = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId2],
      });
      expect(() => isChannelInclusive(outer, inner)).toThrowError(
        "replies to private post must be shared to same team"
      );
    });
  });
  describe("outer visibility: shared", () => {
    const outer = fakeChannel({
      access: SharingAccess.PRIVATE,
      orgs: [orgId1],
      groups: [groupId1, groupId2],
    });
    it("returns void when outer and inner have same access and groups include subset of outer groups", () => {
      const inner = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(() => isChannelInclusive(outer, inner)).not.toThrowError();
    });
    it("throws when outer and inner access differ", () => {
      const inner = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(() => isChannelInclusive(outer, inner)).toThrowError(
        "replies to shared post must be shared to subset of same teams"
      );
    });
    it("throws when outer and inner groups do not intersect", () => {
      const inner = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId3],
      });
      expect(() => isChannelInclusive(outer, inner)).toThrowError(
        "replies to shared post must be shared to subset of same teams"
      );
    });
  });
  describe("outer visibility: org", () => {
    const outer = fakeChannel({
      access: SharingAccess.ORG,
      orgs: [orgId1],
    });
    it("returns void when outer and inner have same access and orgs include subset of outer orgs", () => {
      const inner = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
      });
      expect(() => isChannelInclusive(outer, inner)).not.toThrowError();
    });
    it("returns void when inner has more restrictive visibility than outer", () => {
      const inner = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(() => isChannelInclusive(outer, inner)).not.toThrowError();
    });
    it("throws when inner access public", () => {
      const inner = fakeChannel({
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
      });
      expect(() => isChannelInclusive(outer, inner)).toThrowError(
        "replies to org post cannot be shared to public"
      );
    });
    it("throws when outer and inner orgs do not intersect", () => {
      const inner = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId2],
      });
      expect(() => isChannelInclusive(outer, inner)).toThrowError(
        "replies to org post must be shared to subset of same orgs"
      );
    });
  });
  describe("outer visibility: public", () => {
    const outer = fakeChannel({
      access: SharingAccess.PUBLIC,
      orgs: [orgId1],
    });
    it("returns void", () => {
      const inner = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId3],
      });
      expect(() => isChannelInclusive(outer, inner)).not.toThrowError();
    });
  });
});

describe("Util: Channel Access", () => {
  let user = fakeUser();
  let user3 = fakeUser();

  beforeEach(() => {
    // org1 member, member in groupId1, admin in groupId2, owner in groupId3
    user = fakeUser({
      username: "jdoe",
      orgId: orgId1,
      groups: [
        fakeGroup(groupId1, "member"),
        fakeGroup(groupId2, "admin"),
        fakeGroup(groupId3, "owner"),
      ],
    });

    // org3 member, member in groupId1, admin in groupId2, owner in groupId3
    user3 = fakeUser({
      username: "mrBurrito",
      orgId: orgId3,
      groups: [
        fakeGroup(groupId1, "member"),
        fakeGroup(groupId2, "admin"),
        fakeGroup(groupId3, "owner"),
      ],
    });
  });

  describe("canReadFromChannel", () => {
    describe("Private channel", () => {
      it("returns true for user that is member of channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1],
        });
        expect(canReadFromChannel(channel, user)).toBeTruthy();
      });
      it("returns true for user that is admin of channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId2],
        });
        expect(canReadFromChannel(channel, user)).toBeTruthy();
      });
      it("returns true for user that is owner of channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId3],
        });
        expect(canReadFromChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user that is not in channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: ["unknown"],
        });
        expect(canReadFromChannel(channel, user)).toBeFalsy();
      });
      it("returns false for user that has no groups", () => {
        const userNoGroups = fakeUser();
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: ["unknown"],
        });
        expect(canReadFromChannel(channel, userNoGroups)).toBeFalsy();
      });
    });

    describe("Org channel", () => {
      it("returns true for user that is member of channel group but not in org", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1], // user3 not in this org
          groups: [groupId1],
        });
        expect(canReadFromChannel(channel, user3)).toBeTruthy();
      });
      it("returns true for user that is admin of channel group but not in org", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1], // user3 not in this org
          groups: [groupId2],
        });
        expect(canReadFromChannel(channel, user3)).toBeTruthy();
      });
      it("returns true for user that is owner of channel group but not in org", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1], // user3 not in this org
          groups: [groupId3],
        });
        expect(canReadFromChannel(channel, user3)).toBeTruthy();
      });

      it("returns true for user that not in channel groups but is member of channel org", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
        });
        expect(canReadFromChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user that is not in channel groups and not member of channel org", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId2], // user not in this org
        });
        expect(canReadFromChannel(channel, user)).toBeFalsy();
      });
    });

    describe("Public channel", () => {
      it("returns true for public channel access", () => {
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId2],
        });
        expect(canReadFromChannel(channel, user)).toBeTruthy();
      });
    });
  });

  describe("canModifyChannel", () => {
    describe("Private channel", () => {
      it("returns true for user that is channel owner but not an admin/owner of channel groups", () => {
        const channelOwner = fakeUser({
          username: "user-channelCreator",
          orgId: orgId2,
          groups: [fakeGroup(groupId1, "member")],
        });
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1], // member here
          creator: "user-channelCreator",
        });
        expect(canModifyChannel(channel, channelOwner)).toBeTruthy();
      });
      it("returns true for user that is admin of channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId2], // admin here
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns true for user that is owner of channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId3], // owner here
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user that is member of channel group", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1], // member here
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
    });

    describe("Org channel", () => {
      it("returns true for user that is channel owner but not an admin/owner of channel groups and not channel org_admin", () => {
        // not org_admin
        const channelOwner = fakeUser({
          username: "user-channelCreator",
          orgId: orgId2,
          groups: [fakeGroup(groupId1, "member")],
        });
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1], // member here
          creator: "user-channelCreator",
        });
        expect(canModifyChannel(channel, channelOwner)).toBeTruthy();
      });

      it("returns true for user that is admin of channel group and not channel org_admin", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId2], // admin here
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns true for user that is owner of channel group and not channel org_admin", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId3], // owner here
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user that is member of channel group and not channel org_admin", () => {
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1], // member here
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
      it("returns true for user that is channel org_admin", () => {
        user.role = "org_admin";
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [],
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user with channel org_admin role but has a roleId", () => {
        user.role = "org_admin";
        user.roleId = "aaa";
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [],
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
      it("returns false for user not owner/admin in chanel groups, is org_admin, but not in channel orgs", () => {
        user.role = "org_admin";
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId2], // user not in orgId2
          groups: [],
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
    });

    describe("Public channel", () => {
      it("returns true for user that is channel owner but not an admin/owner of channel groups and not channel org_admin", () => {
        // not org_admin
        const channelOwner = fakeUser({
          username: "user-channelCreator",
          orgId: orgId2,
          groups: [fakeGroup(groupId1, "member")],
        });
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1], // member here
          creator: "user-channelCreator",
        });
        expect(canModifyChannel(channel, channelOwner)).toBeTruthy();
      });

      it("returns true for user that is admin of channel group and not channel org_admin", () => {
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId2], // admin here
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns true for user that is owner of channel group and not channel org_admin", () => {
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId3], // owner here
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user that is member of channel group and not channel org_admin", () => {
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1], // member here
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
      it("returns true for user that is channel org_admin", () => {
        user.role = "org_admin";
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [],
        });
        expect(canModifyChannel(channel, user)).toBeTruthy();
      });
      it("returns false for user with channel org_admin role but has a roleId", () => {
        user.role = "org_admin";
        user.roleId = "aaa";
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [],
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
      it("returns false for user not owner/admin in chanel groups, is org_admin, but not in channel orgs", () => {
        user.role = "org_admin";
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId2], // user not in orgId2
          groups: [],
        });
        expect(canModifyChannel(channel, user)).toBeFalsy();
      });
    });
  });
});
