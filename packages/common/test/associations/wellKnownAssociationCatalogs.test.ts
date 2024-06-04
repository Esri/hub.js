import {
  getWellKnownAssociationsCatalog,
  getAvailableToRequestAssociationCatalogs,
} from "../../src/associations/wellKnownAssociationCatalogs";
import * as getAssociatedEntitiesQueryModule from "../../src/associations/getAssociatedEntitiesQuery";
import * as getPendingEntitiesQueryModule from "../../src/associations/getPendingEntitiesQuery";
import * as getRequestingEntitiesQueryModule from "../../src/associations/getRequestingEntitiesQuery";
import * as getAvailableToRequestEntitiesQueryModule from "../../src/associations/getAvailableToRequestEntitiesQuery";
import * as wellKnownCatalogModule from "../../src/search/wellKnownCatalog";
import { ArcGISContext, HubEntity, IHubCollection } from "../../src";

describe("getWellKnownAssociationsCatalog", () => {
  let getAssociatedEntitiesQuerySpy: jasmine.Spy;
  let getPendingEntitiesQuerySpy: jasmine.Spy;
  let getRequestingEntitiesQuerySpy: jasmine.Spy;
  let getAvailableToRequestEntitiesQuerySpy: jasmine.Spy;
  let getWellknownCollectionSpy: jasmine.Spy;

  const mockFilters = [{ predicates: [{ owner: "mock-owner" }] }];
  beforeEach(() => {
    getAssociatedEntitiesQuerySpy = spyOn(
      getAssociatedEntitiesQueryModule,
      "getAssociatedEntitiesQuery"
    ).and.returnValue(Promise.resolve({ filters: mockFilters }));
    getPendingEntitiesQuerySpy = spyOn(
      getPendingEntitiesQueryModule,
      "getPendingEntitiesQuery"
    ).and.returnValue(Promise.resolve({ filters: mockFilters }));
    getRequestingEntitiesQuerySpy = spyOn(
      getRequestingEntitiesQueryModule,
      "getRequestingEntitiesQuery"
    ).and.returnValue(Promise.resolve({ filters: mockFilters }));
    getAvailableToRequestEntitiesQuerySpy = spyOn(
      getAvailableToRequestEntitiesQueryModule,
      "getAvailableToRequestEntitiesQuery"
    ).and.returnValue({ filters: mockFilters });
    getWellknownCollectionSpy = spyOn(
      wellKnownCatalogModule,
      "getWellknownCollection"
    ).and.returnValue({ key: "mock-collection" });
  });
  afterEach(() => {
    getAssociatedEntitiesQuerySpy.calls.reset();
    getPendingEntitiesQuerySpy.calls.reset();
    getRequestingEntitiesQuerySpy.calls.reset();
    getAvailableToRequestEntitiesQuerySpy.calls.reset();
    getWellknownCollectionSpy.calls.reset();
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
    getAssociatedEntitiesQuerySpy.and.returnValue(Promise.resolve(null));

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
    try {
      await getWellKnownAssociationsCatalog(
        "some-scope",
        "associated" as any,
        { type: "Hub Initiative" } as HubEntity,
        "group",
        {} as ArcGISContext
      );
    } catch (err) {
      expect(err.message).toBe(
        "getWellKnownAssociationsCatalog: Association between initiative and group is not supported."
      );
    }
  });
});

describe("getAvailableToRequestAssociationCatalogs", () => {
  let getAvailableToRequestEntitiesQuerySpy: jasmine.Spy;
  let getWellknownCatalogSpy: jasmine.Spy;

  const mockFilters = [{ predicates: [{ id: ["00b", "00c"] }] }];
  beforeEach(() => {
    getAvailableToRequestEntitiesQuerySpy = spyOn(
      getAvailableToRequestEntitiesQueryModule,
      "getAvailableToRequestEntitiesQuery"
    ).and.returnValue({ filters: mockFilters });
    getWellknownCatalogSpy = spyOn(
      wellKnownCatalogModule,
      "getWellKnownCatalog"
    ).and.returnValues(
      { schemaVersion: 1, title: "mock-myContent" },
      { schemaVersion: 1, title: "mock-favorites" },
      { schemaVersion: 1, title: "mock-organization" },
      { schemaVersion: 1, title: "mock-world" }
    );
  });
  afterEach(() => {
    getAvailableToRequestEntitiesQuerySpy.calls.reset();
    getWellknownCatalogSpy.calls.reset();
  });

  it("throws an error if the association is not supported", async () => {
    try {
      await getAvailableToRequestAssociationCatalogs(
        "some-scope",
        { type: "Hub Initiative" } as HubEntity,
        "group",
        {} as ArcGISContext
      );
    } catch (err) {
      expect(err.message).toBe(
        "getAvailableToRequestAssociationCatalogs: Association between initiative and group is not supported."
      );
    }
  });
  it("does not provide additional filters if the availableToRequestEntitiesQuery comes back empty", async () => {
    // overwrite the spy to return null
    getAvailableToRequestEntitiesQuerySpy.and.returnValue(null);

    await getAvailableToRequestAssociationCatalogs(
      "some-scope",
      { type: "Hub Project" } as HubEntity,
      "initiative",
      {} as ArcGISContext
    );

    const args = getWellknownCatalogSpy.calls.argsFor(1);
    expect(args[3].filters).toBeUndefined();
  });
  it('returns an array of valid "availableToRequest" catalogs', async () => {
    const catalogs = await getAvailableToRequestAssociationCatalogs(
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

  it('returns an array of valid "availableToRequest" catalogs when given an array of catalogs', async () => {
    getWellknownCatalogSpy.and.returnValues(
      { schemaVersion: 1, title: "mock-myContent" },
      { schemaVersion: 1, title: "mock-organization" },
      { schemaVersion: 1, title: "mock-community" },
      { schemaVersion: 1, title: "mock-partners" }
    );

    const catalogs = await getAvailableToRequestAssociationCatalogs(
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
