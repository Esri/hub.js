import type { IGroup } from "@esri/arcgis-rest-portal";
import {
  IChannel,
  IDiscussionsUser,
} from "../../../../../src/discussions/api//types";
import { canCreateChannel } from "../../../../../src/discussions/api//utils/channels/can-create-channel";
import { CANNOT_DISCUSS } from "../../../../../src/discussions/constants";
import { SharingAccess } from "../../../../../src/discussions/api/enums/sharingAccess";

const orgId1 = "3ef";
const groupId1 = "aaa";
const groupId2 = "bbb";
const groupId3 = "ccc";

function buildUser(overrides = {}) {
  const defaultUser = {
    username: "john",
    orgId: orgId1,
    role: "org_user",
    groups: [buildGroup(groupId1, "member"), buildGroup(groupId2, "admin")],
  };

  return { ...defaultUser, ...overrides } as IDiscussionsUser;
}

function buildGroup(id: string, memberType: string, typeKeywords?: string[]) {
  return {
    id,
    userMembership: { memberType },
    typeKeywords,
  } as any as IGroup;
}

describe("canCreateChannel", () => {
  describe("With Legacy Permissions", () => {
    it("returns false if user not authenticated", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      } as IChannel;
      const user = buildUser({ username: null });

      expect(canCreateChannel(channel, user)).toEqual(false);
    });

    it("returns false if user undefined", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      } as IChannel;

      expect(canCreateChannel(channel)).toEqual(false);
    });

    describe("Private access channel", () => {
      it("returns true if user is member of all channel groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is not member of all channel groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2, groupId3], // groupId3 not a user group
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user does not have groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2, groupId3], // groupId3 not a user group
        } as IChannel;
        const user = buildUser({ groups: undefined });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is a member of all channel groups but memberType is not authorized", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "none"), // memberType none not authorized
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is a member of all channel groups but group is not discussable", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "admin", [CANNOT_DISCUSS]),
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Org access channel", () => {
      it("returns true if user is member of all channel groups and user is org_admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is member of all channel groups but user is not org_admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not member of all channel groups and user is org_admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1, groupId2, groupId3], // groupId3 not a user group
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is a member of all channel groups but memberType is not authorized and user is org_admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({
          role: "org_admin",
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "none"), // memberType none not authorized
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is a member of all channel groups but group is not discussable and user is org_admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "admin", [CANNOT_DISCUSS]),
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns true if user is org admin included within orgs list", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is org admin not included within orgs list", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["a"], // not in this org
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not org admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Public Access channel", () => {
      it("returns true if user is member of all channel groups and user is org_admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is member of all channel groups but user is not org_admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not member of all channel groups and user is org_admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1, groupId2, groupId3], // groupId3 not a user group
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is a member of all channel groups but memberType is not authorized and user is org_admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({
          role: "org_admin",
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "none"), // memberType none not authorized
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is a member of all channel groups but group is not discussable and user is org_admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "admin", [CANNOT_DISCUSS]),
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns true if user is org admin included within orgs list", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is org admin not included within orgs list", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: ["a"], // not in this org
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not org admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });
  });
});
