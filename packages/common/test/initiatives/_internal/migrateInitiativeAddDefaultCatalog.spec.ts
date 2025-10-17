import { migrateInitiativeAddDefaultCatalog } from "../../../src/initiatives/_internal/migrateInitiativeAddDefaultCatalog";
import { IHubInitiative } from "../../../src/core/types/IHubInitiative";

describe("migrateInitiativeAddDefaultCatalog", () => {
  it("returns initiative unchanged if schemaVersion >= 1.1", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.2,
      catalog: {
        schemaVersion: 1,
        title: "Existing Catalog",
        scopes: {},
        collections: [],
      },
    } as any;
    const result = migrateInitiativeAddDefaultCatalog(initiative);
    expect(result).toBe(initiative);
  });

  it("adds default catalog and sets schemaVersion to 1.1 if schemaVersion < 1.1", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
      contentGroupId: "group123",
    } as any;
    const result = migrateInitiativeAddDefaultCatalog(initiative);
    expect(result.schemaVersion).toBe(1.1);
    expect(result.catalog).toBeDefined();
    expect(result.catalog.title).toBe("Default Initiative Catalog");
    expect(result.catalog.scopes.item.filters[0].predicates[0].group).toEqual([
      "group123",
    ]);
  });

  it("adds default catalog with empty group if contentGroupId is missing", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
    } as any;
    const result = migrateInitiativeAddDefaultCatalog(initiative);
    expect(result.catalog.scopes.item.filters[0].predicates[0].group).toEqual(
      []
    );
  });

  it("does not mutate the original initiative object", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
      contentGroupId: "group123",
    } as any;
    const original = { ...initiative };
    migrateInitiativeAddDefaultCatalog(initiative);
    expect(initiative).toEqual(original);
  });
});
