import { IGroup } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../../src/types";
import { canCreateChannel } from "../../../src/utils/channels";

const orgId1 = "3ef";
const groupId1 = "foo";
const groupId2 = "bar";
const groupId3 = "baz";

const fakeUser = (props: any = { username: "john", orgId: "3ef" }) =>
  props as IDiscussionsUser;
const fakeGroup = (id: string, memberType: string) =>
  ({ id, userMembership: { memberType } } as IGroup);

describe("canCreateChannel", () => {
  describe("with legacy permissions", () => {
    let user = fakeUser();
    beforeEach(() => {
      user = fakeUser({
        username: "john",
        orgId: orgId1,
        groups: [fakeGroup(groupId1, "member"), fakeGroup(groupId2, "admin")],
      });
    });

    it("returns false for anonymous user ", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      } as IChannel;
      user.username = null;

      expect(canCreateChannel(channel, user)).toBeTruthy();
    });

    it("returns true if user is member of all groups of private-access channel", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      } as IChannel;

      // const user: IDiscussionsUser = { username: "john", orgId: orgId1 };

      expect(canCreateChannel(channel, user)).toBeTruthy();
    });

    it("returns false if user is not member of all groups of private-access channel", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2, groupId3],
      } as IChannel;
      expect(canCreateChannel(channel, user)).toBeFalsy();
    });

    it("returns true if user is org admin included within orgs list of org-access channel", () => {
      const channel = {
        access: SharingAccess.ORG,
        orgs: [orgId1],
      } as IChannel;
      user.role = "org_admin";
      expect(canCreateChannel(channel, user)).toBeTruthy();
    });

    it("returns false if user is not org admin included within orgs list of org-access channel", () => {
      const channel = {
        access: SharingAccess.ORG,
        orgs: [orgId1],
      } as IChannel;
      user.role = "org_admin";
      user.roleId = "123abc";
      expect(canCreateChannel(channel, user)).toBeFalsy();
    });

    it("returns true if user is org admin included within orgs list of public-access channel", () => {
      const channel = {
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
      } as IChannel;
      user.role = "org_admin";
      expect(canCreateChannel(channel, user)).toBeTruthy();
    });

    it("returns false if user is not org admin included within orgs list of public-access channel", () => {
      const channel = {
        access: SharingAccess.PUBLIC,
        orgs: [orgId1],
      } as IChannel;
      user.role = "org_admin";
      user.roleId = "123abc";
      expect(canCreateChannel(channel, user)).toBeFalsy();
    });
  });
});
