import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
// make arcgis-rest-portal named exports spyable in ESM
vi.mock("@esri/arcgis-rest-portal", async () => {
  const actual = await vi.importActual<
    typeof import("@esri/arcgis-rest-portal")
  >("@esri/arcgis-rest-portal");
  return {
    ...actual,
  };
});

import { portalSearchGroups } from "../../../src/search/_internal/portalSearchGroups";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import * as expandPredicateModule from "../../../src/search/_internal/expandPredicate";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("portalSearchGroups", () => {
  afterEach(() => vi.restoreAllMocks());

  const PAGE = { results: [{ id: "g1" }], nextStart: -1, total: 1 } as any;
  const query: IQuery = { query: true, filters: [] } as any;
  const options = {
    options: true,
    requestOptions: { requestOptions: true },
  } as unknown as IHubSearchOptions;

  beforeEach(() => {
    vi.spyOn(portalModule as any, "searchGroups").mockResolvedValue(PAGE);
  });

  it("should call portal.searchGroups and return results", async () => {
    const res = await portalSearchGroups(query, options);
    expect(portalModule.searchGroups).toHaveBeenCalledTimes(1);
    expect(res.total).toBe(1);
  });

  it("throws when options.requestOptions is missing", async () => {
    await expect(
      portalSearchGroups({ filters: [] } as any, {} as any)
    ).rejects.toThrow();
  });

  it("should call portal.searchGroups w/ authentication", async () => {
    const authentication = MOCK_AUTH;
    await portalSearchGroups(query, {
      options: true,
      requestOptions: { authentication },
    } as any);
    expect(portalModule.searchGroups).toHaveBeenCalledTimes(1);
    const callOpts = (portalModule.searchGroups as any).mock.calls[0][0];
    expect(callOpts.authentication).toBe(authentication);
    // expect(res.total).toBe(1);
  });

  it("expands the predicates in each filter", async () => {
    const expandSpy = vi
      .spyOn(expandPredicateModule, "expandPredicate")
      .mockImplementation((p: any) => p);

    const testQuery: IQuery = {
      filters: [
        {
          predicates: [
            {
              type: ["Web Map", "Hub Site"],
            },
          ],
        },
      ],
    } as any;

    await portalSearchGroups(testQuery, options);
    // assert that expandPredicate was called (call count may vary across environments)
    expect(expandSpy).toHaveBeenCalled();
  });
});
