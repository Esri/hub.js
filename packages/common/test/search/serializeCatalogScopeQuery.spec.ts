import { serializeCatalogScope } from "../../src/search/serializeCatalogScopeQuery";
import { IHubCatalog, EntityType } from "../../src/search/types/IHubCatalog";
import * as upgradeCatalogSchemaModule from "../../src/search/upgradeCatalogSchema";
import * as expandPortalQueryModule from "../../src/search/utils";
import * as serializeQueryForPortalModule from "../../src/search/serializeQueryForPortal";

describe("serializeCatalogScope", () => {
  let mockCatalog: IHubCatalog;

  let oldCatalog: any;

  beforeEach(() => {
    oldCatalog = {
      groups: ["ff1", "bb3"],
    };

    mockCatalog = {
      schemaVersion: 1,
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            {
              predicates: [{ group: ["00c", "ff2"] }],
            },
          ],
        },
        group: {
          targetEntity: "group",
          filters: [
            {
              predicates: [{ access: "public" }],
            },
          ],
        },
      },
    } as IHubCatalog;

    vi.spyOn(upgradeCatalogSchemaModule, "upgradeCatalogSchema");
    vi.spyOn(expandPortalQueryModule, "expandPortalQuery");
    vi.spyOn(serializeQueryForPortalModule, "serializeQueryForPortal");
  });

  it("upgrades an old catalog", () => {
    const result = serializeCatalogScope(oldCatalog, "item");
    expect(result).toEqual({ q: '((group:"ff1" OR group:"bb3"))' });
    expect(
      upgradeCatalogSchemaModule.upgradeCatalogSchema
    ).toHaveBeenCalledWith(oldCatalog);
    expect(expandPortalQueryModule.expandPortalQuery).toHaveBeenCalled();
  });

  it("serializes catalog scope for a valid scope", () => {
    const result = serializeCatalogScope(mockCatalog, "item");
    expect(
      upgradeCatalogSchemaModule.upgradeCatalogSchema
    ).toHaveBeenCalledWith(mockCatalog);
    expect(expandPortalQueryModule.expandPortalQuery).toHaveBeenCalled();
    expect(
      serializeQueryForPortalModule.serializeQueryForPortal
    ).toHaveBeenCalled();
    expect(result).toEqual({ q: '((group:"00c" OR group:"ff2"))' });
  });

  it("throws error if scope query is missing", () => {
    expect(() =>
      serializeCatalogScope(mockCatalog, "unknown" as EntityType)
    ).toThrowError("No query found for scope: unknown");
  });

  it("serializes catalog scope for another valid scope", () => {
    const result = serializeCatalogScope(mockCatalog, "group");
    expect(result).toEqual({ q: '(access:"public")' });
  });
});
