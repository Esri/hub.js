import { convertCatalog, Filter } from "../../src/search";

describe("convertCatalog", () => {
  it("returns default catalog if null", () => {
    const chk = convertCatalog(null);
    expect(chk.title).toBe("Default Catalog");
    expect(chk.filter.filterType).toBe("content");
    const filter = chk.filter as Filter<"content">;
    expect(filter.group).not.toBeDefined();
  });

  it("returns default catalog if passed empty object", () => {
    const chk = convertCatalog({});
    expect(chk.title).toBe("Default Catalog");
    expect(chk.filter.filterType).toBe("content");
    const filter = chk.filter as Filter<"content">;
    expect(filter.group).not.toBeDefined();
  });

  it("does not return groups if passed empty array", () => {
    const chk = convertCatalog({ groups: [] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.filter.filterType).toBe("content");
    const filter = chk.filter as Filter<"content">;
    expect(filter.group).not.toBeDefined();
  });

  it("returns groups if passed a string", () => {
    const chk = convertCatalog({ groups: "3ef" });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.filter.filterType).toBe("content");
    const filter = chk.filter as Filter<"content">;
    expect(filter.group).toBeDefined();
    expect(filter.group).toEqual(["3ef"]);
  });

  it("returns groups if passed a array", () => {
    const chk = convertCatalog({ groups: ["3ef", "bc4"] });
    expect(chk.title).toBe("Default Catalog");
    expect(chk.filter.filterType).toBe("content");
    const filter = chk.filter as Filter<"content">;
    expect(filter.group).toBeDefined();
    expect(filter.group).toEqual(["3ef", "bc4"]);
  });
});
