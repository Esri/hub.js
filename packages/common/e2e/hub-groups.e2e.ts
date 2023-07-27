import {
  createHubGroup,
  deleteHubGroup,
  fetchHubGroup,
  updateHubGroup,
  HubGroup,
} from "../src";
import { IHubGroup } from "../src/core/types/IHubGroup";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

fdescribe("Hub Groups", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  describe("CRUD", () => {
    it("creates, read, update and delete a group", async () => {
      const ctxMgr = await factory.getContextManager("hubBasic", "admin");
      const hubGroup: Partial<IHubGroup> = {
        name: `A new group ${new Date().getTime()}`,
        summary: "New group summary",
        membershipAccess: "organization",
      };
      const newGroup = await createHubGroup(
        hubGroup,
        ctxMgr.context.userRequestOptions
      );
      expect(newGroup).toBeDefined();
      expect(newGroup.summary).toBe("New group summary");
      expect(newGroup.membershipAccess).toBe("organization");
      const fetchedGroup = await fetchHubGroup(
        newGroup.id,
        ctxMgr.context.userRequestOptions
      );
      expect(fetchedGroup.summary).toBe("New group summary");
      const newHubGroup = {
        id: newGroup.id,
        summary: "Updated group summary",
        membershipAccess: "anyone",
      } as IHubGroup;
      const updatedGroup = await updateHubGroup(
        newHubGroup,
        ctxMgr.context.userRequestOptions
      );
      expect(updatedGroup.summary).toBe("Updated group summary");
      expect(updatedGroup.membershipAccess).toBe("anyone");
      await deleteHubGroup(newGroup.id, ctxMgr.context.userRequestOptions);
      try {
        await fetchHubGroup(newGroup.id, ctxMgr.context.userRequestOptions);
        fail("should have thrown error");
      } catch (e) {
        expect((e as any).message).toBe(
          "COM_0003: Group does not exist or is inaccessible."
        );
      }
    });
  });
});

describe("HubGroup Class", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  describe("CRUD group", () => {
    it("creates, read, update and delete a group", async () => {
      const ctxMgr = await factory.getContextManager("hubBasic", "admin");
      const newHubGroup: Partial<IHubGroup> = {
        name: `A new group ${new Date().getTime()}`,
        summary: "New group summary.",
      };
      // create a group
      const group = await HubGroup.create(newHubGroup, ctxMgr.context);
      // update the group
      group.update({
        name: `Oak Street Plaza group ${new Date().getTime()}`,
        tags: ["tag1", "tag2"],
      });
      // save the group
      await group.save();

      // verify some server set props are set
      const pojo = group.toJson();
      expect(pojo.owner).toBe(ctxMgr.context.currentUser.username || "");
      expect(pojo.createdDate).toBeDefined();
      expect(pojo.summary).toBe("New group summary.");

      // permissions
      group.addPermissionPolicy({
        permission: "hub:group:edit",
        collaborationType: "group",
        collaborationId: pojo.id,
      });
      // verify that it works
      const canEditGroup = group.checkPermission("hub:group:edit");
      // current user is hub basic and edit group requires premium
      expect(canEditGroup.access).toBe(false);
      // save group and verify that the permission is there
      await group.save();
      const json = group.toJson();
      expect(json.permissions).toBeDefined();
      const p = json.permissions || [];
      expect(p[0].collaborationId).toBe(pojo.id);

      // Get the group by id, from Hub
      const groupById = await HubGroup.fetch(pojo.id, ctxMgr.context);
      expect(groupById.toJson().id).toBe(pojo.id);
      // ensure differnet instance
      expect(groupById).not.toBe(group);
      const id = groupById.toJson().id;

      // clean up
      await group.delete();
      // try to get it again - should fail
      try {
        await HubGroup.fetch(id, ctxMgr.context);
      } catch (e) {
        expect((e as any).message).toBe("Group not found.");
      }
    });
  });
});
