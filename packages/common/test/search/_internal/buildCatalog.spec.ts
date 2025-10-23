import { describe, it, expect } from "vitest";
import { buildCatalog } from "../../../src/search/_internal/buildCatalog";
import { IHubCollection } from "../../../src/search/types/IHubCatalog";
describe("buildCatalog:", () => {
  it("returns a valid hub catalog structure", () => {
    const catalog = buildCatalog(
      "mockI18nScope",
      "myContent",
      [{ predicates: [{ owner: "vader" }] }],
      [
        { key: "myContent" } as IHubCollection,
        { key: "favorites" } as IHubCollection,
      ],
      "item"
    );

    expect(catalog.title).toEqual(
      "{{mockI18nScopecatalog.myContent:translate}}"
    );
    expect(catalog.scopes?.item?.filters).toEqual([
      { predicates: [{ owner: "vader" }] },
    ]);
    expect(catalog.collections?.map((c) => c.key)).toEqual([
      "myContent",
      "favorites",
    ]);
  });
});
