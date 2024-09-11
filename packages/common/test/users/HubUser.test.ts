import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubUser } from "../../src/users/HubUser";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { mergeObjects } from "../../src/objects/merge-objects";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as HubUsersModule from "../../src/users/HubUsers";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import { IHubUser } from "../../src/core/types/IHubUser";

const initContextManager = async (opts = {}) => {
  const defaults = {
    authentication: MOCK_AUTH,
    currentUser: {
      username: "casey",
      privileges: ["portal:user:shareToGroup"],
    } as unknown as PortalModule.IUser,
    portal: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      urlKey: "fake-org",
    } as unknown as PortalModule.IPortal,
    portalUrl: "https://myserver.com",
  };
  return await ArcGISContextManager.create(
    mergeObjects(opts, defaults, ["currentUser"])
  );
};

describe("HubUser Class:", () => {
  let authdCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
  });
  describe("static methods", () => {
    it("loads from minimal json", () => {
      const chk = HubUser.fromJson({ name: "Paige" }, authdCtxMgr.context);

      expect(chk.toJson().name).toEqual("Paige");
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );

      const chk = HubUser.fromJson(
        {
          id: "123",
          name: "Paige",
        },
        authdCtxMgr.context
      );

      const result = await chk.getEditorConfig(
        "some.scope",
        "hub:user:settings"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "some.scope",
        "hub:user:settings",
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

        const chk = HubUser.fromJson(
          { id: "123", name: "Paige" },
          authdCtxMgr.context
        );
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("toEditor converts entity to correct structure", async () => {
        const chk = HubUser.fromJson(
          { id: "123", name: "Paige" },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();
        expect(result.id).toEqual("123");
        expect(result.name).toEqual("Paige");
      });
    });

    describe("fromEditor:", () => {
      let saveSpy: jasmine.Spy;

      beforeEach(() => {
        saveSpy = spyOn(HubUser.prototype, "save").and.returnValue(
          Promise.resolve()
        );
      });

      it("handles simple prop change", async () => {
        const chk = HubUser.fromJson(
          {
            id: "123",
            name: "Paige",
            settings: { schemaVersion: 1, preview: { workspace: false } },
          },
          authdCtxMgr.context
        );

        const result = await chk.fromEditor({
          id: "123",
          name: "Paige",
          settings: { schemaVersion: 1, preview: { workspace: true } },
        } as IHubUser);
        expect(result.settings?.preview?.workspace).toEqual(true);
        expect(saveSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("save: ", () => {
    it("saves the user", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1, preview: { workspace: false } },
      } as IHubUser;

      const updateUserHubSettingsSpy = spyOn(
        authdCtxMgr.context,
        "updateUserHubSettings"
      ).and.callFake(async () => {
        return Promise.resolve();
      });

      const chk = HubUser.fromJson(user, authdCtxMgr.context);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
    });
    it("throws an error if destroyed", async () => {
      const chk = HubUser.fromJson(
        { id: "123", name: "Paige" },
        authdCtxMgr.context
      );

      await chk.delete();
      try {
        await chk.save();
        fail("should have thrown");
      } catch (err) {
        expect(err.message).toEqual("HubUser is already destroyed.");
      }
    });
  });
  describe("delete: ", () => {
    it("deletes the user", async () => {
      const chk = HubUser.fromJson(
        { id: "123", name: "Paige" },
        authdCtxMgr.context
      );
      chk.delete();
    });
    it("throws an error if destroyed", async () => {
      const chk = HubUser.fromJson(
        { id: "123", name: "Paige" },
        authdCtxMgr.context
      );

      await chk.delete();
      try {
        await chk.delete();
        fail("should have thrown");
      } catch (err) {
        expect(err.message).toEqual("HubUser is already destroyed.");
      }
    });
  });
});
