import * as DeepContainsModule from "../../src/core/_internal/deepContains";
import { vi } from "vitest";
import { IHubCatalog } from "../../src/search/types/IHubCatalog";
import { IArcGISContext } from "../../src/types/IArcGISContext";

describe("deepCatalogContains:", () => {
  afterEach(() => vi.restoreAllMocks());
  it("fails containment if the path is invalid", async () => {
    const ctx = {} as IArcGISContext;
    const path = "sites/00a/initiatives/00b/projects";
    const { deepCatalogContains } = await import(
      "../../src/core/deepCatalogContains"
    );
    const result = await deepCatalogContains("00c", "content", path, ctx);
    expect(result.isContained).toBeFalsy();
    expect(result.reason).toBe(
      "Path does not contain an even number of parts."
    );
  });
  it("handles random error from pathToCatalog", async () => {
    vi.spyOn(DeepContainsModule, "pathToCatalogInfo").mockImplementation(() => {
      throw new Error();
    });
    const ctx = {} as IArcGISContext;
    const path = "sites/00a/initiatives/00b/projects";
    const { deepCatalogContains } = await import(
      "../../src/core/deepCatalogContains"
    );
    const result = await deepCatalogContains("00c", "content", path, ctx);
    expect(result.isContained).toBeFalsy();
    expect(result.reason).toBe("An error occurred while parsing path.");
  });
  it("delegates to deepContains", async () => {
    const spy = vi
      .spyOn(DeepContainsModule, "deepContains")
      .mockImplementation(() =>
        Promise.resolve({
          identifier: "ff3",
          isContained: true,
          catalogInfo: {},
          duration: 0,
        })
      );

    const ctx = {} as IArcGISContext;

    const path = "sites/00a/initiatives/00b/projects/00c";

    const { deepCatalogContains } = await import(
      "../../src/core/deepCatalogContains"
    );

    const result = await deepCatalogContains("ff3", "content", path, ctx);

    expect(result.isContained).toBeTruthy();

    expect(spy).toHaveBeenCalledTimes(1);

    // validate the args passed to deepContains
    const calls = (spy as any).mock.calls as any[];
    const args = calls[calls.length - 1];
    expect(args[0]).toBe("ff3");
    expect(args[1]).toBe("content");
    expect(args[2]).toEqual([
      { id: "00c", hubEntityType: "project" },
      { id: "00b", hubEntityType: "initiative" },
      { id: "00a", hubEntityType: "site" },
    ]);
    expect(args[3]).toBe(ctx);
  });

  it("includes root Catalog is passed in", async () => {
    const spy = vi
      .spyOn(DeepContainsModule, "deepContains")
      .mockImplementation(() =>
        Promise.resolve({
          identifier: "ff3",
          isContained: true,
          catalogInfo: {},
          duration: 0,
        })
      );

    const ctx = {} as IArcGISContext;

    const rootCatalog: IHubCatalog = {
      schemaVersion: 1,
      scopes: {},
      collections: [],
    };

    const path = "initiatives/00b/projects/00c";

    const { deepCatalogContains } = await import(
      "../../src/core/deepCatalogContains"
    );

    const result = await deepCatalogContains(
      "ff3",
      "content",
      path,
      ctx,
      rootCatalog
    );

    expect(result.isContained).toBeTruthy();

    expect(spy).toHaveBeenCalledTimes(1);

    // validate the args passed to deepContains
    const calls2 = (spy as any).mock.calls as any[];
    const args2 = calls2[calls2.length - 1];
    expect(args2[0]).toBe("ff3");
    expect(args2[1]).toBe("content");
    expect(args2[2]).toEqual([
      { id: "00c", hubEntityType: "project" },
      { id: "00b", hubEntityType: "initiative" },
      { id: "root", hubEntityType: "site", catalog: rootCatalog },
    ]);
    expect(args2[3]).toBe(ctx);
  });
});
