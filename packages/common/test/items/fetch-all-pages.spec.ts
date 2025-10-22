vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  return {
    ...(await importOriginal()),
    // make searchItems spyable
    searchItems: vi.fn(),
  };
});

import * as portalModule from "@esri/arcgis-rest-portal";
import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { fetchAllPages } from "../../src/items/fetch-all-pages";

afterEach(() => vi.restoreAllMocks());

describe("fetchAllPages", () => {
  it("fetches all the pages", async () => {
    const searchResults = [
      {
        total: 230,
        nextStart: 101,
        results: new Array(100).fill(1),
      },
      {
        results: new Array(100).fill(2),
      },
      {
        results: new Array(30).fill(3),
      },
    ];

    const searchSpy = vi
      .spyOn(portalModule as any, "searchItems")
      .mockReturnValueOnce(Promise.resolve(searchResults[0]))
      .mockReturnValueOnce(Promise.resolve(searchResults[1]))
      .mockReturnValueOnce(Promise.resolve(searchResults[2]));

    const results = await fetchAllPages(
      (portalModule as any).searchItems,
      {} as ISearchOptions
    );

    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 100 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 101, num: 100 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 201, num: 100 });

    expect(results).toEqual([
      ...new Array(100).fill(1),
      ...new Array(100).fill(2),
      ...new Array(30).fill(3),
    ]);
  });

  it("works when total is less than page size", async () => {
    const searchResults = [
      {
        total: 30,
        nextStart: -1,
        results: new Array(30).fill(1),
      },
    ];

    const searchSpy = vi
      .spyOn(portalModule as any, "searchItems")
      .mockReturnValueOnce(Promise.resolve(searchResults[0]));

    const results = await fetchAllPages((portalModule as any).searchItems, {
      num: 100,
    } as ISearchOptions);

    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 100 });

    expect(results).toEqual(new Array(30).fill(1));
  });

  it("works with custom start and num", async () => {
    const searchResults = [
      {
        total: 50,
        nextStart: 31,
        results: new Array(10).fill(1),
      },
      {
        results: new Array(10).fill(2),
      },
      {
        results: new Array(10).fill(3),
      },
    ];

    const searchSpy = vi
      .spyOn(portalModule as any, "searchItems")
      .mockReturnValueOnce(Promise.resolve(searchResults[0]))
      .mockReturnValueOnce(Promise.resolve(searchResults[1]))
      .mockReturnValueOnce(Promise.resolve(searchResults[2]));

    const results = await fetchAllPages((portalModule as any).searchItems, {
      num: 10,
      start: 21,
    } as ISearchOptions);

    expect(searchSpy).toHaveBeenCalledWith({ start: 21, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 31, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 41, num: 10 });

    expect(results).toEqual([
      ...new Array(10).fill(1),
      ...new Array(10).fill(2),
      ...new Array(10).fill(3),
    ]);
  });

  it("works with a limit", async () => {
    const searchResults = [
      {
        total: 10000,
        nextStart: 11,
        results: new Array(10).fill(1),
      },
      {
        results: new Array(10).fill(2),
      },
      {
        results: new Array(10).fill(3),
      },
      {
        results: new Array(10).fill(4),
      },
      {
        results: new Array(10).fill(5),
      },
      {
        results: new Array(10).fill(6),
      },
      {
        results: new Array(10).fill(7),
      },
    ];

    const searchSpy = vi
      .spyOn(portalModule as any, "searchItems")
      .mockReturnValueOnce(Promise.resolve(searchResults[0]))
      .mockReturnValueOnce(Promise.resolve(searchResults[1]))
      .mockReturnValueOnce(Promise.resolve(searchResults[2]))
      .mockReturnValueOnce(Promise.resolve(searchResults[3]))
      .mockReturnValueOnce(Promise.resolve(searchResults[4]))
      .mockReturnValueOnce(Promise.resolve(searchResults[5]))
      .mockReturnValueOnce(Promise.resolve(searchResults[6]));

    const limit = 44;
    const results = await fetchAllPages(
      (portalModule as any).searchItems,
      {
        num: 10,
      } as ISearchOptions,
      limit
    );

    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 11, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 21, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 31, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 41, num: 10 });
    // didn't go beyond last applicable page
    expect(searchSpy).not.toHaveBeenCalledWith({ start: 51, num: 10 });

    expect(results).toEqual([
      ...new Array(10).fill(1),
      ...new Array(10).fill(2),
      ...new Array(10).fill(3),
      ...new Array(10).fill(4),
      ...new Array(4).fill(5),
    ]);
  });
});
