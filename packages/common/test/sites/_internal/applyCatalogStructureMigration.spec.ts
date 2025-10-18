import { applyCatalogStructureMigration } from "../../../src/sites/_internal/applyCatalogStructureMigration";

describe("applyCatalogStructureMigration", () => {
  it("returns input when called", () => {
    const model: any = { item: { properties: {} }, data: {} };
    const result = applyCatalogStructureMigration(model);
    // migration will add a default catalog when none exists
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.catalog).toBeDefined();
  });
});
