import { upgradeCatalogSchema } from "../../src/search/upgradeCatalogSchema";

describe("upgradeCatalogSchema", () => {
  it("returns default catalog if null", () => {
    const chk = upgradeCatalogSchema(null);
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(0);
    expect(chk.scopes?.event?.filters.length).toBe(0);
  });

  it("returns default catalog if passed empty object", () => {
    const chk = upgradeCatalogSchema({});
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(0);
    expect(chk.scopes?.event?.filters.length).toBe(0);
  });

  it("does not return groups if passed empty array", () => {
    const chk = upgradeCatalogSchema({ groups: [] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(0);
    expect(chk.scopes?.event?.filters.length).toBe(0);
  });

  it("returns groups if passed a string", () => {
    const chk = upgradeCatalogSchema({ groups: "3ef" });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(1);
    expect(chk.scopes?.item?.filters[0].predicates[0].group).toEqual(["3ef"]);
    expect(chk.scopes?.event?.filters.length).toBe(1);
    expect(chk.scopes?.event?.filters[0].predicates[0].group).toEqual(["3ef"]);
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
    expect(chk.scopes?.event?.filters.length).toBe(1);
    expect(chk.scopes?.event?.filters[0].predicates[0].group).toEqual([
      "3ef",
      "bc4",
    ]);
  });

  it("handles org-level home site legacy catalogs", () => {
    const chk = upgradeCatalogSchema({ orgId: "a3g" });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scopes).toBeDefined();

    const scopeKeys = Object.keys(chk.scopes).sort();
    expect(scopeKeys).toEqual(["event", "group", "item", "user"]);

    expect(chk.scopes.item).toBeDefined();
    expect(chk.scopes.item.filters.length).toBe(1);
    expect(chk.scopes.item.filters[0].operation).toEqual("AND");
    expect(chk.scopes.item.filters[0].predicates[0].orgid).toEqual(["a3g"]);
    expect(chk.scopes.item.filters[0].predicates[1].type).toEqual({
      not: ["Code Attachment"],
    });

    expect(chk.scopes.event).toBeDefined();
    expect(chk.scopes.event.filters.length).toBe(1);
    expect(chk.scopes.event.filters[0].operation).toEqual("AND");
    expect(chk.scopes.event.filters[0].predicates[0].orgId).toEqual("a3g");
    expect(chk.scopes.event.filters[0].predicates[1]).toBeUndefined();

    expect(chk.scopes.group).toBeDefined();
    expect(chk.scopes.group.filters.length).toBe(1);
    expect(chk.scopes.group.filters[0].operation).toEqual("AND");
    expect(chk.scopes.group.filters[0].predicates[0].orgid).toEqual("a3g");
    expect(chk.scopes.group.filters[0].predicates[1]).toBeUndefined();

    expect(chk.scopes.user).toBeDefined();
    expect(chk.scopes.user.filters.length).toBe(1);
    expect(chk.scopes.user.filters[0].operation).toEqual("AND");
    expect(chk.scopes.user.filters[0].predicates[0].orgid).toEqual("a3g");
    expect(chk.scopes.user.filters[0].predicates[1]).toBeUndefined();
  });

  it("skips upgrade if on the same version", () => {
    const cat = { schemaVersion: 1.0 };
    const chk = upgradeCatalogSchema(cat);
    expect(chk).toEqual(cat);
  });
  it("skips applySchema if version already applied", () => {
    const cat = { schemaVersion: 1.1 };
    const chk = upgradeCatalogSchema(cat);
    expect(chk).toEqual(cat);
  });
});
