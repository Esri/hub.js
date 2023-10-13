import { IModel } from "../../../src";
import { _migrateTelemetryConfig } from "../../../src/sites/_internal/_migrate-telemetry-config";

describe("_migrateTelemetryConfig", () => {
  it("Bumps the item.properties.schemaVersion if schemaVersion is < 1.7", () => {
    const siteModel = {
      item: { properties: { schemaVersion: 1.6 } },
      data: { values: {} },
    } as unknown as IModel;
    const result = _migrateTelemetryConfig(siteModel);
    expect(result.item.properties.schemaVersion).toEqual(
      1.7,
      "site.item.properties.schemaVersion should be 1.7"
    );
  });

  it("Does not run the migration if schemaVersion is >= 1.7", () => {
    const siteModel = {
      item: {
        properties: {
          schemaVersion: 1.7,
        },
      },
    } as unknown as IModel;

    const result = _migrateTelemetryConfig(siteModel);
    expect(result).toEqual(siteModel, "The site object should be unchanged.");
  });

  it("should apply migration if schemaVersion < newSchemaVersion", () => {
    const model = {
      item: { properties: { schemaVersion: 1.6 } },
      data: {
        values: {
          capabilities: ["consentNotice"],
          telemetry: { consentNotice: { consentText: "some text" } },
        },
      },
    };
    const result = _migrateTelemetryConfig(model);
    expect(result.item.properties.schemaVersion).toEqual(1.7);
    expect(
      (result.data as any).telemetry.consentNotice.allowPrivacyConfig
    ).toEqual(true);
    expect(
      (result.data as any).telemetry.consentNotice.disclaimer[0].text
    ).toEqual("some text");
  });

  it("should move plugins to data.telemetry if it exists", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1,
          telemetry: { plugins: ["plugin1", "plugin2"] },
        },
      },
      data: {
        values: {
          capabilities: ["consentNotice"],
          telemetry: { consentNotice: { consentText: "some text" } },
        },
      },
    };
    const result = _migrateTelemetryConfig(model);
    expect((result.data as any).telemetry.plugins).toEqual([
      "plugin1",
      "plugin2",
    ]);
  });

  it("should not move plugins to data.telemetry if it does not exist", () => {
    const model = {
      item: { properties: { schemaVersion: 1 } },
      data: {
        values: {
          capabilities: ["consentNotice"],
          telemetry: { consentNotice: { consentText: "some text" } },
        },
      },
    };
    const result = _migrateTelemetryConfig(model);
    expect((result.data as any).telemetry.plugins).toBeUndefined();
  });
});
