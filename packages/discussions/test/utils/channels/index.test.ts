import { IUser } from "@esri/arcgis-rest-auth";
import { IGroup } from "@esri/arcgis-rest-types";
import { SharingAccess, IChannel } from "../../../src/types";
import { canReadFromChannel } from "../../../src/utils/channels";

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
      it("returns false undefined user", () => {
        const channel = fakeChannel({
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: ["unknown"],
        });
        expect(canReadFromChannel(channel)).toBeFalsy();
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
});
