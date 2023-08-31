// import * as AddOrInviteUtilsModule from "../../../src/groups/_internal/AddOrInviteUsersToGroupUtils";
import {
  IAddOrInviteContext,
  IAddOrInviteEmail,
  IUserWithOrgType,
} from "../../../src/groups/types";
import {
  addOrInviteCollaborationCoordinators,
  addOrInviteCommunityUsers,
  addOrInviteOrgUsers,
  addOrInvitePartneredUsers,
  addOrInviteWorldUsers,
  handleNoUsers,
  groupUsersByOrgRelationship,
} from "../../../src/groups/_internal/AddOrInviteUsersToGroupUtils";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as processAutoAddUsersModule from "../../../src/groups/_internal/processAutoAddUsers";
import * as processInviteUsersModule from "../../../src/groups/_internal/processInviteUsers";

describe("AddOrInviteUsersToGroupUtilsModule", () => {
  describe("groupUsersByOrgRelationship: ", () => {
    it("properly groups users by org relationship", () => {
      const users: IUserWithOrgType[] = [
        { orgType: "world" },
        { orgType: "org" },
        { orgType: "community" },
        { orgType: "org" },
        { orgType: "partnered" },
        { orgType: "collaborationCoordinator" },
      ];
      const result = groupUsersByOrgRelationship(users);
      expect(result.world.length).toEqual(1);
      expect(result.org.length).toEqual(2);
      expect(result.community.length).toEqual(1);
      expect(result.partnered.length).toEqual(1);
      expect(result.collaborationCoordinator.length).toEqual(1);
    });
  });

  describe("addOrInviteCollaborationCoordinators: ", () => {
    it("Properly delegates to handleNoUsers when no users supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };

      const actual = await addOrInviteCollaborationCoordinators(context);
      expect(actual).toEqual({
        notAdded: [],
        notInvited: [],
        notEmailed: [],
        users: [],
        errors: [],
      });
    });
    it("Properly autoAdds when canAutoAdd is supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "collaborationCoordinator" }],
        canAutoAddUser: true,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        community: [],
        partnered: [],
        collaborationCoordinator: [{ orgType: "collaborationCoordinator" }],
      };
      const processAutoAddUsersSpy = spyOn(
        processAutoAddUsersModule,
        "processAutoAddUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteCollaborationCoordinators(context);
      expect(processAutoAddUsersSpy).toHaveBeenCalled();
    });
  });

  describe("addOrInviteCommunityUsers:", () => {
    it("Properly delegates to handleNoUsers when no users supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: { message: {}, auth: MOCK_AUTH },
        world: [],
        org: [],
        partnered: [],
        collaborationCoordinator: [],
        community: [],
      };

      const actual = await addOrInviteCommunityUsers(context);
      expect(actual).toEqual({
        notAdded: [],
        notInvited: [],
        notEmailed: [],
        users: [],
        errors: [],
      });
    });
    it("Properly autoAdds when an email is supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "community" }],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: { message: {}, auth: MOCK_AUTH },
        world: [],
        org: [],
        partnered: [],
        collaborationCoordinator: [],
        community: [{ orgType: "community" }],
      };
      const processAutoAddUsersSpy = spyOn(
        processAutoAddUsersModule,
        "processAutoAddUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteCommunityUsers(context);
      expect(processAutoAddUsersSpy).toHaveBeenCalled();
    });
    it("Properly autoAdds when an email is supplied for a given groupID", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "community" }],
        canAutoAddUser: true,
        addUserAsGroupAdmin: false,
        email: { message: {}, auth: MOCK_AUTH, groupId: "abc123" },
        world: [],
        org: [],
        partnered: [],
        collaborationCoordinator: [],
        community: [{ orgType: "community" }],
      };
      const processAutoAddUsersSpy = spyOn(
        processAutoAddUsersModule,
        "processAutoAddUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteCommunityUsers(context);
      expect(processAutoAddUsersSpy).toHaveBeenCalled();
      expect(processAutoAddUsersSpy.calls.count()).toEqual(1);
    });
    it("Properly invites when an email is supplied, but groups dont match", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "community" }],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: { message: {}, auth: MOCK_AUTH, groupId: "def456" },
        world: [],
        org: [],
        partnered: [],
        collaborationCoordinator: [],
        community: [{ orgType: "community" }],
      };
      const processInviteUsersSpy = spyOn(
        processInviteUsersModule,
        "processInviteUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteCommunityUsers(context);
      expect(processInviteUsersSpy).toHaveBeenCalled();
    });
    it("Properly autoAdds when canAutoAdd is supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "community" }],
        canAutoAddUser: true,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        partnered: [],
        collaborationCoordinator: [],
        community: [{ orgType: "community" }],
      };
      const processAutoAddUsersSpy = spyOn(
        processAutoAddUsersModule,
        "processAutoAddUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteCommunityUsers(context);
      expect(processAutoAddUsersSpy).toHaveBeenCalled();
    });
    it("Properly falls back to inviting users", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "community" }],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        partnered: [],
        collaborationCoordinator: [],
        community: [{ orgType: "community" }],
      };
      const processInviteUsersSpy = spyOn(
        processInviteUsersModule,
        "processInviteUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteCommunityUsers(context);
      expect(processInviteUsersSpy).toHaveBeenCalled();
    });
  });

  describe("addOrInviteOrgUsers: ", () => {
    it("Properly delegates to handleNoUsers when no users supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };

      const actual = await addOrInviteOrgUsers(context);
      expect(actual).toEqual({
        notAdded: [],
        notInvited: [],
        notEmailed: [],
        users: [],
        errors: [],
      });
    });
    it("Properly autoAdds when canAutoAdd is supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "org" }],
        canAutoAddUser: true,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [{ orgType: "org" }],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };
      const processAutoAddUsersSpy = spyOn(
        processAutoAddUsersModule,
        "processAutoAddUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteOrgUsers(context);
      expect(processAutoAddUsersSpy).toHaveBeenCalled();
    });
    it("Properly falls back to inviting users", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "org" }],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [{ orgType: "org" }],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };
      const processInviteUsersSpy = spyOn(
        processInviteUsersModule,
        "processInviteUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteOrgUsers(context);
      expect(processInviteUsersSpy).toHaveBeenCalled();
    });
  });

  describe("addOrInvitePartneredUsers: ", () => {
    it("Properly delegates to handleNoUsers when no users supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };

      const actual = await addOrInvitePartneredUsers(context);
      expect(actual).toEqual({
        notAdded: [],
        notInvited: [],
        notEmailed: [],
        users: [],
        errors: [],
      });
    });
    it("Properly falls back to inviting users", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "partnered" }],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        community: [],
        partnered: [{ orgType: "partnered" }],
        collaborationCoordinator: [],
      };
      const processInviteUsersSpy = spyOn(
        processInviteUsersModule,
        "processInviteUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInvitePartneredUsers(context);
      expect(processInviteUsersSpy).toHaveBeenCalled();
    });
  });

  describe("addOrInviteWorldUsers: ", () => {
    it("Properly delegates to handleNoUsers when no users supplied", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [],
        org: [],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };

      const actual = await addOrInviteWorldUsers(context);
      expect(actual).toEqual({
        notAdded: [],
        notInvited: [],
        notEmailed: [],
        users: [],
        errors: [],
      });
    });
    it("Properly falls back to inviting users", async () => {
      const context: IAddOrInviteContext = {
        groupId: "abc123",
        primaryRO: MOCK_AUTH,
        allUsers: [{ orgType: "world" }],
        canAutoAddUser: false,
        addUserAsGroupAdmin: false,
        email: undefined as unknown as IAddOrInviteEmail,
        world: [{ orgType: "world" }],
        org: [],
        community: [],
        partnered: [],
        collaborationCoordinator: [],
      };
      const processInviteUsersSpy = spyOn(
        processInviteUsersModule,
        "processInviteUsers"
      ).and.callFake(() => {
        Promise.resolve();
      });

      const actual = await addOrInviteWorldUsers(context);
      expect(processInviteUsersSpy).toHaveBeenCalled();
    });
  });

  describe("handleNoUsers: ", () => {
    it("returns expected empty addOrInviteReponse object", async () => {
      const result = await handleNoUsers();
      expect(result.notAdded.length).toBe(0);
      expect(result.notEmailed.length).toBe(0);
      expect(result.notInvited.length).toBe(0);
      expect(result.users.length).toBe(0);
      expect(result.errors.length).toBe(0);
    });
  });
});
