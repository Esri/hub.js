import { deepCatalogContains, IArcGISContext, IHubCatalog } from "../../src";
import * as DeepContainsModule from "../../src/core/_internal/deepContains";

describe("deepCatalogContains:", () => {
  it("fails containment if the path is invalid", async () => {
    const ctx = {} as IArcGISContext;
    const path = "sites/00a/initiatives/00b/projects";
    const result = await deepCatalogContains("00c", "content", path, ctx);
    expect(result.isContained).toBeFalsy();
    expect(result.reason).toBe(
      "Path does not contain an even number of parts."
    );
  });
  it("handles random error from pathToCatalog", async () => {
    spyOn(DeepContainsModule, "pathToCatalogInfo").and.callFake(() => {
      throw new Error();
    });
    const ctx = {} as IArcGISContext;
    const path = "sites/00a/initiatives/00b/projects";
    const result = await deepCatalogContains("00c", "content", path, ctx);
    expect(result.isContained).toBeFalsy();
    expect(result.reason).toBe("An error occurred while parsing path.");
  });
  it("delegates to deepContains", async () => {
    const spy = spyOn(DeepContainsModule, "deepContains").and.callFake(() => {
      return Promise.resolve({ isContained: true });
    });

    const ctx = {} as IArcGISContext;

    const path = "sites/00a/initiatives/00b/projects/00c";

    const result = await deepCatalogContains("ff3", "content", path, ctx);

    expect(result.isContained).toBeTruthy();

    expect(spy).toHaveBeenCalledTimes(1);

    // validate the args passed to deepContains
    const args = spy.calls.mostRecent().args;
    expect(args[0]).toBe("ff3");
    expect(args[1]).toBe("item");
    expect(args[2]).toEqual([
      { id: "00c", entityType: "item" },
      { id: "00b", entityType: "item" },
      { id: "00a", entityType: "item" },
    ]);
    expect(args[3]).toBe(ctx);
  });

  it("includes root Catalog is passed in", async () => {
    const spy = spyOn(DeepContainsModule, "deepContains").and.callFake(() => {
      return Promise.resolve({ isContained: true });
    });

    const ctx = {} as IArcGISContext;

    const rootCatalog: IHubCatalog = {
      schemaVersion: 1,
      scopes: {},
      collections: [],
    };

    const path = "initiatives/00b/projects/00c";

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
    const args = spy.calls.mostRecent().args;
    expect(args[0]).toBe("ff3");
    expect(args[1]).toBe("item");
    expect(args[2]).toEqual([
      { id: "00c", entityType: "item" },
      { id: "00b", entityType: "item" },
      { id: "root", entityType: "item", catalog: rootCatalog },
    ]);
    expect(args[3]).toBe(ctx);
  });
});
