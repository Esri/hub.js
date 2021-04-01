import { upgradeDraftSchema } from "../../src";
import * as _ensureTelemetryModule from "../../src/_ensure-telemetry";
import { IModel } from "@esri/hub-common";
import { SITE_SCHEMA_VERSION } from "../../src/site-schema-version";
import { expectAll, expectAllCalled } from "../test-helpers.test";
import { IDraft } from "@esri/hub-common/src";

describe("upgradeSiteSchema", () => {
  let ensureTelemetrySpy: jasmine.Spy;
  beforeEach(() => {
    ensureTelemetrySpy = spyOn(
      _ensureTelemetryModule,
      "_ensureTelemetry"
    ).and.callFake((model: IModel) => model);
  });

  it("runs schema upgrades when schema out of date", async () => {
    const draft = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION - 1
        }
      }
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAllCalled([ensureTelemetrySpy], expect);
  });

  it("runs schema upgrades when no schema version", async () => {
    const draft = {
      item: {
        // no properties.schemaVersion
      }
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAllCalled([ensureTelemetrySpy], expect);
  });

  it("runs schema upgrades when schema", async () => {
    const draft = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION - 1
        }
      }
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAllCalled([ensureTelemetrySpy], expect);
  });

  it("skips upgrade if already at current schema version", async () => {
    const draft = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION
        }
      }
    } as IDraft;

    upgradeDraftSchema(draft);

    expectAll([ensureTelemetrySpy], "toHaveBeenCalled", false, expect);
  });
});
