import { upgradeCatalogSchema, Filter, IFilterGroup } from "../../src/search";

describe("upgradeCatalogSchema", () => {
  it("returns default catalog if null", () => {
    const chk = upgradeCatalogSchema(null);
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(0);
  });

  it("returns default catalog if passed empty object", () => {
    const chk = upgradeCatalogSchema({});
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(0);
  });

  it("does not return groups if passed empty array", () => {
    const chk = upgradeCatalogSchema({ groups: [] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(0);
  });

  it("returns groups if passed a string", () => {
    const chk = upgradeCatalogSchema({ groups: "3ef" });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(1);
    expect(chk.scopes?.item?.filters[0].predicates[0].group).toEqual(["3ef"]);
  });

  it("returns groups if passed an array", () => {
    const chk = upgradeCatalogSchema({ groups: ["3ef", "bc4"] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(1);
    expect(chk.scopes?.item?.filters[0].predicates[0].group).toEqual([
      "3ef",
      "bc4",
    ]);
  });
});
