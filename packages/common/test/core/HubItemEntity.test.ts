import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubItemEntity } from "../../src/core/HubItemEntity";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as SharedWithModule from "../../src/core/_internal/sharedWith";
import * as setItemThumbnailModule from "../../src/items/setItemThumbnail";
import * as deleteItemThumbnailModule from "../../src/items/deleteItemThumbnail";
import * as uploadImageResourceModule from "../../src/items/uploadImageResource";
import { IEntityPermissionPolicy } from "../../src/permissions";
import { CANNOT_DISCUSS, IHubItemEntity } from "../../src";
import * as DISCUSSIONS from "../../src/discussions";
import * as shareItemToGroupsModule from "../../src/items/share-item-to-groups";
import * as unshareItemFromGroupsModule from "../../src/items/unshare-item-from-groups";
import * as checkPermissionModule from "../../src/permissions/checkPermission";

// To test the abstract class, we need to create a
// concrete class that extends it
class TestHarness extends HubItemEntity<any> {
  constructor(entity: any, context: any) {
    super(entity, context);
  }
  update(_changes: Partial<any>): void {
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
    describe("shareWithGroup", () => {
      it("calls shareItemToGroups", async () => {
        const shareItemToGroupsSpy = spyOn(
          shareItemToGroupsModule,
          "shareItemToGroups"
        ).and.returnValue(Promise.resolve(undefined));
        await harness.shareWithGroup("31c");
        expect(shareItemToGroupsSpy).toHaveBeenCalledTimes(1);
        expect(shareItemToGroupsSpy).toHaveBeenCalledWith(
          "00c",
          ["31c"],
          authdCtxMgr.context.requestOptions,
          "deke"
        );
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
          const error = err as { name?: string; message?: string };
          expect(error.name).toBe("HubError");
        }
      });
    });
    describe("shareWithGroups", () => {
      it("calls shareItemToGroups", async () => {
        const shareItemToGroupsSpy = spyOn(
          shareItemToGroupsModule,
          "shareItemToGroups"
        ).and.returnValue(Promise.resolve(undefined));
        await harness.shareWithGroups(["31c", "5n6"]);
        expect(shareItemToGroupsSpy).toHaveBeenCalledTimes(1);
        expect(shareItemToGroupsSpy).toHaveBeenCalledWith(
          "00c",
          ["31c", "5n6"],
          authdCtxMgr.context.requestOptions,
          "deke"
        );
      });
    });
    describe("unshareWithGroup", () => {
      it("calls unshareItemFromGroups", async () => {
        const unshareItemFromGroupsSpy = spyOn(
          unshareItemFromGroupsModule,
          "unshareItemFromGroups"
        ).and.returnValue(Promise.resolve(undefined));
        await harness.unshareWithGroup("31c");
        expect(unshareItemFromGroupsSpy).toHaveBeenCalledTimes(1);
        expect(unshareItemFromGroupsSpy).toHaveBeenCalledWith(
          "00c",
          ["31c"],
          authdCtxMgr.context.requestOptions,
          "deke"
        );
      });
    });
    describe("unshareWithGroups", () => {
      it("calls unshareItemFromGroups", async () => {
        const unshareItemFromGroupsSpy = spyOn(
          unshareItemFromGroupsModule,
          "unshareItemFromGroups"
        ).and.returnValue(Promise.resolve(undefined));
        await harness.unshareWithGroups(["31c", "5n6"]);
        expect(unshareItemFromGroupsSpy).toHaveBeenCalledTimes(1);
        expect(unshareItemFromGroupsSpy).toHaveBeenCalledWith(
          "00c",
          ["31c", "5n6"],
          authdCtxMgr.context.requestOptions,
          "deke"
        );
      });
    });
    describe("setAccess", () => {
      it("calls setItemAccess", async () => {
        const setItemAccessSpy = spyOn(
          PortalModule,
          "setItemAccess"
        ).and.returnValue(Promise.resolve(undefined));
        await harness.setAccess("org");
        expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
        expect(setItemAccessSpy).toHaveBeenCalledWith({
          id: "00c",
          access: "org",
          owner: "deke",
          authentication: authdCtxMgr.context.session,
        });
      });
    });
    describe("sharedWith", () => {
      it("calls sharedWith", async () => {
        const groups = [
          { id: "31c", capabilities: [] } as unknown as PortalModule.IGroup,
          {
            id: "52n",
            capabilities: ["updateitemcontrol"],
          } as unknown as PortalModule.IGroup,
        ];
        const sharedWithSpy = spyOn(
          SharedWithModule,
          "sharedWith"
        ).and.returnValue(Promise.resolve(groups));
        const res = await harness.sharedWith();
        expect(sharedWithSpy).toHaveBeenCalledTimes(1);
        expect(sharedWithSpy).toHaveBeenCalledWith(
          "00c",
          authdCtxMgr.context.requestOptions
        );
        expect(res).toEqual(groups);
      });
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
          instance.toJson();
        } catch (err) {
          const error = err as { name?: string; message?: string };
          expect(error.message === "Entity is already destroyed.");
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

  describe("Follower Behavior", () => {
    let harness: TestHarness;
    beforeEach(() => {
      harness = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          followersGroupId: "followers00c",
        },
        authdCtxMgr.context
      );
    });
    describe("getFollowersGroup", () => {
      it("fetches the followers group when a followersGroupId exists on the entity", async () => {
        const getGroupSpy = spyOn(PortalModule, "getGroup").and.callFake(() => {
          return Promise.resolve();
        });

        await harness.getFollowersGroup();
        expect(getGroupSpy).toHaveBeenCalledTimes(1);
        expect(getGroupSpy).toHaveBeenCalledWith(
          "followers00c",
          authdCtxMgr.context.userRequestOptions
        );
      });
      it("returns undefined when the followerGroupId does not exist on the entity", async () => {
        harness = new TestHarness(
          {
            id: "00c",
            owner: "deke",
          },
          authdCtxMgr.context
        );

        const resp = await harness.getFollowersGroup();
        expect(resp).toBeUndefined();
      });
      it("returns null when there is an error fetching the followers group", async () => {
        const getGroupSpy = spyOn(PortalModule, "getGroup").and.callFake(() => {
          return Promise.reject();
        });

        const resp = await harness.getFollowersGroup();
        expect(getGroupSpy).toHaveBeenCalledTimes(1);
        expect(getGroupSpy).toHaveBeenCalledWith(
          "followers00c",
          authdCtxMgr.context.userRequestOptions
        );
        expect(resp).toBeNull();
      });
    });
    it("sets the followers group access", async () => {
      const updateGroupSpy = spyOn(PortalModule, "updateGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );

      await harness.setFollowersGroupAccess("public");
      expect(updateGroupSpy).toHaveBeenCalledTimes(1);
      expect(updateGroupSpy).toHaveBeenCalledWith({
        group: {
          id: "followers00c",
          access: "public",
        },
        authentication: authdCtxMgr.context.session,
      });
    });
    it("sets whether or not the followers group is discussable", async () => {
      const getFollowersGroupSpy = spyOn(
        harness,
        "getFollowersGroup"
      ).and.callFake(() => {
        return Promise.resolve({
          id: "followers00c",
          typeKeywords: [],
        });
      });
      const setDiscussableKeywordSpy = spyOn(
        DISCUSSIONS,
        "setDiscussableKeyword"
      ).and.callThrough();
      const updateGroupSpy = spyOn(PortalModule, "updateGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await harness.setFollowersGroupIsDiscussable(false);
      expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      expect(setDiscussableKeywordSpy).toHaveBeenCalledWith([], false);
      expect(updateGroupSpy).toHaveBeenCalledTimes(1);
      expect(updateGroupSpy).toHaveBeenCalledWith({
        group: {
          id: "followers00c",
          typeKeywords: [CANNOT_DISCUSS],
        },
        authentication: authdCtxMgr.context.session,
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
    it("can clear thumbnail", async () => {
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
      await instance.save();
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
        const error = err as { name?: string; message?: string };
        expect(error.name).toBe("HubError");
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
        const error = err as { name?: string; message?: string };
        expect(error.name).toBe("HubError");
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
        const error = err as { name?: string; message?: string };
        expect(error.name).toBe("HubError");
      }
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe("https://fake.com/featured.png");
    });

    it("should set featured image", async () => {
      const setImageSpy = spyOn(
        uploadImageResourceModule,
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
        uploadImageResourceModule,
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

    it("should call itself if resource is already present but there is no featuredImageUrl", async () => {
      let count = 1;
      const clearImageSpy = spyOn(
        PortalModule,
        "removeItemResource"
      ).and.returnValue(Promise.resolve({ success: true }));

      const setImageSpy = spyOn(
        uploadImageResourceModule,
        "uploadImageResource"
      ).and.callFake(() => {
        if (count === 1) {
          count += 1;
          const err = new Error("CONT_00942: Resource already present");
          return Promise.reject(err);
        } else {
          return Promise.resolve(
            "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
          );
        }
      });

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          view: {},
        },
        authdCtxMgr.context
      );
      await instance.setFeaturedImage("fake-file");
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledTimes(2);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
      );
    });
  });

  it("should throw an err if applicable", async () => {
    const clearImageSpy = spyOn(
      PortalModule,
      "removeItemResource"
    ).and.returnValue(Promise.resolve({ success: true }));

    const setImageSpy = spyOn(
      uploadImageResourceModule,
      "uploadImageResource"
    ).and.callFake(() => {
      return Promise.reject(new Error("fake error"));
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
    try {
      await instance.setFeaturedImage("fake-file");
      fail("should have thrown error");
    } catch (err) {
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.view.featuredImageUrl).toBe(null);
    }
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
        checkPermissionModule,
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
