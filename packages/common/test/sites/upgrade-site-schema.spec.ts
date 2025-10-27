import * as _applySiteSchemaModule from "../../src/sites/_internal/_apply-site-schema";
import * as _enforceLowercaseDomainsModule from "../../src/sites/_internal/_enforce-lowercase-domains";
import * as _ensureCatalogModule from "../../src/sites/_internal/_ensure-catalog";
import * as _purgeNonGuidsFromCatalogModule from "../../src/sites/_internal/_purge-non-guids-from-catalog";
import * as _ensureTelemetryModule from "../../src/sites/_internal/_ensure-telemetry";
import * as _migrateFeedConfigModule from "../../src/sites/_internal/_migrate-feed-config";
import * as _migrateEventListCardConfigs from "../../src/sites/_internal/_migrate-event-list-card-configs";
import * as migrateLegacyCapabilitiesToFeatures from "../../src/sites/_internal/capabilities/migrateLegacyCapabilitiesToFeatures";
import * as _migrateTelemetryConfig from "../../src/sites/_internal/_migrate-telemetry-config";
import * as _migrateLinkUnderlinesCapability from "../../src/sites/_internal/_migrate-link-underlines-capability";
import * as migrateBadBasemapModule from "../../src/sites/_internal/migrateBadBasemap";
import * as ensureBaseTelemetry from "../../src/sites/_internal/ensureBaseTelemetry";
import * as _migrateToV2CatalogModule from "../../src/sites/_internal/_migrate-to-v2-catalog";
import * as ensureLowercaseOrgUrlKeySlugAndKeywordModule from "../../src/sites/_internal/ensureLowercaseOrgUrlKeySlugAndKeyword";
import { SITE_SCHEMA_VERSION } from "../../src/sites/site-schema-version";
import { expectAllCalled, expectAll } from "./test-helpers";
import { IModel } from "../../src/hub-types";
import { upgradeSiteSchema } from "../../src/sites/upgrade-site-schema";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

describe("upgradeSiteSchema", () => {
  let applySpy: any;
  let enforceLowercaseSpy: any;
  let ensureCatalogSpy: any;
  let purgeNonGuidsSpy: any;
  let ensureTelemetrySpy: any;
  let migrateFeedConfigSpy: any;
  let migrateEventListCardConfigsSpy: any;
  let migrateLegacyCapabilitiesToFeaturesSpy: any;
  let migrateTelemetryConfigSpy: any;
  let migrateLinkUnderlinesCapabilitySpy: any;
  let migrateBadBasemapSpy: any;
  let ensureBaseTelemetrySpy: any;
  let migrateToV2CatalogSpy: any;
  let slugFixSpy: any;

  beforeEach(() => {
    applySpy = vi
      .spyOn(_applySiteSchemaModule, "_applySiteSchema")
      .mockImplementation((model: IModel) => model);
    enforceLowercaseSpy = vi
      .spyOn(_enforceLowercaseDomainsModule, "_enforceLowercaseDomains")
      .mockImplementation((model: IModel) => model);
    ensureCatalogSpy = vi
      .spyOn(_ensureCatalogModule, "_ensureCatalog")
      .mockImplementation((model: IModel) => model);
    purgeNonGuidsSpy = vi
      .spyOn(_purgeNonGuidsFromCatalogModule, "_purgeNonGuidsFromCatalog")
      .mockImplementation((model: IModel) => model);
    ensureTelemetrySpy = vi
      .spyOn(_ensureTelemetryModule, "_ensureTelemetry")
      .mockImplementation((model: IModel) => model);
    migrateFeedConfigSpy = vi
      .spyOn(_migrateFeedConfigModule, "_migrateFeedConfig")
      .mockImplementation((model: IModel) => model);
    migrateEventListCardConfigsSpy = vi
      .spyOn(_migrateEventListCardConfigs, "_migrateEventListCardConfigs")
      .mockImplementation((model: IModel) => model);
    migrateLegacyCapabilitiesToFeaturesSpy = vi
      .spyOn(
        migrateLegacyCapabilitiesToFeatures,
        "migrateLegacyCapabilitiesToFeatures"
      )
      .mockImplementation((model: IModel) => model);
    migrateTelemetryConfigSpy = vi
      .spyOn(_migrateTelemetryConfig, "_migrateTelemetryConfig")
      .mockImplementation((model: IModel) => model);
    migrateLinkUnderlinesCapabilitySpy = vi
      .spyOn(
        _migrateLinkUnderlinesCapability,
        "_migrateLinkUnderlinesCapability"
      )
      .mockImplementation((model: IModel) => model);
    migrateBadBasemapSpy = vi
      .spyOn(migrateBadBasemapModule, "migrateBadBasemap")
      .mockImplementation((model: IModel) => model);
    ensureBaseTelemetrySpy = vi
      .spyOn(ensureBaseTelemetry, "ensureBaseTelemetry")
      .mockImplementation((model: IModel) => model);
    migrateToV2CatalogSpy = vi
      .spyOn(_migrateToV2CatalogModule, "_migrateToV2Catalog")
      .mockImplementation((model: IModel) => model);

    slugFixSpy = vi
      .spyOn(
        ensureLowercaseOrgUrlKeySlugAndKeywordModule,
        "ensureLowercaseOrgUrlKeySlugAndKeyword"
      )
      .mockImplementation((model: IModel) => model);
  });

  afterEach(() => vi.restoreAllMocks());

  it("runs schema upgrades", async () => {
    const model = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION - 1,
        },
      },
    } as IModel;

    upgradeSiteSchema(model);

    expectAllCalled(
      [
        applySpy,
        enforceLowercaseSpy,
        ensureCatalogSpy,
        purgeNonGuidsSpy,
        ensureTelemetrySpy,
        migrateFeedConfigSpy,
        migrateEventListCardConfigsSpy,
        migrateLegacyCapabilitiesToFeaturesSpy,
        migrateTelemetryConfigSpy,
        migrateBadBasemapSpy,
        ensureBaseTelemetrySpy,
        migrateLinkUnderlinesCapabilitySpy,
        migrateToV2CatalogSpy,
        slugFixSpy,
      ],
      expect
    );
  });

  it("skips upgrade if already at current schema version", async () => {
    const model = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION,
        },
      },
    } as IModel;

    upgradeSiteSchema(model);

    expectAll(
      [
        applySpy,
        enforceLowercaseSpy,
        ensureCatalogSpy,
        purgeNonGuidsSpy,
        ensureTelemetrySpy,
        migrateFeedConfigSpy,
        migrateEventListCardConfigsSpy,
        migrateLegacyCapabilitiesToFeaturesSpy,
        migrateToV2CatalogSpy,
      ],
      "toHaveBeenCalled",
      false,
      expect
    );
    // Versionless migrations should still run
    expectAll([migrateBadBasemapSpy], "toHaveBeenCalled", true, expect);
    expectAll([ensureBaseTelemetrySpy], "toHaveBeenCalled", true, expect);
    expectAll(
      [migrateLinkUnderlinesCapabilitySpy, slugFixSpy],
      "toHaveBeenCalled",
      true,
      expect
    );
  });
});
