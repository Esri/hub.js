import { _migrateTelemetryConfig } from "../../../src/sites/_internal/_migrate-telemetry-config";

describe("_migrateTelemetryConfig", () => {
  it("runs migration safely", () => {
    const model: any = { item: { properties: {} }, data: {} };
    const chk = _migrateTelemetryConfig(model);
    expect(chk).toBeDefined();
  });
});
