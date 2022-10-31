import { IUser } from "@esri/arcgis-rest-auth";
import { IGroup } from "@esri/arcgis-rest-types";
import { IChannel } from "../../../src/channels";
import { SharingAccess } from "../../../src/types";
import {
  canCreateChannel,
  canModifyChannel,
  canReadFromChannel,
  isChannelInclusive,
} from "../../../src/utils/channels";

const orgId1 = "3ef";
const orgId2 = "4dc";
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
  beforeEach(() => {
    user = fakeUser({
      username: "jdoe",
      orgId: orgId1,
      groups: [fakeGroup(groupId1, "member"), fakeGroup(groupId2, "admin")],
    });
  });

  describe("canReadFromChannel", () => {
    it("returns true for users included within private channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(canReadFromChannel(channel, user)).toBeTruthy();
    });
    it("returns false for users not included within private channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId3],
      });
      expect(canReadFromChannel(channel, user)).toBeFalsy();
    });
    it("returns true for users included within org channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
      });
      expect(canReadFromChannel(channel, user)).toBeTruthy();
    });
    it("returns false for users not included within org channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId2],
      });
      expect(canReadFromChannel(channel, user)).toBeFalsy();
    });
    it("returns true for public channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PUBLIC,
        orgs: [orgId2],
      });
      expect(canReadFromChannel(channel, user)).toBeTruthy();
    });
  });

  describe("canModifyChannel", () => {
    it("returns true for channel owner but not an admin/owner of groups included within private channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1],
        creator: "jdoe2",
      });

      const channelOwner = fakeUser({
        username: "jdoe2",
        orgId: orgId2,
        groups: [fakeGroup(groupId1, "member")],
      });

      expect(canModifyChannel(channel, channelOwner)).toBeTruthy();
    });
    it("returns true for group admins included within private channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId2],
      });
      expect(canModifyChannel(channel, user)).toBeTruthy();
    });
    it("returns false for group members included within private channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1],
      });
      expect(canModifyChannel(channel, user)).toBeFalsy();
    });
    it("returns true for org admins included within org channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      expect(canModifyChannel(channel, user)).toBeTruthy();
    });
    it("returns true for org admins included within public channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      expect(canModifyChannel(channel, user)).toBeTruthy();
    });
    it("returns false for non-admin org members included within org channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      user.roleId = "123abc";
      expect(canModifyChannel(channel, user)).toBeFalsy();
    });
    it("returns false for all else", () => {
      const channel = fakeChannel({
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
        groups: [groupId3],
      });
      expect(canModifyChannel(channel, user)).toBeFalsy();
    });
  });

  describe("canCreateChannel", () => {
    it("returns true if user is member of all groups of channel with private access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      });
      expect(canCreateChannel(channel, user)).toBeTruthy();
    });
    it("returns false if user is not member of all groups of channel with private access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2, groupId3],
      });
      expect(canCreateChannel(channel, user)).toBeFalsy();
    });
    it("returns true for org admins included within org channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      expect(canCreateChannel(channel, user)).toBeTruthy();
    });
    it("returns false for non-admin org members included within org channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.ORG,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      user.roleId = "123abc";
      expect(canCreateChannel(channel, user)).toBeFalsy();
    });
    it("returns true for org admins included within public channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      expect(canCreateChannel(channel, user)).toBeTruthy();
    });
    it("returns false for non-admin org members included within public channel access", () => {
      const channel = fakeChannel({
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
      });
      user.role = "org_admin";
      user.roleId = "123abc";
      expect(canCreateChannel(channel, user)).toBeFalsy();
    });
  });
});
