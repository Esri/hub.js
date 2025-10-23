import { describe, it, expect } from "vitest";

import { applyHubSettingsMigrations } from "../../../src/utils/internal/siteSettingsMigrations";

describe("site settings migrations - legacy preview", () => {
  it("moves preview to features and removes workspace when schemaVersion < 1.1", () => {
    const legacy: any = {
      schemaVersion: 1.0,
      preview: { a: 1, workspace: { some: true } },
    };

    const migrated = applyHubSettingsMigrations(legacy);

    expect(migrated.schemaVersion).toBeGreaterThanOrEqual(1.1);
    // preview should be removed
    expect((migrated as any).preview).toBeUndefined();
    // features should be present and workspace removed
    expect(migrated.features).toEqual({ a: 1 });
  });

  it("creates empty features when none exists and schemaVersion < 1.1", () => {
    const legacyNoPreview: any = { schemaVersion: 1.0 };
    const migrated = applyHubSettingsMigrations(legacyNoPreview);
    expect(migrated.features).toEqual({});
    expect(migrated.schemaVersion).toBeGreaterThanOrEqual(1.1);
  });

  it("does not modify settings when schemaVersion >= 1.1", () => {
    const recent: any = { schemaVersion: 1.2, preview: { a: 9 } };
    const migrated = applyHubSettingsMigrations(recent);
    // since schemaVersion >= 1.1, swapPreviewToFeatures should not run
    expect((migrated as any).preview).toEqual({ a: 9 });
    expect(migrated.schemaVersion).toBe(1.2);
  });
});
