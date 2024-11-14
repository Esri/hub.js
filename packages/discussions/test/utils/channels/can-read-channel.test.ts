import { IUser } from "@esri/arcgis-rest-request";
import { IGroup } from "@esri/arcgis-rest-portal";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../../src/types";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import { canReadChannel } from "../../../src/utils/channels";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

const groupId1 = "aaa";
const groupId2 = "bbb";
const groupId3 = "baz";

const orgId1 = "3ef";
const orgId2 = "4dc";
const orgId3 = "zzz";

const fakeUser = (props: any = { username: "jdoe", orgId: "3ef" }) =>
  props as IUser;
const fakeGroup = (id: string, memberType: string) =>
  ({ id, userMembership: { memberType } } as IGroup);
const fakeChannel = (props: any) => props as IChannel;

function buildUser (overrides = {}) {
  const defaultUser = {
    username: "john",
    orgId: orgId1,
    role: "org_user",
    groups: [buildGroup(groupId1, "member"), buildGroup(groupId2, "admin")],
  };

  return { ...defaultUser, ...overrides } as IDiscussionsUser;
}

function buildGroup (id: string, memberType: string, typeKeywords?: string[]) {
  return {
    id,
    userMembership: { memberType },
    typeKeywords,
  } as any as IGroup;
}

describe("canReadChannel", () => {
  let canReadChannelSpy: jasmine.Spy;
  let hasOrgAdminViewRightsSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminViewRightsSpy = spyOn(portalPrivModule, "hasOrgAdminViewRights");
    canReadChannelSpy = spyOn(ChannelPermission.prototype, "canReadChannel");
  });

  beforeEach(() => {
    hasOrgAdminViewRightsSpy.calls.reset();
    canReadChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canReadChannel(channel, user)).toBe(true);

      expect(hasOrgAdminViewRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminViewRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canReadChannelSpy.calls.count()).toBe(0);
    });
  });

  describe("with channelAcl", () => {
    it("return true if channelPermission.canReadChannel is true", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => false);
      canReadChannelSpy.and.callFake(() => true);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canReadChannel(channel, user)).toBe(true);

      expect(canReadChannelSpy.calls.count()).toBe(1);
      const [arg] = canReadChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canReadChannel is false", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => false);
      canReadChannelSpy.and.callFake(() => false);

      const user = buildUser();
      const channel = {
        channelAcl: [
          { category: AclCategory.ANONYMOUS_USER, role: Role.WRITE },
        ],
      } as IChannel;

      expect(canReadChannel(channel, user)).toBe(false);

      expect(canReadChannelSpy.calls.count()).toBe(1);
    });
  });

  describe("with legacy permissions", () => {
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
    describe("Private channel", () => {
      it("returns true for user that is member of channel group", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1],
        });
        expect(canReadChannel(channel, user)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns true for user that is admin of channel group", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId2],
        });
        expect(canReadChannel(channel, user)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns true for user that is owner of channel group", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId3],
        });
        expect(canReadChannel(channel, user)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns false for user that is not in channel group", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: ["unknown"],
        });
        expect(canReadChannel(channel, user)).toBeFalsy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns false undefined user", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: ["unknown"],
        });
        expect(canReadChannel(channel)).toBeFalsy();
      });
      it("returns false for user that has no groups", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const userNoGroups = fakeUser();
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: ["unknown"],
        });
        expect(canReadChannel(channel, userNoGroups)).toBeFalsy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
    });

    describe("Org channel", () => {
      it("returns true for user that is member of channel group but not in org", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1], // user3 not in this org
          groups: [groupId1],
        });
        expect(canReadChannel(channel, user3)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns true for user that is admin of channel group but not in org", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1], // user3 not in this org
          groups: [groupId2],
        });
        expect(canReadChannel(channel, user3)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns true for user that is owner of channel group but not in org", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1], // user3 not in this org
          groups: [groupId3],
        });
        expect(canReadChannel(channel, user3)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });

      it("returns true for user that not in channel groups but is member of channel org", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId1],
        });
        expect(canReadChannel(channel, user)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
      it("returns false for user that is not in channel groups and not member of channel org", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.ORG,
          orgs: [orgId2], // user not in this org
        });
        expect(canReadChannel(channel, user)).toBeFalsy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
    });

    describe("Public channel", () => {
      it("returns true for public channel access", () => {
        hasOrgAdminViewRightsSpy.and.callFake(() => false);
        const channel = fakeChannel({
          access: SharingAccess.PUBLIC,
          orgs: [orgId2],
        });
        expect(canReadChannel(channel, user)).toBeTruthy();
        expect(canReadChannelSpy.calls.count()).toBe(0);
      });
    });
  });
});
