import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { IUser, IPortal } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubUser } from "../../src/users/HubUser";
import { createMockContext } from "../mocks/mock-auth";
import { mergeObjects } from "../../src/objects/merge-objects";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import { IHubUser } from "../../src/core/types/IHubUser";
import * as UpdateCommunityOrgSettingsModule from "../../src/utils/internal/updateCommunityOrgSettings";
import * as UpdatePortalOrgSettingsModule from "../../src/utils/internal/updatePortalOrgSettings";

const initContextManager = (opts = {}): { context: any } => {
  const defaults = {
    currentUser: {
      username: "casey",
      privileges: ["portal:user:shareToGroup"],
    } as unknown as IUser,
    portalSelf: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      urlKey: "fake-org",
    } as unknown as IPortal,
    portalUrl: "https://myserver.com",
  };
  return {
    context: createMockContext(mergeObjects(opts, defaults, ["currentUser"])),
  };
};

describe("HubUser Class:", () => {
  let authdCtxMgr: Partial<ArcGISContextManager>;

  beforeEach(async () => {
    authdCtxMgr = initContextManager();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("static methods", () => {
    it("loads from minimal json", () => {
      const chk = HubUser.fromJson({ name: "Paige" }, authdCtxMgr.context);

      expect(chk.toJson().name).toEqual("Paige");
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = vi
        .spyOn(EditConfigModule as any, "getEditorConfig")
        .mockImplementation(() => Promise.resolve({ fake: "config" }));

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
        const enrichEntitySpy: any = vi
          .spyOn(EnrichEntityModule as any, "enrichEntity")
          .mockResolvedValue({});

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
      let saveSpy: any;

      beforeEach(() => {
        saveSpy = vi
          .spyOn(HubUser.prototype as any, "save")
          .mockResolvedValue(undefined);
      });

      it("handles simple prop change", async () => {
        const chk = HubUser.fromJson(
          {
            id: "123",
            name: "Paige",
            settings: { schemaVersion: 1.1, features: { workspace: false } },
          },
          authdCtxMgr.context
        );

        const result = await chk.fromEditor({
          id: "123",
          name: "Paige",
          settings: { schemaVersion: 1.1, features: { workspace: true } },
        } as IHubUser);
        expect(result.settings?.features?.workspace).toEqual(true);
        expect(saveSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("save: ", () => {
    it("saves the user but does not try to save hub org settings", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1.1, features: { workspace: false } },
      } as IHubUser;

      const updateUserHubSettingsSpy = vi
        .spyOn(authdCtxMgr.context as any, "updateUserHubSettings")
        .mockResolvedValue(undefined);

      const updateCommunityOrgSettingsSpy = vi
        .spyOn(
          UpdateCommunityOrgSettingsModule as any,
          "updateCommunityOrgSettings"
        )
        .mockResolvedValue(undefined);

      const updatePortalOrgSettingsSpy = vi
        .spyOn(UpdatePortalOrgSettingsModule as any, "updatePortalOrgSettings")
        .mockResolvedValue(undefined);

      const chk = HubUser.fromJson(user, authdCtxMgr.context);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledTimes(0);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledTimes(0);
    });
    it("saves hub org settings if we are in a community org and user is admin", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1, preview: { workspace: false } },
        hubOrgSettings: {
          signupText: "testSignup",
          termsAndConditions: "testTerms",
          enableSignupText: true,
          enableTermsAndConditions: true,
          showInformationalBanner: true,
        },
      } as unknown as IHubUser;

      const updateUserHubSettingsSpy = vi
        .spyOn(authdCtxMgr.context as any, "updateUserHubSettings")
        .mockResolvedValue(undefined);

      const updateCommunityOrgSettingsSpy = vi
        .spyOn(
          UpdateCommunityOrgSettingsModule as any,
          "updateCommunityOrgSettings"
        )
        .mockResolvedValue(undefined);

      const updatePortalOrgSettingsSpy = vi
        .spyOn(UpdatePortalOrgSettingsModule as any, "updatePortalOrgSettings")
        .mockResolvedValue(undefined);

      const base = authdCtxMgr.context as any;
      const ctx: any = {
        portal: base.portal,
        portalSettings: base.portalSettings,
        userHubSettings: base.userHubSettings,
        currentUser: base.currentUser,
        isPortal: base.isPortal,
        hubUrl: base.hubUrl,
        // writable overrides
        isCommunityOrg: true,
        isOrgAdmin: true,
        // ensure the spy function is present
        updateUserHubSettings: updateUserHubSettingsSpy,
      };
      const chk = HubUser.fromJson(user, ctx);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledWith(
        {
          signupText: "testSignup",
          termsAndConditions: "testTerms",
        },
        ctx
      );
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledWith(
        user.hubOrgSettings,
        ctx
      );
    });
    it("saves hub org settings with signup text and terms and conditions empty if we are in a community org and user is admin and values are disabled", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1, preview: { workspace: false } },
        hubOrgSettings: {
          enableSignupText: false,
          enableTermsAndConditions: false,
          signupText: "test",
          termsAndConditions: "test",
          showInformationalBanner: true,
        },
      } as unknown as IHubUser;

      const updateUserHubSettingsSpy = vi
        .spyOn(authdCtxMgr.context as any, "updateUserHubSettings")
        .mockResolvedValue(undefined);

      const updateCommunityOrgSettingsSpy = vi
        .spyOn(
          UpdateCommunityOrgSettingsModule as any,
          "updateCommunityOrgSettings"
        )
        .mockResolvedValue(undefined);

      const updatePortalOrgSettingsSpy = vi
        .spyOn(UpdatePortalOrgSettingsModule as any, "updatePortalOrgSettings")
        .mockResolvedValue(undefined);

      const base = authdCtxMgr.context as any;
      const ctx: any = {
        portal: base.portal,
        portalSettings: base.portalSettings,
        userHubSettings: base.userHubSettings,
        currentUser: base.currentUser,
        isPortal: base.isPortal,
        hubUrl: base.hubUrl,
        isCommunityOrg: true,
        isOrgAdmin: true,
        updateUserHubSettings: updateUserHubSettingsSpy,
      };
      const chk = HubUser.fromJson(user, ctx);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledWith(
        {
          signupText: "",
          termsAndConditions: "",
        },
        ctx
      );
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledWith(
        user.hubOrgSettings,
        ctx
      );
    });
    it("saves hub org settings with signup text and terms and conditions empty if we are in a community org and user is admin and values are empty", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1, preview: { workspace: false } },
        hubOrgSettings: {
          enableSignupText: true,
          enableTermsAndConditions: true,
          signupText: "",
          termsAndConditions: "",
          showInformationalBanner: true,
        },
      } as unknown as IHubUser;

      const updateUserHubSettingsSpy = vi
        .spyOn(authdCtxMgr.context as any, "updateUserHubSettings")
        .mockResolvedValue(undefined);

      const updateCommunityOrgSettingsSpy = vi
        .spyOn(
          UpdateCommunityOrgSettingsModule as any,
          "updateCommunityOrgSettings"
        )
        .mockResolvedValue(undefined);

      const updatePortalOrgSettingsSpy = vi
        .spyOn(UpdatePortalOrgSettingsModule as any, "updatePortalOrgSettings")
        .mockResolvedValue(undefined);

      const base2 = authdCtxMgr.context as any;
      const ctx2: any = {
        portal: base2.portal,
        portalSettings: base2.portalSettings,
        userHubSettings: base2.userHubSettings,
        currentUser: base2.currentUser,
        isPortal: base2.isPortal,
        hubUrl: base2.hubUrl,
        isCommunityOrg: true,
        isOrgAdmin: true,
        updateUserHubSettings: updateUserHubSettingsSpy,
      };
      const chk = HubUser.fromJson(user, ctx2);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledWith(
        {
          signupText: "",
          termsAndConditions: "",
        },
        ctx2
      );
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledWith(
        user.hubOrgSettings,
        ctx2
      );
    });
    it("doesn't call updateCommunityOrgSettings, but does call updatePortalOrgSettings if not in a community org, but org admin", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1, preview: { workspace: false } },
        hubOrgSettings: {
          schemaVersion: 1,
          preview: { workspace: false },
          showInformationalBanner: true,
        },
      } as unknown as IHubUser;

      const updateUserHubSettingsSpy = vi
        .spyOn(authdCtxMgr.context as any, "updateUserHubSettings")
        .mockResolvedValue(undefined);

      const updateCommunityOrgSettingsSpy = vi
        .spyOn(
          UpdateCommunityOrgSettingsModule as any,
          "updateCommunityOrgSettings"
        )
        .mockResolvedValue(undefined);

      const updatePortalOrgSettingsSpy = vi
        .spyOn(UpdatePortalOrgSettingsModule as any, "updatePortalOrgSettings")
        .mockResolvedValue(undefined);

      const base3 = authdCtxMgr.context as any;
      const ctx3: any = {
        portal: base3.portal,
        portalSettings: base3.portalSettings,
        userHubSettings: base3.userHubSettings,
        currentUser: base3.currentUser,
        isPortal: base3.isPortal,
        hubUrl: base3.hubUrl,
        isCommunityOrg: false,
        isOrgAdmin: true,
        updateUserHubSettings: updateUserHubSettingsSpy,
      };
      const chk = HubUser.fromJson(user, ctx3);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledTimes(0);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledWith(
        user.hubOrgSettings,
        ctx3
      );
    });
    it("doesn't call updateCommunityOrgSettings or updatePortalOrgSettings if user is not an org admin", async () => {
      const user = {
        id: "123",
        name: "Paige",
        settings: { schemaVersion: 1, preview: { workspace: false } },
        hubOrgSettings: { schemaVersion: 1, preview: { workspace: false } },
      } as unknown as IHubUser;

      const updateUserHubSettingsSpy = vi
        .spyOn(authdCtxMgr.context as any, "updateUserHubSettings")
        .mockResolvedValue(undefined);

      const updateCommunityOrgSettingsSpy = vi
        .spyOn(
          UpdateCommunityOrgSettingsModule as any,
          "updateCommunityOrgSettings"
        )
        .mockResolvedValue(undefined);

      const updatePortalOrgSettingsSpy = vi
        .spyOn(UpdatePortalOrgSettingsModule as any, "updatePortalOrgSettings")
        .mockResolvedValue(undefined);

      const base4 = authdCtxMgr.context as any;
      const ctx4: any = {
        portal: base4.portal,
        portalSettings: base4.portalSettings,
        userHubSettings: base4.userHubSettings,
        currentUser: base4.currentUser,
        isPortal: base4.isPortal,
        hubUrl: base4.hubUrl,
        isCommunityOrg: true,
        isOrgAdmin: false,
        updateUserHubSettings: updateUserHubSettingsSpy,
      };
      const chk = HubUser.fromJson(user, ctx4);
      await chk.save();

      expect(updateUserHubSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateUserHubSettingsSpy).toHaveBeenCalledWith(user.settings);
      expect(updateCommunityOrgSettingsSpy).toHaveBeenCalledTimes(0);
      expect(updatePortalOrgSettingsSpy).toHaveBeenCalledTimes(0);
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
        expect((err as Error).message).toEqual("HubUser is already destroyed.");
      }
    });
  });
  describe("delete: ", () => {
    it("deletes the user", async () => {
      const chk = HubUser.fromJson(
        { id: "123", name: "Paige" },
        authdCtxMgr.context
      );
      await chk.delete();
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
        expect((err as Error).message).toEqual("HubUser is already destroyed.");
      }
    });
  });
});
