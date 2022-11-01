import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubItemEntity } from "../../src/core/HubItemEntity";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as SharedWithModule from "../../src/core/_internal/sharedWith";
import * as setItemThumbnailModule from "../../src/items/setItemThumbnail";
// import * as clearItemFeaturedImageModule from "../../src/items/clear-item-featured-image";
import * as ItemsModule from "../../src/items";

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
    it("exposes id and owner", () => {
      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          thumbnail: "thumbnail/ago_downloaded.png",
        },
        authdCtxMgr.context
      );
      expect(instance.id).toBe("00c");
      expect(instance.owner).toBe("deke");
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
    it("shares to group", async () => {
      const shareSpy = spyOn(PortalModule, "shareItemWithGroup").and.callFake(
        () => {
          return Promise.resolve();
        }
      );
      await harness.shareWithGroup("3ef");
      expect(shareSpy).toHaveBeenCalledTimes(1);
      // verify args
      expect(shareSpy).toHaveBeenCalledWith({
        id: "00c",
        groupId: "3ef",
        owner: "deke",
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
          expect(err.message === "Entity is already destroyed.");
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

      it("owner can edit", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve();
        });
        const sharedWithSpy = spyOn(
          SharedWithModule,
          "sharedWith"
        ).and.callFake(() => {
          return Promise.resolve();
        });
        const instance = new TestHarness(
          {
            id: "00c",
            owner: authdCtxMgr.context.currentUser.username,
          },
          authdCtxMgr.context
        );
        const chk = await instance.canEdit();
        expect(chk).toBeTruthy();
        expect(getUserSpy).toHaveBeenCalledTimes(0);
        expect(sharedWithSpy).toHaveBeenCalledTimes(0);
      });

      it("member of shared edit group can edit", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve({
            usename: "tom",
            groups: [
              {
                id: "group1",
                capabilities: "updateitemcontrol",
              },
            ],
          });
        });
        const sharedWithSpy = spyOn(
          SharedWithModule,
          "sharedWith"
        ).and.callFake(() => {
          return Promise.resolve([
            {
              id: "group1",
              capabilities: "updateitemcontrol",
            },
          ]);
        });
        const instance = new TestHarness(
          {
            id: "00c",
            owner: "tom",
          },
          authdCtxMgr.context
        );
        const chk = await instance.canEdit();
        expect(chk).toBeTruthy();
        expect(getUserSpy).toHaveBeenCalledTimes(1);
        expect(sharedWithSpy).toHaveBeenCalledTimes(1);
      });

      it("user with no groups can not edit", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve({
            usename: "lolo",
            groups: [],
          });
        });
        const sharedWithSpy = spyOn(
          SharedWithModule,
          "sharedWith"
        ).and.callFake(() => {
          return Promise.resolve([
            {
              id: "group1",
              capabilities: "updateitemcontrol",
            },
          ]);
        });
        const instance = new TestHarness(
          {
            id: "00c",
            owner: "lolo",
          },
          authdCtxMgr.context
        );
        const chk = await instance.canEdit();
        expect(chk).toBeFalsy();
        expect(getUserSpy).toHaveBeenCalledTimes(1);
        // should early exit
        expect(sharedWithSpy).toHaveBeenCalledTimes(0);
      });

      it("user without shared membership can not edit", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve({
            usename: "casey",
            groups: [
              {
                id: "group1",
                capabilities: "updateitemcontrol",
              },
            ],
          });
        });
        const sharedWithSpy = spyOn(
          SharedWithModule,
          "sharedWith"
        ).and.callFake(() => {
          return Promise.resolve([
            {
              id: "group2",
            },
            {
              id: "group3",
              capabilities: "updateitemcontrol",
            },
          ]);
        });
        const instance = new TestHarness(
          {
            id: "00c",
            owner: "deke",
          },
          authdCtxMgr.context
        );
        const chk = await instance.canEdit();
        expect(chk).toBeFalsy();
        expect(getUserSpy).toHaveBeenCalledTimes(1);
        expect(sharedWithSpy).toHaveBeenCalledTimes(1);
      });

      it("owner can delete", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve();
        });
        const instance = new TestHarness(
          {
            id: "00c",
            owner: authdCtxMgr.context.currentUser.username,
          },
          authdCtxMgr.context
        );
        const chk = await instance.canDelete();
        expect(chk).toBeTruthy();
        expect(getUserSpy).toHaveBeenCalledTimes(0);
      });

      it("non-owner, org-admin from another org can not delete", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve({
            usename: "jones",
            orgId: "orgTwo",
          });
        });
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "casey",
            orgId: "orgOne",
            role: "org_admin",
          } as unknown as PortalModule.IUser,
          portal: {
            name: "DC R&D Center",
            id: "orgOne",

            urlKey: "fake-org",
          } as unknown as PortalModule.IPortal,
          portalUrl: "https://myserver.com",
        });

        const instance = new TestHarness(
          {
            id: "00c",
            owner: "jones",
          },
          ctxMgr.context
        );

        const chk = await instance.canDelete();
        expect(chk).toBeFalsy();
        expect(getUserSpy).toHaveBeenCalledTimes(1);
      });

      it("non-owner, org-admin with roleId can not delete", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve({
            usename: "jones",
            orgId: "orgTwo",
          });
        });
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "casey",
            orgId: "orgOne",
            role: "org_admin",
            roleId: "someValue",
          } as unknown as PortalModule.IUser,
          portal: {
            name: "DC R&D Center",
            id: "orgOne",
            urlKey: "fake-org",
          } as unknown as PortalModule.IPortal,
          portalUrl: "https://myserver.com",
        });

        const instance = new TestHarness(
          {
            id: "00c",
            owner: "jones",
          },
          ctxMgr.context
        );

        const chk = await instance.canDelete();
        expect(chk).toBeFalsy();
        expect(getUserSpy).toHaveBeenCalledTimes(0);
      });

      it("org_admin from owner org can delete", async () => {
        const getUserSpy = spyOn(PortalModule, "getUser").and.callFake(() => {
          return Promise.resolve({
            usename: "jones",
            orgId: "orgOne",
          });
        });
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "casey",
            orgId: "orgOne",
            role: "org_admin",
          } as unknown as PortalModule.IUser,
          portal: {
            name: "DC R&D Center",
            id: "orgOne",
            urlKey: "fake-org",
          } as unknown as PortalModule.IPortal,
          portalUrl: "https://myserver.com",
        });

        const instance = new TestHarness(
          {
            id: "00c",
            owner: "jones",
          },
          ctxMgr.context
        );
        const chk = await instance.canDelete();
        expect(chk).toBeTruthy();
        expect(getUserSpy).toHaveBeenCalledTimes(1);
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
  });

  describe("featured image behavior:", () => {
    it("should clear featured image", async () => {
      const clearImageSpy = spyOn(
        ItemsModule,
        "clearItemFeaturedImage"
      ).and.callFake(() => {
        return Promise.resolve();
      });

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          featuredImageUrl: "https://fake.com/featured.png",
        },
        authdCtxMgr.context
      );
      await instance.clearFeaturedImage();
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.featuredImageUrl).toBeNull();
    });

    it("should set featured image", async () => {
      const setImageSpy = spyOn(
        ItemsModule,
        "setItemFeaturedImage"
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
      expect(chk.featuredImageUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
      );
    });

    it("should remove existing featured image when setting a new one", async () => {
      const clearImageSpy = spyOn(
        ItemsModule,
        "clearItemFeaturedImage"
      ).and.callFake(() => {
        return Promise.resolve();
      });
      const setImageSpy = spyOn(
        ItemsModule,
        "setItemFeaturedImage"
      ).and.callFake(() => {
        return Promise.resolve(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
        );
      });

      const instance = new TestHarness(
        {
          id: "00c",
          owner: "deke",
          featuredImageUrl: "https://fake.com/featured.png",
        },
        authdCtxMgr.context
      );
      await instance.setFeaturedImage("fake-file");
      expect(clearImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledTimes(1);
      const chk = instance.toJson();
      expect(chk.featuredImageUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
      );
    });
  });
});
