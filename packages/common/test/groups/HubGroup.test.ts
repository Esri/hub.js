import { IGroup } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { HubGroup } from "../../src/groups/HubGroup";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import { IHubGroup } from "../../src/core/types/IHubGroup";

describe("HubGroup class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });

  describe("static methods:", () => {
    it("loads from minimal json", async () => {
      const createSpy = spyOn(HubGroupsModule, "createHubGroup");
      const chk = HubGroup.fromJson(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Group");
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(HubGroupsModule, "fetchHubGroup").and.callFake(
        (id: string) => {
          return Promise.resolve({
            id,
            name: "Test Group",
          });
        }
      );
      const chk = await HubGroup.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Group");
    });

    it("handle load missing groups", async () => {
      const fetchSpy = spyOn(HubGroupsModule, "fetchHubGroup").and.callFake(
        (id: string) => {
          const err = new Error(
            "COM_0003: Group does not exist or is inaccessible."
          );
          return Promise.reject(err);
        }
      );
      try {
        await HubGroup.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("Group not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(HubGroupsModule, "fetchHubGroup").and.callFake(
        (id: string) => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        }
      );
      try {
        await HubGroup.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("ZOMG!");
      }
    });
  });

  describe("CRUD", () => {
    it("save call createHubGroup if object does not have an id", async () => {
      const createSpy = spyOn(HubGroupsModule, "createHubGroup").and.callFake(
        (group: IGroup) => {
          return Promise.resolve(group);
        }
      );
      const chk = await HubGroup.fromJson(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      await chk.save();
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Group");
    });

    it("create saves the instance if passed true", async () => {
      const createSpy = spyOn(HubGroupsModule, "createHubGroup").and.callFake(
        (group: IGroup) => {
          group.id = "3ef";
          return Promise.resolve(group);
        }
      );
      const chk = await HubGroup.create(
        { name: "Test Group" },
        authdCtxMgr.context,
        true
      );

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Group");
    });

    it("update applies partial chagnes to internal state", () => {
      const chk = HubGroup.fromJson(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      chk.update({
        name: "Test Group 2",
      });
      expect(chk.toJson().name).toEqual("Test Group 2");

      chk.update({ tags: ["one", "two"] });
      expect(chk.toJson().tags).toEqual(["one", "two"]);
    });

    it("save updates if object has id", async () => {
      const updateSpy = spyOn(HubGroupsModule, "updateHubGroup").and.callFake(
        (group: IGroup) => {
          return Promise.resolve(group);
        }
      );
      const chk = HubGroup.fromJson(
        {
          id: "bc3",
          name: "Test Group",
        },
        authdCtxMgr.context
      );
      await chk.save();
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it("delete", async () => {
      const deleteSpy = spyOn(HubGroupsModule, "deleteHubGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      const chk = HubGroup.fromJson(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      await chk.delete();
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      // all fns should now throw an error
      expect(() => {
        chk.toJson();
      }).toThrowError("HubGroup is already destroyed.");

      expect(() => {
        chk.update({ name: "Test Group 2" } as IHubGroup);
      }).toThrowError("HubGroup is already destroyed.");

      // async calls
      try {
        await chk.delete();
      } catch (e) {
        expect((e as any).message).toEqual("HubGroup is already destroyed.");
      }

      try {
        await chk.save();
      } catch (e) {
        expect((e as any).message).toEqual("HubGroup is already destroyed.");
      }
    });
  });
});
