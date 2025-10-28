import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { getUniqueGroupTitle } from "../../../src/groups/_internal/getUniqueGroupTitle";
import * as SearchModule from "../../../src/search/hubSearch";
import { vi, afterEach, describe, it, expect } from "vitest";

describe("getUniqueGroupTitle", () => {
  let hubSearchSpy: any;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an unmodified title when a group with the provided title does NOT exist", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockResolvedValue({
        results: [],
        total: 0,
        hasNext: false,
        next: undefined,
      } as any);

    const res = await getUniqueGroupTitle(
      "Mock Title",
      {} as IUserRequestOptions
    );

    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    expect(res).toBe("Mock Title");
  });

  it("returns a unique title when a group with the provided title already exists", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockResolvedValueOnce({
        results: [{ id: "00c" }],
        total: 1,
        hasNext: false,
        next: undefined,
      } as any)
      .mockResolvedValueOnce({
        results: [],
        total: 0,
        hasNext: false,
        next: undefined,
      } as any);

    const res = await getUniqueGroupTitle(
      "Mock Title",
      {} as IUserRequestOptions
    );

    expect(hubSearchSpy).toHaveBeenCalledTimes(2);
    expect(res).toBe("Mock Title 1");
  });

  it("handles errors", async () => {
    hubSearchSpy = vi
      .spyOn(SearchModule, "hubSearch")
      .mockRejectedValue(new Error("error"));

    await expect(
      getUniqueGroupTitle("Mock Title", {} as IUserRequestOptions)
    ).rejects.toThrow("Error in getUniqueGroupTitle: ");
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
  });
});
