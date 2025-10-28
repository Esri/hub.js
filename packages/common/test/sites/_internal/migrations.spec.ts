import { describe, it, expect } from "vitest";
import { _enforceLowercaseDomains } from "../../../src/sites/_internal/_enforce-lowercase-domains";
import { _migrateFeedConfig } from "../../../src/sites/_internal/_migrate-feed-config";
import { _migrateTelemetryConfig } from "../../../src/sites/_internal/_migrate-telemetry-config";
import { _purgeNonGuidsFromCatalog } from "../../../src/sites/_internal/_purge-non-guids-from-catalog";
import { applyCatalogStructureMigration } from "../../../src/sites/_internal/applyCatalogStructureMigration";
import { applyPermissionMigration } from "../../../src/sites/_internal/applyPermissionMigration";
import { convertFeaturesToLegacyCapabilities } from "../../../src/sites/_internal/capabilities/convertFeaturesToLegacyCapabilities";
import { migrateLegacyCapabilitiesToFeatures } from "../../../src/sites/_internal/capabilities/migrateLegacyCapabilitiesToFeatures";

const cloneObject = (v: any): any => JSON.parse(JSON.stringify(v));

const baseModel: any = {
  item: { properties: { schemaVersion: 1 } },
  data: { values: {} },
};

describe("site migrations minimal coverage", () => {
  it("_enforceLowercaseDomains lowercases and bumps version", () => {
    const m = cloneObject(baseModel);
    m.data.values.subdomain = "ABC";
    const res = _enforceLowercaseDomains(m);
    expect(res.data.values.subdomain).toBe("abc");
    expect(res.item.properties.schemaVersion).toBe(1.1);
  });

  it("_migrateFeedConfig migrates legacy dcatConfig to feeds.dcatUS11", () => {
    const m = cloneObject(baseModel);
    m.item.properties.schemaVersion = 1.0;
    m.data.values.dcatConfig = { title: "{{default.name}}" };
    const res = _migrateFeedConfig(m);
    expect(res.data.feeds.dcatUS11.title).toBe("{{name}}");
    expect(res.item.properties.schemaVersion).toBe(1.5);
  });

  it("_migrateTelemetryConfig migrates telemetry fields and bumps version", () => {
    const m: any = cloneObject(baseModel);
    m.item.properties.schemaVersion = 1.7;
    m.data.values.telemetry = {
      consentNotice: { consentText: "ok" },
      policyURL: "u",
    };
    const res = _migrateTelemetryConfig(m);
    expect(res.data.telemetry.consentNotice).toBeDefined();
    expect(res.item.properties.schemaVersion).toBeGreaterThan(1.7);
  });

  it("_purgeNonGuidsFromCatalog removes non-guids and bumps version", () => {
    const m: any = cloneObject(baseModel);
    m.item.properties.schemaVersion = 1.0;
    m.data.catalog = {
      groups: ["abc", "123e4567-e89b-12d3-a456-426614174000"],
    };
    const res = _purgeNonGuidsFromCatalog(m);
    expect(res.data.catalog.groups).toEqual([
      "123e4567-e89b-12d3-a456-426614174000",
    ]);
    expect(res.item.properties.schemaVersion).toBe(1.3);
  });
});

describe("site migrations extra coverage", () => {
  it("applyCatalogStructureMigration no-ops when schemaVersion present and handles umbrella site", () => {
    const modelNoop: any = { data: { catalog: { schemaVersion: 2 } } };
    expect(applyCatalogStructureMigration(modelNoop)).toBe(modelNoop);

    const umbrella: any = {
      data: { catalog: {}, values: { isUmbrella: true } },
      item: { properties: {} },
    };
    const out = applyCatalogStructureMigration(umbrella) as any;
    // should have title overridden
    expect(out.data.catalog.title).toBe("Default Site Catalog");
    expect(out.data.catalog.scopes.item).toBeDefined();
  });

  it("applyPermissionMigration adds permissions based on props", () => {
    const model: any = {
      item: { owner: "u1", properties: { contentGroupId: "g1" } },
      data: { permissions: [] },
    };
    const out = applyPermissionMigration(model) as any;
    expect(
      out.data.permissions.some((p: any) => p.permission === "hub:site:delete")
    ).toBe(true);
    expect(
      out.data.permissions.some(
        (p: any) => p.permission === "hub:project:create"
      )
    ).toBe(true);
  });

  it("capabilities migrations sync features and legacy capabilities", () => {
    const cloneObject = (v: any): any => JSON.parse(JSON.stringify(v));
    const modelA: any = {
      data: {
        values: { capabilities: ["consentNotice"] },
        settings: { features: { foo: true } },
      },
    };
    const resFeatures = migrateLegacyCapabilitiesToFeatures(
      cloneObject(modelA)
    ) as any;
    expect(resFeatures.data.settings.features).toBeDefined();

    const modelB: any = {
      data: {
        settings: { features: { anonymous: true } },
        values: { capabilities: [] },
      },
    };
    const withLegacy = convertFeaturesToLegacyCapabilities(
      cloneObject(modelB),
      cloneObject(modelB)
    ) as any;
    expect(withLegacy.data.values.capabilities).toBeDefined();
  });
});

describe("site migration branches", () => {
  it("_enforceLowercaseDomains returns original model when schemaVersion >= 1.1", () => {
    const model: any = {
      item: { properties: { schemaVersion: 1.1 } },
      data: { values: {} },
    };
    const out = _enforceLowercaseDomains(model);
    expect(out).toBe(model);
  });

  it("_migrateFeedConfig returns original when schemaVersion >= 1.5", () => {
    const model: any = {
      item: { properties: { schemaVersion: 1.5 } },
      data: { values: {} },
    };
    const out = _migrateFeedConfig(model);
    expect(out).toBe(model);
  });

  it("_migrateTelemetryConfig returns original when schemaVersion >= 1.8", () => {
    const model: any = {
      item: { properties: { schemaVersion: 1.8 } },
      data: { values: {} },
    };
    const out = _migrateTelemetryConfig(model);
    expect(out).toBe(model);
  });

  it("_purgeNonGuidsFromCatalog returns original when schemaVersion >= 1.3", () => {
    const model: any = {
      item: { properties: { schemaVersion: 1.3 } },
      data: { catalog: { groups: ["a"] } },
    };
    const out = _purgeNonGuidsFromCatalog(model);
    expect(out).toBe(model);
  });

  it("applyPermissionMigration does nothing when no props present", () => {
    const model: any = { item: { properties: {} }, data: { permissions: [] } };
    const out = applyPermissionMigration(model);
    expect(out.data.permissions).toEqual([]);
  });

  it("_purgeNonGuidsFromCatalog handles missing groups gracefully", () => {
    const model: any = {
      item: { properties: { schemaVersion: 1 } },
      data: { catalog: {} },
    };
    const out = _purgeNonGuidsFromCatalog(model) as any;
    expect(out.item.properties.schemaVersion).toBe(1.3);
    expect(Array.isArray(out.data.catalog.groups)).toBe(true);
  });

  it("applyPermissionMigration does not duplicate existing permission", () => {
    const model: any = {
      item: { owner: "u1", properties: { contentGroupId: "g1" } },
      data: {
        permissions: [
          {
            permission: "hub:site:delete",
            collaborationId: "u1",
            collaborationType: "user",
          },
        ],
      },
    };
    const out = applyPermissionMigration(model) as any;
    // should not create a duplicate for hub:site:delete
    const matches = out.data.permissions.filter(
      (p: any) =>
        p.permission === "hub:site:delete" && p.collaborationId === "u1"
    );
    expect(matches.length).toBe(1);
  });
});
