import { upgradeSiteSchema } from "../../src";
import * as _applySiteSchemaModule from "../../src/sites/_apply-site-schema";
import * as _enforceLowercaseDomainsModule from "../../src/sites/_enforce-lowercase-domains";
import * as _ensureCatalogModule from "../../src/sites/_ensure-catalog";
import * as _purgeNonGuidsFromCatalogModule from "../../src/sites/_purge-non-guids-from-catalog";
import * as _ensureTelemetryModule from "../../src/sites/_ensure-telemetry";
import { IModel } from "../../src";
import { SITE_SCHEMA_VERSION } from "../../src/sites/site-schema-version";
import { expectAllCalled, expectAll } from "./test-helpers.test";

describe("upgradeSiteSchema", () => {
  let applySpy: jasmine.Spy;
  let enforceLowercaseSpy: jasmine.Spy;
  let ensureCatalogSpy: jasmine.Spy;
  let purgeNonGuidsSpy: jasmine.Spy;
  let ensureTelemetrySpy: jasmine.Spy;
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
      ],
      "toHaveBeenCalled",
      false,
      expect
    );
  });
});
