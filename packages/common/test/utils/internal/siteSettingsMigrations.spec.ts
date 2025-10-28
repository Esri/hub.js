import { describe, it, expect } from "vitest";
import { getProp } from "../../../src/objects/get-prop";
import {
  applySiteSettingsMigrations,
  applyHubSettingsMigrations,
} from "../../../src/utils/internal/siteSettingsMigrations";

describe("siteSettingsMigrations", () => {
  describe("applySiteSettingsMigrations", () => {
    it("should clone the settings object", () => {
      const settings = { schemaVersion: 1.0 };
      const result = applySiteSettingsMigrations(settings);
      expect(result).not.toBe(settings);
      expect(result).toEqual(settings);
    });
  });

  describe("applyHubSettingsMigrations", () => {
    it("should migrate preview to features if schemaVersion < 1.1 and preview exists", () => {
      const settings = {
        schemaVersion: 1.0,
        preview: { workspace: true },
      } as any;

      const result = applyHubSettingsMigrations(settings);
      expect(result.schemaVersion).toBe(1.1);
      expect((result as any).preview).toBeUndefined();
      expect((result as any).features).toBeDefined();
      expect((result as any).features.workspace).not.toBeDefined();
    });
    it("should migrate preview to features if schemaVersion < 1.1 and preview exists", () => {
      const settings = {
        schemaVersion: 1.0,
        preview: { workspace: false },
      } as any;

      const result = applyHubSettingsMigrations(settings);
      expect(result.schemaVersion).toBe(1.1);
      expect((result as any).preview).toBeUndefined();
      expect((result as any).features).toBeDefined();
      expect((result as any).features.workspace).not.toBeDefined();
    });

    it("should not overwrite features if already present", () => {
      const settings = {
        schemaVersion: 1.0,
        preview: { workspace: false },
        features: { workspace: true },
      } as any;
      const result = applyHubSettingsMigrations(settings);
      expect(result.schemaVersion).toBe(1.1);
      expect((result as any).preview).toBeUndefined();
    });

    it("should remove preview even if features is present", () => {
      const settings = {
        schemaVersion: 1.0,
        preview: { workspace: false },
        features: { workspace: false },
      } as any;
      const result = applyHubSettingsMigrations(settings);
      expect((result as any).preview).toBeUndefined();
    });

    it("should not set features.workspace if preview.workspace is undefined", () => {
      const settings = {
        schemaVersion: 1.0,
        preview: {},
      } as any;
      const result = applyHubSettingsMigrations(settings);
      expect(result.schemaVersion).toBe(1.1);
      expect(result.features.workspace).not.toBeDefined();
      expect(getProp(result, "preview")).toBeUndefined();
    });

    it("should handle missing preview gracefully", () => {
      const settings = {
        schemaVersion: 1.0,
      } as any;
      const result = applyHubSettingsMigrations(settings);
      expect(result.schemaVersion).toBe(1.1);
      expect(result.features).toBeDefined();
      expect((result as any).preview).toBeUndefined();
    });
  });
});
