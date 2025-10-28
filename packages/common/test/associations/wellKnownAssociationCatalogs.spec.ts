import {
  getWellKnownAssociationsCatalog,
  getAvailableToRequestAssociationCatalogs,
} from "../../src/associations/wellKnownAssociationCatalogs";
import * as getAssociatedEntitiesQueryModule from "../../src/associations/getAssociatedEntitiesQuery";
import * as getPendingEntitiesQueryModule from "../../src/associations/getPendingEntitiesQuery";
import * as getRequestingEntitiesQueryModule from "../../src/associations/getRequestingEntitiesQuery";
import * as getAvailableToRequestEntitiesQueryModule from "../../src/associations/getAvailableToRequestEntitiesQuery";
import * as wellKnownCatalogModule from "../../src/search/wellKnownCatalog";
import { HubEntity } from "../../src/core/types/HubEntity";
import { ArcGISContext } from "../../src/ArcGISContext";
import { IHubCollection } from "../../src/search/types/IHubCatalog";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("getWellKnownAssociationsCatalog", () => {
  let getAssociatedEntitiesQuerySpy: any;
  let getPendingEntitiesQuerySpy: any;
  let getRequestingEntitiesQuerySpy: any;
  let getAvailableToRequestEntitiesQuerySpy: any;
  let getWellknownCollectionSpy: any;

  const mockFilters = [{ predicates: [{ owner: "mock-owner" }] }];
  beforeEach(() => {
    getAssociatedEntitiesQuerySpy = vi
      .spyOn(getAssociatedEntitiesQueryModule, "getAssociatedEntitiesQuery")
      .mockResolvedValue({ filters: mockFilters } as any);
    getPendingEntitiesQuerySpy = vi
      .spyOn(getPendingEntitiesQueryModule, "getPendingEntitiesQuery")
      .mockResolvedValue({ filters: mockFilters } as any);
    getRequestingEntitiesQuerySpy = vi
      .spyOn(getRequestingEntitiesQueryModule, "getRequestingEntitiesQuery")
      .mockResolvedValue({ filters: mockFilters } as any);
    getAvailableToRequestEntitiesQuerySpy = vi
      .spyOn(
        getAvailableToRequestEntitiesQueryModule,
        "getAvailableToRequestEntitiesQuery"
      )
      .mockReturnValue({ filters: mockFilters } as any);
    getWellknownCollectionSpy = vi
      .spyOn(wellKnownCatalogModule, "getWellknownCollection")
      .mockReturnValue({ key: "mock-collection" } as any);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds a valid well-known catalog", async () => {
    const catalog = await getWellKnownAssociationsCatalog(
      "some-scope",
      "associated",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(getWellknownCollectionSpy).toHaveBeenCalledTimes(1);
    expect(catalog).toEqual({
      schemaVersion: 1,
      title: "{{some-scope.catalog.associated:translate}}",
      scopes: {
        item: {
          targetEntity: "item",
          filters: mockFilters,
        },
      },
      collections: [{ key: "mock-collection" } as IHubCollection],
    });
  });
  it("handles empty state filters", async () => {
    // replace spy with a new mocked implementation that returns null
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    getAssociatedEntitiesQuerySpy.mockImplementation(() =>
      Promise.resolve(null as any)
    );

    const catalog = await getWellKnownAssociationsCatalog(
      "some-scope",
      "associated",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(catalog.scopes).toEqual({
      item: {
        targetEntity: "item",
        filters: [{ predicates: [{ type: ["Code Attachment"] }] }],
      },
    });
  });
  it('delegates to getAssociatedEntitiesQuery for the well-known "associated" catalog', async () => {
    await getWellKnownAssociationsCatalog(
      "some-scope",
      "associated",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledTimes(1);
  });
  it('delegates to getPendingEntitiesQuery for the well-known "pending" catalog', async () => {
    await getWellKnownAssociationsCatalog(
      "some-scope",
      "pending",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(getPendingEntitiesQuerySpy).toHaveBeenCalledTimes(1);
  });
  it('delegates to getRequestingEntitiesQuery for the well-known "requesting" catalog', async () => {
    await getWellKnownAssociationsCatalog(
      "some-scope",
      "requesting",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(getRequestingEntitiesQuerySpy).toHaveBeenCalledTimes(1);
  });
  it('delegates to getAvailableToRequestEntitiesQuery for the well-known "availableToRequest" catalog', async () => {
    await getWellKnownAssociationsCatalog(
      "some-scope",
      "availableToRequest",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(getAvailableToRequestEntitiesQuerySpy).toHaveBeenCalledTimes(1);
  });
  it("throws an error if the association is not supported", async () => {
    await expect(
      getWellKnownAssociationsCatalog(
        "some-scope",
        "associated" as any,
        { type: "Hub Initiative" } as HubEntity,
        "group",
        {} as ArcGISContext
      )
    ).rejects.toThrow(
      "getWellKnownAssociationsCatalog: Association between initiative and group is not supported."
    );
  });
});

describe("getAvailableToRequestAssociationCatalogs", () => {
  let getAvailableToRequestEntitiesQuerySpy: any;
  let getWellknownCatalogSpy: any;

  const mockFilters = [{ predicates: [{ id: ["00b", "00c"] }] }];
  beforeEach(() => {
    getAvailableToRequestEntitiesQuerySpy = vi
      .spyOn(
        getAvailableToRequestEntitiesQueryModule,
        "getAvailableToRequestEntitiesQuery"
      )
      .mockReturnValue({ filters: mockFilters } as any);
    getWellknownCatalogSpy = vi.spyOn(
      wellKnownCatalogModule,
      "getWellKnownCatalog"
    );
    // set initial return values
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    getWellknownCatalogSpy
      .mockReturnValueOnce({ schemaVersion: 1, title: "mock-myContent" } as any)
      .mockReturnValueOnce({ schemaVersion: 1, title: "mock-favorites" } as any)
      .mockReturnValueOnce({
        schemaVersion: 1,
        title: "mock-organization",
      } as any)
      .mockReturnValueOnce({ schemaVersion: 1, title: "mock-world" } as any);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws an error if the association is not supported", () => {
    expect(() =>
      getAvailableToRequestAssociationCatalogs(
        "some-scope",
        { type: "Hub Initiative" } as HubEntity,
        "group",
        {} as ArcGISContext
      )
    ).toThrow(
      "getAvailableToRequestAssociationCatalogs: Association between initiative and group is not supported."
    );
  });
  it("does not provide additional filters if the availableToRequestEntitiesQuery comes back empty", () => {
    // overwrite the spy to return null
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    getAvailableToRequestEntitiesQuerySpy.mockImplementation(() => null as any);

    getAvailableToRequestAssociationCatalogs(
      "some-scope",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    const args = getWellknownCatalogSpy.mock.calls[1];
    expect(args[3].filters).toBeUndefined();
  });
  it('returns an array of valid "availableToRequest" catalogs', () => {
    const catalogs = getAvailableToRequestAssociationCatalogs(
      "some-scope",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    expect(getAvailableToRequestEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getWellknownCatalogSpy).toHaveBeenCalledTimes(4);
    expect(catalogs.length).toBe(4);
    expect(catalogs).toEqual([
      { schemaVersion: 1, title: "mock-myContent" },
      { schemaVersion: 1, title: "mock-favorites" },
      { schemaVersion: 1, title: "mock-organization" },
      { schemaVersion: 1, title: "mock-world" },
    ]);
  });

  it('returns an array of valid "availableToRequest" catalogs when given an array of catalogs', () => {
    // reset and set new return sequence
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    getWellknownCatalogSpy.mockRestore();
    getWellknownCatalogSpy = vi
      .spyOn(wellKnownCatalogModule, "getWellKnownCatalog")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .mockReturnValueOnce({ schemaVersion: 1, title: "mock-myContent" } as any)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .mockReturnValueOnce({
        schemaVersion: 1,
        title: "mock-organization",
      } as any)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .mockReturnValueOnce({ schemaVersion: 1, title: "mock-community" } as any)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .mockReturnValueOnce({ schemaVersion: 1, title: "mock-partners" } as any);

    const catalogs = getAvailableToRequestAssociationCatalogs(
      "some-scope",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {
        trustedOrgIds: ["abc123", "def456", "ghi789"],
        communityOrgId: "mock-community-org",
      } as ArcGISContext,
      ["myContent", "organization", "community", "partners"]
    );

    expect(getAvailableToRequestEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getWellknownCatalogSpy).toHaveBeenCalledTimes(4);
    expect(catalogs.length).toBe(4);
    expect(catalogs).toEqual([
      { schemaVersion: 1, title: "mock-myContent" },
      { schemaVersion: 1, title: "mock-organization" },
      { schemaVersion: 1, title: "mock-community" },
      { schemaVersion: 1, title: "mock-partners" },
    ]);
  });
});
