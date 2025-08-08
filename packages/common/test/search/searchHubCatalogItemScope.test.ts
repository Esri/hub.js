import { searchHubCatalogItemScope } from "../../src";
import {
  IHubCatalog,
  IHubSearchOptions,
  IQuery,
  IHubSearchResponse,
} from "../../src/search/types";
import { IItem } from "@esri/arcgis-rest-portal";
import * as portalSearchItemsAsItemsModule from "../../src/search/_internal/portalSearchItems";

fdescribe("searchHubCatalogItemScope", () => {
  let catalog: IHubCatalog;
  let options: IHubSearchOptions;
  let query: string | IQuery;
  let response: IHubSearchResponse<IItem>;

  beforeEach(() => {
    catalog = {
      schemaVersion: 1,
      scopes: {
        item: {
          targetEntity: "item",
          filters: [{ predicates: [{ term: "scope" }] }],
        },
      },
    } as IHubCatalog;

    options = {} as IHubSearchOptions;
    response = {
      results: [],
      total: 0,
      hasNext: false,
    } as unknown as IHubSearchResponse<IItem>;
  });

  it("should reject if catalog does not define item scope", async () => {
    const badCatalog = {} as IHubCatalog;

    let error;
    try {
      await searchHubCatalogItemScope(badCatalog, "test", options);
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect((error as Error).message).toBe(
      "Catalog does not define an item scope for querying."
    );
  });

  it("should merge IQuery with item scope", async () => {
    const spy = spyOn(
      portalSearchItemsAsItemsModule,
      "portalSearchItemsAsItems"
    ).and.callFake(() => {
      return Promise.resolve(response);
    });
    query = {
      targetEntity: "item",
      filters: [{ predicates: [{ term: "another" }] }],
    };

    await searchHubCatalogItemScope(catalog, query, options);

    expect(spy).toHaveBeenCalled();
  });
});
