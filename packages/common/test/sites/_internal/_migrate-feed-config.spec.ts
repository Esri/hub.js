import { _migrateFeedConfig } from "../../../src/sites/_internal/_migrate-feed-config";

describe("_migrateFeedConfig", () => {
  it("runs migration safely", () => {
    const model: any = { item: { properties: {} }, data: { values: {} } };
    const result = _migrateFeedConfig(model);
    expect(result).toBeDefined();
    // ensure feeds object exists on result
    expect(result.data.feeds).toBeDefined();
  });
});
