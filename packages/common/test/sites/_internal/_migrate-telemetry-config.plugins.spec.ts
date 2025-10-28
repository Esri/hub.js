import { describe, it, expect } from "vitest";
import { _migrateTelemetryConfig } from "../../../src/sites/_internal/_migrate-telemetry-config";

describe("_migrateTelemetryConfig plugins branch", () => {
  it("moves item.properties.telemetry.plugins into data.telemetry.plugins", () => {
    const model: any = {
      item: {
        properties: { schemaVersion: 1, telemetry: { plugins: ["p1", "p2"] } },
      },
      data: { values: {} },
    };

    const out = _migrateTelemetryConfig(model);
    expect(out.data.telemetry).toBeDefined();
    expect(out.data.telemetry.plugins).toEqual(["p1", "p2"]);
    expect(out.item.properties.schemaVersion).toBe(1.8);
  });
});
