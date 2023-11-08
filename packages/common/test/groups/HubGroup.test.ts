import { IGroup } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { HubGroup, IEntityPermissionPolicy } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import { IHubGroup } from "../../src/core/types/IHubGroup";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { getProp } from "../../src/objects/get-prop";
import * as SearchUtils from "../../src/search/utils";
import * as EnrichEntityModule from "../../src/core/enrichEntity";

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

    it("checks for edit and delete", async () => {
      let chk = HubGroup.fromJson(
        {
          name: "Test Group",
          protected: false,
          memberType: "member",
        },
        authdCtxMgr.context
      );
      expect(chk.canEdit).toBeFalsy();
      expect(chk.canDelete).toBeFalsy();
      expect(chk.isProtected).toBeFalsy();
      chk = HubGroup.fromJson(
        {
          name: "Test Group",
          protected: false,
          memberType: "admin",
        },
        authdCtxMgr.context
      );
      expect(chk.canEdit).toBeTruthy();
      expect(chk.canDelete).toBeTruthy();
      expect(chk.isProtected).toBeFalsy();
      chk = HubGroup.fromJson(
        {
          name: "Test Group",
          protected: true,
          owner: "casey",
        },
        authdCtxMgr.context
      );
      expect(chk.canEdit).toBeTruthy();
      expect(chk.canDelete).toBeTruthy();
      expect(chk.isProtected).toBeTruthy();
      chk = HubGroup.fromJson(
        { name: "Test Group", protected: true },
        authdCtxMgr.context
      );
      expect(chk.canEdit).toBeFalsy();
      expect(chk.canDelete).toBeFalsy();
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

    it("create does not save by default", async () => {
      const createSpy = spyOn(HubGroupsModule, "createHubGroup").and.callFake(
        (group: IGroup) => {
          group.id = "3ef";
          return Promise.resolve(group);
        }
      );
      const chk = await HubGroup.create(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      expect(createSpy).not.toHaveBeenCalled();
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

  describe("permission behavior:", () => {
    it("should return empty array if entity has no polices", () => {
      const instance = HubGroup.fromJson(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      expect(instance.getPermissionPolicies("hub:group:create")).toEqual([]);
    });
    it("pass in, add and remove", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:group:create",
        collaborationType: "user",
        collaborationId: "deke",
      };
      const instance = HubGroup.fromJson(
        {
          id: "00c",
          name: "Test group",
          permissions: [policy],
        },
        authdCtxMgr.context
      );
      HubGroup.fromJson({ name: "Test Group" }, authdCtxMgr.context);
      expect(instance.getPermissionPolicies("hub:group:create")).toEqual([
        policy,
      ]);
      instance.removePermissionPolicy(
        policy.permission,
        policy.collaborationId
      );
      expect(instance.getPermissionPolicies("hub:group:create")).toEqual([]);
      instance.addPermissionPolicy(policy);
      expect(instance.getPermissionPolicies("hub:group:create")).toEqual([
        policy,
      ]);
    });
    it("checkPermission delegates to util", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:group:create",
        collaborationType: "user",
        collaborationId: "deke",
      };
      const entity = {
        id: "00c",
        name: "Test group",
        permissions: [policy],
      } as IHubGroup;
      const instance = HubGroup.fromJson(entity, authdCtxMgr.context);
      const checkPermissionSpy = spyOn(
        require("../../src/permissions"),
        "checkPermission"
      ).and.returnValue({ access: true });
      const chk = instance.checkPermission("hub:group:create");
      expect(chk.access).toBeTruthy();
      expect(checkPermissionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
      const chk = HubGroup.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig("i18n.Scope", "hub:group:edit");
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:group:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor:", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = spyOn(
          EnrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
        const chk = HubGroup.fromJson({ id: "bc3" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("converts entity to correct structure", async () => {
        const chk = HubGroup.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();
        // NOTE: If additional transforms are added in the class they should have tests here
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Entity");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
      });
    });

    describe("fromEditor:", () => {
      it("handles simple prop change", async () => {
        const chk = HubGroup.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        // get the group loaded from the editor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });

      it("throws when is create", async () => {
        const chk = HubGroup.fromJson(
          {
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        // get the group loaded from the editor
        try {
          await await chk.fromEditor(editor);
        } catch (e) {
          expect(getProp(e, "message")).toBe(
            "Cannot create group using the Editor."
          );
        }
        expect(saveSpy).toHaveBeenCalledTimes(0);
      });

      it("handles thumbnail change", async () => {
        const chk = HubGroup.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        const getGroupThumbnailUrlSpy = spyOn(
          SearchUtils,
          "getGroupThumbnailUrl"
        );
        const setGroupThumbnailSpy = spyOn(
          require("../../src/groups/setGroupThumbnail"),
          "setGroupThumbnail"
        ).and.returnValue(Promise.resolve({}));
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {
          blob: "fake blob",
          filename: "thumbnail.png",
        };
        // get the group loaded from the editor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect getGroupThumbnailUrl to have been called
        expect(getGroupThumbnailUrlSpy).toHaveBeenCalledTimes(1);
        // expect setGroupThumbnail to have been called
        expect(setGroupThumbnailSpy).toHaveBeenCalledTimes(1);
        expect(result.name).toBe("new name");
        expect(result.thumbnailUrl).toBe("https://myserver.com/thumbnail.png");
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });

      it("handles thumbnail clear", async () => {
        const chk = HubGroup.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        const deleteGroupThumbnailSpy = spyOn(
          require("../../src/groups/deleteGroupThumbnail"),
          "deleteGroupThumbnail"
        ).and.returnValue(Promise.resolve({}));
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {};
        // get the group loaded from the editor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the deleteGroupThumbnail method to have been called
        expect(deleteGroupThumbnailSpy).toHaveBeenCalledTimes(1);
        // since thumbnailCache is protected we can't really test that it's set
        // other than via code-coverage
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });
    });
  });
});
