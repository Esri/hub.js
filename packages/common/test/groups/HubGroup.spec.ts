import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getGroup: vi.fn(),
    updateGroup: vi.fn(),
    removeGroup: vi.fn(),
  };
});

import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubGroup } from "../../src/groups/HubGroup";
import { IGroup } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, createMockContext } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import * as setGroupThumbnailModule from "../../src/groups/setGroupThumbnail";
import { IHubGroup } from "../../src/core/types/IHubGroup";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { getProp } from "../../src/objects/get-prop";
import * as SearchUtils from "../../src/search/utils";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as deleteGroupThumbnailModule from "../../src/groups/deleteGroupThumbnail";
import { IEntityPermissionPolicy } from "../../src/permissions/types/IEntityPermissionPolicy";
import * as checkPermissionModule from "../../src/permissions/checkPermission";

describe("HubGroup class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // Use a synchronous mock context so tests don't attempt network calls
    const ctx = createMockContext({
      authentication: MOCK_AUTH,
      portalSelf: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
    });
    authdCtxMgr = { context: ctx } as unknown as ArcGISContextManager;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("static methods:", () => {
    it("loads from minimal json", async () => {
      const createSpy = vi.spyOn(HubGroupsModule, "createHubGroup");
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
      const fetchSpy = vi
        .spyOn(HubGroupsModule, "fetchHubGroup")
        .mockImplementation((id: string) => {
          return Promise.resolve({ id, name: "Test Group" });
        });
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
      const fetchSpy = vi
        .spyOn(HubGroupsModule, "fetchHubGroup")
        .mockImplementation((_id: string) => {
          const err = new Error(
            "COM_0003: Group does not exist or is inaccessible."
          );
          return Promise.reject(err);
        });
      try {
        await HubGroup.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("Group not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(HubGroupsModule, "fetchHubGroup")
        .mockImplementation((_id: string) => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        });
      try {
        await HubGroup.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("ZOMG!");
      }
    });
  });

  describe("CRUD", () => {
    it("save call createHubGroup if object does not have an id", async () => {
      const createSpy = vi
        .spyOn(HubGroupsModule, "createHubGroup")
        .mockImplementation((group: IGroup) => {
          return Promise.resolve(group);
        });
      const chk = HubGroup.fromJson(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      await chk.save();
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Group");
    });

    it("create saves the instance if passed true", async () => {
      const createSpy = vi
        .spyOn(HubGroupsModule, "createHubGroup")
        .mockImplementation((group: IGroup) => {
          group.id = "3ef";
          return Promise.resolve(group);
        });
      const chk = await HubGroup.create(
        { name: "Test Group" },
        authdCtxMgr.context,
        true
      );
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Group");
    });

    it("create does not save by default", async () => {
      const createSpy = vi
        .spyOn(HubGroupsModule, "createHubGroup")
        .mockImplementation((group: IGroup) => {
          group.id = "3ef";
          return Promise.resolve(group);
        });
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
      const updateSpy = vi
        .spyOn(HubGroupsModule, "updateHubGroup")
        .mockImplementation((group: IGroup) => {
          return Promise.resolve(group);
        });
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
      const deleteSpy = vi
        .spyOn(HubGroupsModule, "deleteHubGroup")
        .mockImplementation(() => {
          return Promise.resolve();
        });
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
        expect((e as Error).message).toEqual("HubGroup is already destroyed.");
      }

      try {
        await chk.save();
      } catch (e) {
        expect((e as Error).message).toEqual("HubGroup is already destroyed.");
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
      const checkPermissionSpy = vi
        .spyOn(checkPermissionModule, "checkPermission")
        .mockReturnValue({ access: true });
      const chk = instance.checkPermission("hub:group:create");
      expect(chk.access).toBeTruthy();
      expect(checkPermissionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = vi
        .spyOn(EditConfigModule, "getEditorConfig")
        .mockImplementation(() => {
          return Promise.resolve({ fake: "config" });
        });
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
        const enrichEntitySpy = vi
          .spyOn(EnrichEntityModule, "enrichEntity")
          .mockResolvedValue({});
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
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
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

      it("handles thumbnail change", async () => {
        const chk = HubGroup.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and return void
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const getGroupThumbnailUrlSpy = vi.spyOn(
          SearchUtils,
          "getGroupThumbnailUrl"
        );
        const setGroupThumbnailSpy = vi
          .spyOn(setGroupThumbnailModule, "setGroupThumbnail")
          .mockResolvedValue({} as any);
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
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const deleteGroupThumbnailSpy = vi
          .spyOn(deleteGroupThumbnailModule, "deleteGroupThumbnail")
          .mockResolvedValue({} as any);
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
