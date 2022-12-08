import { IGroup } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../../src/types";
import { canCreateChannel } from "../../../src/utils/channels";

const orgId1 = "3ef";
const groupId1 = "foo";
const groupId2 = "bar";
const groupId3 = "baz";

function buildUser(overrides = {}) {
  const defaultUser = {
    username: "john",
    orgId: orgId1,
    role: "org_user",
    groups: [buildGroup(groupId1, "member"), buildGroup(groupId2, "admin")],
  };

  return { ...defaultUser, ...overrides } as IDiscussionsUser;
}

function buildGroup(id: string, memberType: string) {
  return {
    id,
    userMembership: { memberType },
  } as any as IGroup;
}

describe("canCreateChannel", () => {
  describe("Legacy Permissions", () => {
    it("returns false if anonymous user ", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      } as IChannel;
      const userNew = buildUser({ username: null });

      expect(canCreateChannel(channel, userNew)).toEqual(false);
    });

    describe("Private access channel", () => {
      it("returns true if user is member of all channel groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const userNew = buildUser();

        expect(canCreateChannel(channel, userNew)).toEqual(true);
      });

      it("returns false if user is not member of all channel groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2, groupId3], // groupId3
        } as IChannel;
        const userNew = buildUser();

        expect(canCreateChannel(channel, userNew)).toEqual(false);
      });
    });

    describe("Org access channel", () => {
      it("returns true if user is org admin included within orgs list", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
        } as IChannel;
        const userNew = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, userNew)).toEqual(true);
      });

      it("returns false if user is org admin not included within orgs list", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["a"], // not in this org
        } as IChannel;
        const userNew = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, userNew)).toEqual(false);
      });

      it("returns false if user is not org admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
        } as IChannel;
        const userNew = buildUser();

        expect(canCreateChannel(channel, userNew)).toEqual(false);
      });
    });

    describe("Public Access channel", () => {
      it("returns true if user is org admin included within orgs list", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
        } as IChannel;
        const userNew = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, userNew)).toEqual(true);
      });

      it("returns false if user is org admin not included within orgs list", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: ["a"], // not in this org
        } as IChannel;
        const userNew = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, userNew)).toEqual(false);
      });

      it("returns false if user is not org admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
        } as IChannel;
        const userNew = buildUser();

        expect(canCreateChannel(channel, userNew)).toEqual(false);
      });
    });
  });
});
