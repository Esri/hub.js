import { upgradeDraftSchema } from "../../src";
import * as commonModule from "@esri/hub-common";
import { IModel } from "@esri/hub-common";
import { SITE_SCHEMA_VERSION } from "../../src/site-schema-version";
import { expectAll, expectAllCalled } from "../test-helpers.test";
import { IDraft } from "@esri/hub-common/src";

describe("upgradeDraftSchema", () => {
  let ensureTelemetrySpy: jasmine.Spy;
  let migrateFeedConfigSpy: jasmine.Spy;
  let migrateEventListCardConfigsSpy: jasmine.Spy;
  let migrateTelemetryConfigSpy: jasmine.Spy;
  let migrateBadBasemapSpy: jasmine.Spy;
  let migrateToV2CatalogSpy: jasmine.Spy;

  beforeEach(() => {
    ensureTelemetrySpy = spyOn(commonModule, "_ensureTelemetry").and.callFake(
      (model: IModel) => model
    );
    migrateFeedConfigSpy = spyOn(
      commonModule,
      "_migrateFeedConfig"
    ).and.callFake((model: IModel) => model);
    migrateEventListCardConfigsSpy = spyOn(
      commonModule,
      "_migrateEventListCardConfigs"
    ).and.callFake((model: IModel) => model);
    migrateTelemetryConfigSpy = spyOn(
      commonModule,
      "_migrateTelemetryConfig"
    ).and.callFake((model: IModel) => model);
    migrateBadBasemapSpy = spyOn(
      commonModule,
      "migrateBadBasemap"
    ).and.callFake((model: IModel) => model);
    migrateToV2CatalogSpy = spyOn(
      commonModule,
      "_migrateToV2Catalog"
    ).and.callFake((model: IModel) => model);
  });

  it("runs schema upgrades when schema out of date", async () => {
    const draft = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION - 1,
        },
      },
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAllCalled(
      [
        ensureTelemetrySpy,
        migrateFeedConfigSpy,
        migrateEventListCardConfigsSpy,
        migrateTelemetryConfigSpy,
        migrateBadBasemapSpy,
        migrateToV2CatalogSpy,
      ],
      expect
    );
  });

  it("runs schema upgrades when no schema version", async () => {
    const draft = {
      item: {
        // no properties.schemaVersion
      },
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAllCalled(
      [
        ensureTelemetrySpy,
        migrateFeedConfigSpy,
        migrateEventListCardConfigsSpy,
        migrateTelemetryConfigSpy,
        migrateBadBasemapSpy,
      ],
      expect
    );
  });

  it("runs schema upgrades when schema", async () => {
    const draft = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION - 1,
        },
      },
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAllCalled(
      [
        ensureTelemetrySpy,
        migrateFeedConfigSpy,
        migrateEventListCardConfigsSpy,
        migrateTelemetryConfigSpy,
        migrateBadBasemapSpy,
        migrateToV2CatalogSpy,
      ],
      expect
    );
  });

  it("skips upgrade if already at current schema version", async () => {
    const draft = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION,
        },
      },
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAll(
      [
        ensureTelemetrySpy,
        migrateFeedConfigSpy,
        migrateEventListCardConfigsSpy,
        migrateTelemetryConfigSpy,
        migrateToV2CatalogSpy,
      ],
      "toHaveBeenCalled",
      false,
      expect
    );
    // should still run versionless migrations
    expectAllCalled([migrateBadBasemapSpy], expect);
  });
});
