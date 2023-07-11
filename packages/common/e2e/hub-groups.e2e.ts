import {
  createHubGroup,
  deleteHubGroup,
  fetchHubGroup,
  updateHubGroup,
} from "../src";
import { IHubGroup } from "../src/core/types/IHubGroup";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

describe("Hub Groups", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  // add coverage for the class
  fdescribe("CRUD", () => {
    it("creates, read, update and delete a group", async () => {
      const ctxMgr = await factory.getContextManager("hubBasic", "admin");
      const hubGroup: Partial<IHubGroup> = {
        name: `A new group ${new Date().getTime()}`,
        summary: "New group summary",
      };
      const newGroup = await createHubGroup(
        hubGroup,
        ctxMgr.context.userRequestOptions
      );
      expect(newGroup).toBeDefined();
      expect(newGroup.summary).toBe("New group summary");
      const fetchedGroup = await fetchHubGroup(
        newGroup.id,
        ctxMgr.context.userRequestOptions
      );
      expect(fetchedGroup.summary).toBe("New group summary");
      const newHubGroup = {
        id: newGroup.id,
        summary: "Updated group summary",
      } as IHubGroup;
      const updatedGroup = await updateHubGroup(
        newHubGroup,
        ctxMgr.context.userRequestOptions
      );
      expect(updatedGroup.summary).toBe("Updated group summary");
      await deleteHubGroup(newGroup.id, ctxMgr.context.userRequestOptions);
      try {
        await fetchHubGroup(newGroup.id, ctxMgr.context.userRequestOptions);
        fail("should have thrown error");
      } catch (err) {
        expect(err.message).toBe(
          "COM_0003: Group does not exist or is inaccessible."
        );
      }
    });
  });
});
