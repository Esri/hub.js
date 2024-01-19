import { upgradeSiteSchema } from "../../src";
import * as _applySiteSchemaModule from "../../src/sites/_internal/_apply-site-schema";
import * as _enforceLowercaseDomainsModule from "../../src/sites/_internal/_enforce-lowercase-domains";
import * as _ensureCatalogModule from "../../src/sites/_internal/_ensure-catalog";
import * as _purgeNonGuidsFromCatalogModule from "../../src/sites/_internal/_purge-non-guids-from-catalog";
import * as _ensureTelemetryModule from "../../src/sites/_internal/_ensure-telemetry";
import * as _migrateFeedConfigModule from "../../src/sites/_internal/_migrate-feed-config";
import * as _migrateEventListCardConfigs from "../../src/sites/_internal/_migrate-event-list-card-configs";
import * as migrateLegacyCapabilitiesToFeatures from "../../src/sites/_internal/capabilities/migrateLegacyCapabilitiesToFeatures";
import * as _migrateTelemetryConfig from "../../src/sites/_internal/_migrate-telemetry-config";
import * as migrateBadBasemapModule from "../../src/sites/_internal/migrateBadBasemap";
import { IModel } from "../../src";
import { SITE_SCHEMA_VERSION } from "../../src/sites/site-schema-version";
import { expectAllCalled, expectAll } from "./test-helpers.test";

describe("upgradeSiteSchema", () => {
  let applySpy: jasmine.Spy;
  let enforceLowercaseSpy: jasmine.Spy;
  let ensureCatalogSpy: jasmine.Spy;
  let purgeNonGuidsSpy: jasmine.Spy;
  let ensureTelemetrySpy: jasmine.Spy;
  let migrateFeedConfigSpy: jasmine.Spy;
  let migrateEventListCardConfigsSpy: jasmine.Spy;
  let migrateLegacyCapabilitiesToFeaturesSpy: jasmine.Spy;
  let migrateTelemetryConfigSpy: jasmine.Spy;
  let migrateBadBasemapSpy: jasmine.Spy;
  beforeEach(() => {
    applySpy = spyOn(_applySiteSchemaModule, "_applySiteSchema").and.callFake(
      (model: IModel) => model
    );
    enforceLowercaseSpy = spyOn(
      _enforceLowercaseDomainsModule,
      "_enforceLowercaseDomains"
    ).and.callFake((model: IModel) => model);
    ensureCatalogSpy = spyOn(
      _ensureCatalogModule,
      "_ensureCatalog"
    ).and.callFake((model: IModel) => model);
    purgeNonGuidsSpy = spyOn(
      _purgeNonGuidsFromCatalogModule,
      "_purgeNonGuidsFromCatalog"
    ).and.callFake((model: IModel) => model);
    ensureTelemetrySpy = spyOn(
      _ensureTelemetryModule,
      "_ensureTelemetry"
    ).and.callFake((model: IModel) => model);
    migrateFeedConfigSpy = spyOn(
      _migrateFeedConfigModule,
      "_migrateFeedConfig"
    ).and.callFake((model: IModel) => model);
    migrateEventListCardConfigsSpy = spyOn(
      _migrateEventListCardConfigs,
      "_migrateEventListCardConfigs"
    ).and.callFake((model: IModel) => model);
    migrateLegacyCapabilitiesToFeaturesSpy = spyOn(
      migrateLegacyCapabilitiesToFeatures,
      "migrateLegacyCapabilitiesToFeatures"
    ).and.callFake((model: IModel) => model);
    migrateTelemetryConfigSpy = spyOn(
      _migrateTelemetryConfig,
      "_migrateTelemetryConfig"
    ).and.callFake((model: IModel) => model);
    migrateBadBasemapSpy = spyOn(
      migrateBadBasemapModule,
      "migrateBadBasemap"
    ).and.callFake((model: IModel) => model);
  });

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
      ],
      "toHaveBeenCalled",
      false,
      expect
    );
    // Versionless migrations should still run
    expectAll([migrateBadBasemapSpy], "toHaveBeenCalled", true, expect);
  });
});
