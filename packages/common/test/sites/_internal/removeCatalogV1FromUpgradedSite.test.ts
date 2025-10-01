import { IModel } from "../../../src";
import { removeCatalogV1FromUpgradedSite } from "../../../src/sites/_internal/removeCatalogV1FromUpgradedSite";

describe("removeCatalogV1FromUpgradedSite", () => {
  it("removes catalog property if useCatalogV2 is true", () => {
    const model = {
      data: {
        useCatalogV2: true,
        catalog: { foo: "bar" },
        other: "value",
      },
    };
    const result = removeCatalogV1FromUpgradedSite(model as any);
    expect(result.data.catalog).toBeUndefined();
    expect(result.data.useCatalogV2).toBe(true);
    expect(result.data.other).toBe("value");
  });

  it("does not remove catalog property if useCatalogV2 is false", () => {
    const model = {
      data: {
        useCatalogV2: false,
        catalog: { foo: "bar" },
      },
    };
    const result = removeCatalogV1FromUpgradedSite(model as any);
    expect(result.data.catalog).toEqual({ foo: "bar" });
    expect(result.data.useCatalogV2).toBe(false);
  });

  it("returns a clone, does not mutate original", () => {
    const model = {
      data: {
        useCatalogV2: true,
        catalog: { foo: "bar" },
      },
    } as unknown as IModel;
    const original = JSON.parse(JSON.stringify(model));
    const result = removeCatalogV1FromUpgradedSite(model as any);
    expect(model).toEqual(original);
    expect(result).not.toBe(model);
  });
});
