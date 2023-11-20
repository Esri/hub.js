import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getUniqueGroupTitle } from "../../../src/groups/_internal/getUniqueGroupTitle";
import * as SearchModule from "../../../src/search/hubSearch";

describe("getUniqueGroupTitle", () => {
  let hubSearchSpy: jasmine.Spy;

  it("returns an unmodified title when a group with the provided title does NOT exist", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValue(
      Promise.resolve({ results: [] })
    );

    const res = await getUniqueGroupTitle(
      "Mock Title",
      {} as IUserRequestOptions
    );

    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    expect(res).toBe("Mock Title");
  });

  it("returns a unique title when a group with the provided title already exists", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValues(
      Promise.resolve({ results: [{ id: "00c" }] }),
      Promise.resolve({ results: [] })
    );

    const res = await getUniqueGroupTitle(
      "Mock Title",
      {} as IUserRequestOptions
    );

    expect(hubSearchSpy).toHaveBeenCalledTimes(2);
    expect(res).toBe("Mock Title 1");
  });

  it("handles errors", async () => {
    hubSearchSpy = spyOn(SearchModule, "hubSearch").and.returnValue(
      Promise.reject(new Error("error"))
    );

    try {
      await getUniqueGroupTitle("Mock Title", {} as IUserRequestOptions);
    } catch (error) {
      expect(hubSearchSpy).toHaveBeenCalledTimes(1);
      expect((error as any).message).toContain(
        "Error in getUniqueGroupTitle: "
      );
    }
  });
});
