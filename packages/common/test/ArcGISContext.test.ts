import { IHubHistoryEntry } from "../src/core/hubHistory";
import { HubEntityType } from "../src/core/types/HubEntityType";
import { createId } from "../src/util";
import { createMockContext, createMockAnonContext } from "./mocks/mock-auth";
import { IUserHubSettings } from "../src";
import * as PermissionsModule from "../src/permissions/checkPermission";
import * as UserSettingsModule from "../src/utils/hubUserAppResources";
import { IHubHistory } from "../dist/types";

describe("ArcGISContext:", () => {
  describe("history:", () => {
    it("empty context returns stucture", () => {
      const ctx = createMockContext();
      expect(ctx.history).toBeDefined();
      expect(ctx.history).toEqual({ entries: [] });
    });
    describe("addToHistory: ", () => {
      it(" adds entry and updates userHubSettings", async () => {
        const ctx = createMockContext();
        // We don't flex the limits etc as all that's handled in the util fn
        // create spy on updateUserHubSettings method
        const updateSettingsSpy = spyOn(
          ctx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());
        // ensure checkPermission returns access:true
        const permissionSpy = spyOn(ctx, "checkPermission").and.returnValue({
          access: true,
        } as any);

        await ctx.addToHistory(createFakeHistoryEntry("site"));

        expect(ctx.history.entries.length).toBe(1);
        expect(updateSettingsSpy).toHaveBeenCalled();
        expect(permissionSpy).toHaveBeenCalled();
        // get the args from the first call
        const args = updateSettingsSpy.calls.first()
          .args[0] as unknown as IUserHubSettings;
        expect(args.history).toEqual(ctx.history);
      });
      it("exits early if user lacks permission", async () => {
        const ctx = createMockContext();
        const updateSettingsSpy = spyOn(
          ctx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());
        // ensure checkPermission returns access:true
        const permissionSpy = spyOn(ctx, "checkPermission").and.returnValue({
          access: false,
        } as any);

        await ctx.addToHistory(createFakeHistoryEntry("site"));

        expect(ctx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).not.toHaveBeenCalled();
        expect(permissionSpy).toHaveBeenCalled();
      });
      it("early exits if not authd", async () => {
        const anonCtx = createMockAnonContext();
        const updateSettingsSpy = spyOn(
          anonCtx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());

        const permissionSpy = spyOn(anonCtx, "checkPermission").and.returnValue(
          {
            access: false,
          } as any
        );

        await anonCtx.addToHistory(createFakeHistoryEntry("site"));

        expect(anonCtx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).not.toHaveBeenCalled();
        expect(permissionSpy).not.toHaveBeenCalled();
      });
    });
    describe("removeFromHistory:", () => {
      it("removeFromHistory removes entry and updates userHubSettings", async () => {
        const ctx = createMockContext();
        // create spy on updateUserHubSettings method
        const updateSettingsSpy = spyOn(
          ctx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());
        const permissionSpy = spyOn(ctx, "checkPermission").and.returnValue({
          access: true,
        } as any);
        const entry = createFakeHistoryEntry("site");
        await ctx.addToHistory(entry);
        expect(ctx.history.entries.length).toBe(1);
        // now remove it
        await ctx.removeFromHistory(entry);
        expect(ctx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).toHaveBeenCalledTimes(2);
        expect(permissionSpy).toHaveBeenCalledTimes(2);
      });
      it("early exits if not authd", async () => {
        const anonCtx = createMockAnonContext();
        const updateSettingsSpy = spyOn(
          anonCtx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());

        const permissionSpy = spyOn(anonCtx, "checkPermission").and.returnValue(
          {
            access: false,
          } as any
        );

        await anonCtx.removeFromHistory(createFakeHistoryEntry("site"));

        expect(anonCtx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).not.toHaveBeenCalled();
        expect(permissionSpy).not.toHaveBeenCalled();
      });

      it("exits early if user lacks permission", async () => {
        const ctx = createMockContext();
        const updateSettingsSpy = spyOn(
          ctx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());
        // ensure checkPermission returns access:true
        const permissionSpy = spyOn(ctx, "checkPermission").and.returnValue({
          access: false,
        } as any);

        await ctx.removeFromHistory(createFakeHistoryEntry("site"));

        expect(ctx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).not.toHaveBeenCalled();
        expect(permissionSpy).toHaveBeenCalled();
      });
    });
    describe("clearHistory:", () => {
      it("clears all entries", async () => {
        const ctx = createMockContext();
        // We don't flex the limits etc as all that's handled in the util fn
        // create spy on updateUserHubSettings method
        const updateSettingsSpy = spyOn(
          ctx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());
        // ensure checkPermission returns access:true
        const permissionSpy = spyOn(ctx, "checkPermission").and.returnValue({
          access: true,
        } as any);

        await ctx.addToHistory(createFakeHistoryEntry("site"));
        await ctx.addToHistory(createFakeHistoryEntry("project"));

        expect(ctx.history.entries.length).toBe(2);
        await ctx.clearHistory();
        expect(ctx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).toHaveBeenCalledTimes(3);
        expect(permissionSpy).toHaveBeenCalledTimes(3);
      });
      it("exits early if user lacks permission", async () => {
        const ctx = createMockContext();
        const updateSettingsSpy = spyOn(
          ctx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());
        // ensure checkPermission returns access:true
        const permissionSpy = spyOn(ctx, "checkPermission").and.returnValue({
          access: false,
        } as any);

        await ctx.clearHistory();

        expect(ctx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).not.toHaveBeenCalled();
        expect(permissionSpy).toHaveBeenCalled();
      });
      it("early exits if not authd", async () => {
        const anonCtx = createMockAnonContext();
        const updateSettingsSpy = spyOn(
          anonCtx,
          "updateUserHubSettings"
        ).and.callFake(() => Promise.resolve());

        const permissionSpy = spyOn(anonCtx, "checkPermission").and.returnValue(
          {
            access: false,
          } as any
        );

        await anonCtx.clearHistory();

        expect(anonCtx.history.entries.length).toBe(0);
        expect(updateSettingsSpy).not.toHaveBeenCalled();
        expect(permissionSpy).not.toHaveBeenCalled();
      });
    });
  });
  describe("checkPermission:", () => {
    it("delegates to checkPermission", () => {
      const ctx = createMockContext();
      const permissionSpy = spyOn(
        PermissionsModule,
        "checkPermission"
      ).and.returnValue({
        access: true,
      } as any);
      const chk = ctx.checkPermission("hub:feature:workspace");
      expect(chk.access).toEqual(true);
      expect(permissionSpy).toHaveBeenCalled();
      // get the first arg for the first call
      expect(permissionSpy.calls.first().args[0]).toEqual(
        "hub:feature:workspace"
      );
    });
  });
  describe("updateUserHubSettings:", () => {
    it("early exits if not authd", async () => {
      const uarSpy = spyOn(
        UserSettingsModule,
        "updateUserHubSettings"
      ).and.callFake(() => Promise.resolve());
      const anonCtx = createMockAnonContext();
      try {
        await anonCtx.updateUserHubSettings({} as IUserHubSettings);
      } catch (ex) {
        // we expect this to throw
        expect((ex as any).message).toEqual(
          "Cannot update user hub settings without an authenticated user"
        );
      }
      expect(uarSpy).not.toHaveBeenCalled();
    });
    it("stores settings", async () => {
      const uarSpy = spyOn(
        UserSettingsModule,
        "updateUserHubSettings"
      ).and.callFake(() => Promise.resolve());
      const ctx = createMockContext();
      await ctx.updateUserHubSettings({
        schemaVersion: 1,
        history: { entries: ["WAT"] },
      } as unknown as IUserHubSettings);
      expect(uarSpy).toHaveBeenCalled();
      expect(uarSpy.calls.first().args[0]).toEqual({
        schemaVersion: 1,
        history: { entries: ["WAT"] },
      });
      expect(ctx.history).toEqual({
        entries: ["WAT"],
      } as unknown as IHubHistory);
    });
    it("adds and deletes feature flags", async () => {
      const uarSpy = spyOn(
        UserSettingsModule,
        "updateUserHubSettings"
      ).and.callFake(() => Promise.resolve());
      const ctx = createMockContext();
      await ctx.updateUserHubSettings({
        schemaVersion: 1,
        preview: {
          workspace: true,
        },
      } as unknown as IUserHubSettings);
      expect(uarSpy).toHaveBeenCalled();
      expect(ctx.featureFlags["hub:feature:workspace"]).toBeDefined();
      await ctx.updateUserHubSettings({
        schemaVersion: 1,
        preview: {
          workspace: false,
        },
      } as unknown as IUserHubSettings);
      expect(ctx.featureFlags["hub:feature:workspace"]).not.toBeDefined();
    });
  });
});

function createFakeHistoryEntry(type: HubEntityType): IHubHistoryEntry {
  const id = createId("h");
  // Create a random visited timestamp that is in the past
  const visited = Date.now() - Math.floor(Math.random() * 100000);
  return {
    id,
    type,
    title: `Fake ${type} ${id}`,
    url: `https://hub.arcgis.com/workspaces/${type}s/${id}`,
    visited,
    action: "view",
    params: {},
  };
}
