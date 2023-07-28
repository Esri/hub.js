import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubItemEntity } from "../../src/core/HubItemEntity";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as SharedWithModule from "../../src/core/_internal/sharedWith";
import * as setItemThumbnailModule from "../../src/items/setItemThumbnail";
import * as deleteItemThumbnailModule from "../../src/items/deleteItemThumbnail";
import * as ItemsModule from "../../src/items";
import { IEntityPermissionPolicy } from "../../src/permissions";
import { CANNOT_DISCUSS, IHubItemEntity } from "../../src";

// To test the abstract class, we need to create a
// concrete class that extends it
class TestHarness extends HubItemEntity<any> {
  constructor(entity: any, context: any) {
    super(entity, context);
  }
  update(changes: Partial<any>): void {
    throw new Error("Method not implemented.");
  }
  save(): Promise<void> {
    return super.afterSave();
  }
  delete(): Promise<void> {
    this.isDestroyed = true;
    return Promise.resolve();
  }
}

describe("HubItemEntity Class: ", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        groups: [
          { id: "efView", capabilities: [] },
          { id: "efUpdate", capabilities: ["updateitemcontrol"] },
        ],
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        customBaseUrl: "fakemaps.arcgis.com",
      } as unknown as PortalModule.IPortal,
    });
  });

  describe("base properties", () => {
    it("exposes id, owner, and orgId", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          orgId: "aba",
          owner: "deke",
          thumbnail: "thumbnail/ago_downloaded.png",
        },
        authdCtxMgr.context
      );
      expect(instance.id).toBe("00c");
      expect(instance.owner).toBe("deke");
      expect(instance.orgId).toBe("aba");
    });
  });

  describe("Sharing Behavior: ", () => {
    let harness: TestHarness;
    beforeEach(() => {
      harness = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
    });
    it("shares to view group", async () => {
      const shareSpy = spyOn(PortalModule, "shareItemWithGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await harness.shareWithGroup("efView");
      expect(shareSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(shareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "efView",
        owner: "deke",
        confirmItemControl: false,
        authentication: authdCtxMgr.context.session,
      });
    });
    it("shares to update group", async () => {
      const shareSpy = spyOn(PortalModule, "shareItemWithGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await harness.shareWithGroup("efUpdate");
      expect(shareSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(shareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "efUpdate",
        owner: "deke",
        confirmItemControl: true,
        authentication: authdCtxMgr.context.session,
      });
    });

    it("uses user groups to check if group is update", async () => {
      const shareSpy = spyOn(PortalModule, "shareItemWithGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await harness.shareWithGroup("notMyGroup");
      expect(shareSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(shareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "notMyGroup",
        owner: "deke",
        confirmItemControl: false,
        authentication: authdCtxMgr.context.session,
      });
    });
    it("throws if user is not authd", async () => {
      const unauthdCtxMgr = await ArcGISContextManager.create();
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        unauthdCtxMgr.context
      );
      try {
        await instance.shareWithGroup("efUpdate");
        fail("should have thrown");
      } catch (err) {
        expect(err.name).toBe("HubError");
      }
    });
    it("user w/o groups", async () => {
      const ctxMgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
        } as unknown as PortalModule.IUser,
        portal: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
          customBaseUrl: "fakemaps.arcgis.com",
        } as unknown as PortalModule.IPortal,
      });
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        ctxMgr.context
      );
      const shareSpy = spyOn(PortalModule, "shareItemWithGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await instance.shareWithGroup("notMyGroup");
      expect(shareSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(shareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "notMyGroup",
        owner: "deke",
        confirmItemControl: false,
        authentication: authdCtxMgr.context.session,
      });
    });

    it("unshared from group", async () => {
      const unshareSpy = spyOn(
        PortalModule,
        "unshareItemWithGroup"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      await harness.unshareWithGroup("3ef");
      expect(unshareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "3ef",
        owner: "deke",
        authentication: authdCtxMgr.context.session,
      });
    });

    it("sets access", async () => {
      const setAccessSpy = spyOn(PortalModule, "setItemAccess").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await harness.setAccess("public");
      expect(setAccessSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(setAccessSpy).toHaveBeenCalledWith({
        id: "00c",
        access: "public",
        owner: "deke",
        authentication: authdCtxMgr.context.session,
      });
      // verify update to access property
      expect(harness.toJson().access).toEqual("public");
    });

    it("gets groups entity is shared to", async () => {
      const spy = spyOn(SharedWithModule, "sharedWith").and.callFake(() => {
        return Promise.resolve([{ id: "3ef", name: "Test Group" }]);
      });
      const groups = await harness.sharedWith();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "00c",
        authdCtxMgr.context.requestOptions
      );
      expect(groups.length).toEqual(1);
    });

    describe("Store Behavior:", () => {
      it("toJson throws if object is destroyed", async () => {
        const instance = new TestHarness(
          {
            id: "00c",
            owner: authdCtxMgr.context.currentUser.username,
          },
          authdCtxMgr.context
        );
        await instance.delete();
        try {
          const chk = instance.toJson();
        } catch (err) {
          expect((err as any).message === "Entity is already destroyed.");
        }
      });

      it("toJson returns pojo of entity", () => {
        const instance = new TestHarness(
          {
            id: "00c",
            owner: authdCtxMgr.context.currentUser.username,
          },
          authdCtxMgr.context
        );
        const chk = instance.toJson();
        expect(chk.id).toEqual("00c");
        expect(chk.owner).toEqual(authdCtxMgr.context.currentUser.username);
      });

      it("can edit and delete pass thru from entity", async () => {
        const instance = new TestHarness(
          {
            id: "00c",
            owner: authdCtxMgr.context.currentUser.username,
            canEdit: true,
            canDelete: false,
          },
          authdCtxMgr.context
        );
        expect(instance.canEdit).toBeTruthy();
        expect(instance.canDelete).toBeFalsy();
      });
    });
  });

  describe("thumbnail behavior:", () => {
    it("should return a thumbnail if one is available", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          thumbnail: "thumbnail/ago_downloaded.png",
        },
        authdCtxMgr.context
      );
      const thumbnail = instance.getThumbnailUrl();
      expect(thumbnail).toBeDefined();
      expect(thumbnail).toBe(
        "https://fake-org.fakemaps.arcgis.com/sharing/rest/content/items/00c/info/thumbnail/ago_downloaded.png?token=fake-token&w=200"
      );
    });
    it("should add custom width", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          thumbnail: "thumbnail/ago_downloaded.png",
        },
        authdCtxMgr.context
      );
      const thumbnail = instance.getThumbnailUrl(756);
      expect(thumbnail).toBeDefined();
      expect(thumbnail).toBe(
        "https://fake-org.fakemaps.arcgis.com/sharing/rest/content/items/00c/info/thumbnail/ago_downloaded.png?token=fake-token&w=756"
      );
    });
    it("should return undefined if no thumbnail is available", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
      const thumbnail = instance.getThumbnailUrl();
      expect(thumbnail).toBeNull();
    });
    it("should set thumbnail but not save it to the item", () => {
      const spy = spyOn(
        setItemThumbnailModule,
        "setItemThumbnail"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
      instance.setThumbnail("fake-file", "kitteh.png");
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it("should save thumbnail when save is called, only if the cache is present", async () => {
      const spy = spyOn(
        setItemThumbnailModule,
        "setItemThumbnail"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
      instance.setThumbnail("fake-file", "kitteh.png");
      await instance.save();
      // save again, which should not call setItemThumbnail again b/c the cache should be cleared
      await instance.save();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it("can clear thumbnail", () => {
      const deleteSpy = spyOn(
        deleteItemThumbnailModule,
        "deleteItemThumbnail"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
      instance.clearThumbnail();
      instance.save();
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("featured image behavior:", () => {
    it("should clear featured image", async () => {
      const clearImageSpy = spyOn(
        PortalModule,
        "removeItemResource"
      ).and.returnValue(Promise.resolve({ success: true }));

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          view: {
            featuredImageUrl: "https://fake.com/featured.png",
          },
        },
        authdCtxMgr.context
      );
      await instance.clearFeaturedImage();
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBeNull();
    });

    it("should throw hub error if clear featured image fails", async () => {
      const clearImageSpy = spyOn(
        PortalModule,
        "removeItemResource"
      ).and.returnValue(Promise.resolve({ success: false }));

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          view: {
            featuredImageUrl: "https://fake.com/featured.png",
          },
        },
        authdCtxMgr.context
      );
      try {
        await instance.clearFeaturedImage();
        fail("should have thrown error");
      } catch (err) {
        expect(err.name).toBe("HubError");
      }
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe("https://fake.com/featured.png");
    });

    it("throws hub error if removeItemResource rejects with error", async () => {
      const clearImageSpy = spyOn(
        PortalModule,
        "removeItemResource"
      ).and.returnValue(Promise.reject(new Error("fake error")));

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          view: {
            featuredImageUrl: "https://fake.com/featured.png",
          },
        },
        authdCtxMgr.context
      );
      try {
        await instance.clearFeaturedImage();
        fail("should have thrown error");
      } catch (err) {
        expect(err.name).toBe("HubError");
      }
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe("https://fake.com/featured.png");
    });

    it("throws hub error if remove rejects", async () => {
      const clearImageSpy = spyOn(
        PortalModule,
        "removeItemResource"
      ).and.returnValue(Promise.reject("fake error"));

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          view: {
            featuredImageUrl: "https://fake.com/featured.png",
          },
        },
        authdCtxMgr.context
      );
      try {
        await instance.clearFeaturedImage();
        fail("should have thrown error");
      } catch (err) {
        expect(err.name).toBe("HubError");
      }
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe("https://fake.com/featured.png");
    });

    it("should set featured image", async () => {
      const setImageSpy = spyOn(
        ItemsModule,
        "uploadImageResource"
      ).and.callFake(() => {
        return Promise.resolve(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
        );
      });

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
      await instance.setFeaturedImage("fake-file");
      expect(setImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
      );
    });

    it("should remove existing featured image when setting a new one", async () => {
      const clearImageSpy = spyOn(
        PortalModule,
        "removeItemResource"
      ).and.returnValue(Promise.resolve({ success: true }));

      const setImageSpy = spyOn(
        ItemsModule,
        "uploadImageResource"
      ).and.callFake(() => {
        return Promise.resolve(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
        );
      });

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          view: {
            featuredImageUrl: "https://fake.com/featured.png",
          },
        },
        authdCtxMgr.context
      );
      await instance.setFeaturedImage("fake-file");
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
      );
    });
  });

  describe("permission behavior:", () => {
    it("should return empty array if entity has no polices", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
        },
        authdCtxMgr.context
      );
      expect(instance.getPermissionPolicies("hub:project:create")).toEqual([]);
    });
    it("pass in, add and remove", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:project:create",
        collaborationType: "user",
        collaborationId: "deke",
      };
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          permissions: [policy],
        },
        authdCtxMgr.context
      );
      expect(instance.getPermissionPolicies("hub:project:create")).toEqual([
        policy,
      ]);
      instance.removePermissionPolicy(
        policy.permission,
        policy.collaborationId
      );
      expect(instance.getPermissionPolicies("hub:project:create")).toEqual([]);
      instance.addPermissionPolicy(policy);
      expect(instance.getPermissionPolicies("hub:project:create")).toEqual([
        policy,
      ]);
    });
    it("checkPermission delegates to util", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:project:create",
        collaborationType: "user",
        collaborationId: "deke",
      };
      const entity = {
        id: "00c",
        owner: "deke",
        permissions: [policy],
      } as IHubItemEntity;
      const instance = new TestHarness(entity, authdCtxMgr.context);
      const checkPermissionSpy = spyOn(
        require("../../src/permissions"),
        "checkPermission"
      ).and.returnValue({ access: true });
      const chk = instance.checkPermission("hub:project:create");
      expect(chk.access).toBeTruthy();
      expect(checkPermissionSpy).toHaveBeenCalledWith(
        "hub:project:create",
        authdCtxMgr.context,
        entity
      );
    });
  });

  describe("capabilities behavior", () => {
    it("checkCapability delegates to util", () => {
      const entity = {
        id: "00c",
        owner: "deke",
        capabilities: {
          details: true,
        },
      } as IHubItemEntity;
      const instance = new TestHarness(entity, authdCtxMgr.context);
      const spy = spyOn(
        require("../../src/capabilities"),
        "checkCapability"
      ).and.returnValue({ access: false, response: "nope" });
      const chk = instance.checkCapability("details");
      expect(chk.access).toBeFalsy();
      expect(chk.response).toBe("nope");
      expect(spy).toHaveBeenCalledWith("details", authdCtxMgr.context, entity);
    });
  });

  describe("discussions behavior", () => {
    it("enables discussions", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          isDiscussable: false,
          typeKeywords: [CANNOT_DISCUSS],
        },
        authdCtxMgr.context
      );
      const updateSpy = spyOn(instance, "update").and.returnValue(null);
      instance.updateIsDiscussable(true);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({
        typeKeywords: [],
        isDiscussable: true,
      });
    });
    it("disables discussions", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          isDiscussable: true,
          typeKeywords: [],
        },
        authdCtxMgr.context
      );
      const updateSpy = spyOn(instance, "update").and.returnValue(null);
      instance.updateIsDiscussable(false);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({
        typeKeywords: [CANNOT_DISCUSS],
        isDiscussable: false,
      });
    });
  });
});
