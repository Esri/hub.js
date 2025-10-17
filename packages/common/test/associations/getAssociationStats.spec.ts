import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAssociationStats } from "../../src/associations/getAssociationStats";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import { ArcGISContext } from "../../src/ArcGISContext";
import * as SearchModule from "../../src/search/hubSearch";
import * as GetAssociatedEntitiesQueryModule from "../../src/associations/getAssociatedEntitiesQuery";
import * as GetPendingEntitiesQueryModule from "../../src/associations/getPendingEntitiesQuery";
import * as GetRequestingEntitiesQueryModule from "../../src/associations/getRequestingEntitiesQuery";

describe("getAssociationStats:", () => {
  let hubSearchSpy: any;
  let getAssociatedEntitiesQuerySpy: any;
  let getPendingEntitiesQuerySpy: any;
  let getRequestingEntitiesQuerySpy: any;

  beforeEach(() => {
    getAssociatedEntitiesQuerySpy = vi
      .spyOn(GetAssociatedEntitiesQueryModule, "getAssociatedEntitiesQuery")
      .mockResolvedValue({} as any);
    getPendingEntitiesQuerySpy = vi
      .spyOn(GetPendingEntitiesQueryModule, "getPendingEntitiesQuery")
      .mockResolvedValue({} as any);
    getRequestingEntitiesQuerySpy = vi
      .spyOn(GetRequestingEntitiesQueryModule, "getRequestingEntitiesQuery")
      .mockResolvedValue({} as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delegates to getAssociatedEntitiesQuery, getPendingEntitiesQuery, and getRequestingEntitiesQuery", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockResolvedValue({ total: 0 } as any);

    await getAssociationStats(
      MOCK_PARENT_ENTITY,
      "project",
      {} as ArcGISContext
    );

    expect(hubSearchSpy).toHaveBeenCalledTimes(3);
    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getPendingEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getRequestingEntitiesQuerySpy).toHaveBeenCalledTimes(1);

    // mocks restored in afterEach
  });

  it("returns stats for a parent entity", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockResolvedValueOnce({ total: 1 } as any)
      .mockResolvedValueOnce({ total: 2 } as any)
      .mockResolvedValueOnce({ total: 3 } as any);

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

    // mocks restored in afterEach
  });

  it("returns stats for a child entity", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockResolvedValueOnce({ total: 1 } as any)
      .mockResolvedValueOnce({ total: 2 } as any)
      .mockResolvedValueOnce({ total: 3 } as any);

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

    // mocks restored in afterEach
  });

  it("throws an error if the association is not supported", async () => {
    await expect(
      getAssociationStats(MOCK_PARENT_ENTITY, "group", {} as ArcGISContext)
    ).rejects.toEqual(
      new Error(
        "getAssociationStats: Association between initiative and group is not supported."
      )
    );
  });

  it("returns empty stats if hubSearch throws an error", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockRejectedValue({} as any);

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

    // mocks restored in afterEach
  });

  it("returns empty stats if any error is thrown", async () => {
    vi.spyOn(
      GetAssociatedEntitiesQueryModule,
      "getAssociatedEntitiesQuery"
    ).mockRejectedValueOnce({});

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
