import { convertCatalog, Filter, IFilterGroup } from "../../src/search";

describe("convertCatalog", () => {
  it("returns default catalog if null", () => {
    const chk = convertCatalog(null);
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scope.length).toBe(1);
    const fg = chk.scope[0] as IFilterGroup<"item">;
    expect(fg.filters.length).toBe(0);
  });

  it("returns default catalog if passed empty object", () => {
    const chk = convertCatalog({});
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scope.length).toBe(1);
    expect(chk.scope[0].filterType).toBe("item");
    const fg = chk.scope[0] as IFilterGroup<"item">;
    expect(fg.filters.length).toBe(0);
  });

  it("does not return groups if passed empty array", () => {
    const chk = convertCatalog({ groups: [] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scope.length).toBe(1);
    expect(chk.scope[0].filterType).toBe("item");
    const fg = chk.scope[0] as IFilterGroup<"item">;
    expect(fg.filters.length).toBe(0);
  });

  it("returns groups if passed a string", () => {
    const chk = convertCatalog({ groups: "3ef" });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scope.length).toBe(1);
    expect(chk.scope[0].filterType).toBe("item");
    const fg = chk.scope[0] as IFilterGroup<"item">;
    expect(fg.filters[0].group).toBeDefined();
    expect(fg.filters[0].group).toEqual(["3ef"]);
  });

  it("returns groups if passed an array", () => {
    const chk = convertCatalog({ groups: ["3ef", "bc4"] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.scope.length).toBe(1);
    expect(chk.scope[0].filterType).toBe("item");
    const fg = chk.scope[0] as IFilterGroup<"item">;
    expect(fg.filters[0].group).toBeDefined();
    expect(fg.filters[0].group).toEqual(["3ef", "bc4"]);
  });
});
