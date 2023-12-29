import { getAssociationStats } from "../../src/associations/getAssociationStats";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import { ArcGISContext } from "../../src/ArcGISContext";
import * as SearchModule from "../../src/search/hubSearch";
import * as GetAssociatedEntitiesQueryModule from "../../src/associations/getAssociatedEntitiesQuery";
import * as GetPendingEntitiesQueryModule from "../../src/associations/getPendingEntitiesQuery";
import * as GetRequestingEntitiesQueryModule from "../../src/associations/getRequestingEntitiesQuery";

describe("getAssociationStats:", () => {
  let hubSearchSpy: jasmine.Spy;
  let getAssociatedEntitiesQuerySpy: jasmine.Spy;
  let getPendingEntitiesQuerySpy: jasmine.Spy;
  let getRequestingEntitiesQuerySpy: jasmine.Spy;

  beforeEach(() => {
    getAssociatedEntitiesQuerySpy = spyOn(
      GetAssociatedEntitiesQueryModule,
      "getAssociatedEntitiesQuery"
    ).and.returnValue(Promise.resolve({}));
    getPendingEntitiesQuerySpy = spyOn(
      GetPendingEntitiesQueryModule,
      "getPendingEntitiesQuery"
    ).and.returnValue(Promise.resolve({}));
    getRequestingEntitiesQuerySpy = spyOn(
      GetRequestingEntitiesQueryModule,
      "getRequestingEntitiesQuery"
    ).and.returnValue(Promise.resolve({}));
  });

  it("delegates to getAssociatedEntitiesQuery, getPendingEntitiesQuery, and getRequestingEntitiesQuery", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValue(
      Promise.resolve({ total: 0 })
    );

    await getAssociationStats(
      MOCK_PARENT_ENTITY,
      "project",
      {} as ArcGISContext
    );

    expect(hubSearchSpy).toHaveBeenCalledTimes(3);
    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getPendingEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getRequestingEntitiesQuerySpy).toHaveBeenCalledTimes(1);
  });
  it("returns stats for a parent entity", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValues(
      Promise.resolve({ total: 1 }),
      Promise.resolve({ total: 2 }),
      Promise.resolve({ total: 3 })
    );

    const stats = await getAssociationStats(
      MOCK_PARENT_ENTITY,
      "project",
      {} as ArcGISContext
    );

    expect(stats).toEqual({
      associated: 1,
      pending: 2,
      requesting: 3,
      included: 3,
    });
  });
  it("returns stats for a child entity", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValues(
      Promise.resolve({ total: 1 }),
      Promise.resolve({ total: 2 }),
      Promise.resolve({ total: 3 })
    );

    const stats = await getAssociationStats(
      MOCK_CHILD_ENTITY,
      "initiative",
      {} as ArcGISContext
    );

    expect(stats).toEqual({
      associated: 1,
      pending: 2,
      requesting: 3,
      referenced: 3,
    });
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await getAssociationStats(
        MOCK_PARENT_ENTITY,
        "group",
        {} as ArcGISContext
      );
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "getAssociationStats: Association between initiative and group is not supported."
        )
      );
    }
  });
  it("returns empty stats if hubSearch throws an error", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValue(
      Promise.reject({})
    );

    const stats = await getAssociationStats(
      MOCK_PARENT_ENTITY,
      "project",
      {} as ArcGISContext
    );

    expect(stats).toEqual({
      associated: 0,
      pending: 0,
      requesting: 0,
      included: 0,
    });
  });
});
