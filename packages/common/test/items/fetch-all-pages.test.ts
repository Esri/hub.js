import { fetchAllPages } from "../../src/items";
import * as portalModule from "@esri/arcgis-rest-portal";
import { ISearchOptions } from "@esri/arcgis-rest-portal";

describe("fetchAllPages", function() {
  it("fetches all the pages", async function() {
    const searchResults = [
      {
        total: 230,
        nextStart: 101,
        results: new Array(100).fill(1)
      },
      {
        results: new Array(100).fill(2)
      },
      {
        results: new Array(30).fill(3)
      }
    ];
    const searchSpy = spyOn(portalModule, "searchItems").and.returnValues(
      ...searchResults.map(res => Promise.resolve(res))
    );
    const results = await fetchAllPages(
      portalModule.searchItems,
      {} as ISearchOptions
    );

    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 100 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 101, num: 100 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 201, num: 100 });

    expect(results).toEqual([
      ...new Array(100).fill(1),
      ...new Array(100).fill(2),
      ...new Array(30).fill(3)
    ]);
  });

  it("works when total is less than page size", async function() {
    const searchResults = [
      {
        total: 30,
        nextStart: -1,
        results: new Array(30).fill(1)
      }
    ];
    const searchSpy = spyOn(portalModule, "searchItems").and.returnValues(
      ...searchResults.map(res => Promise.resolve(res))
    );
    const results = await fetchAllPages(portalModule.searchItems, {
      num: 100
    } as ISearchOptions);

    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 100 });

    expect(results).toEqual(new Array(30).fill(1));
  });

  it("works with custom start and num", async function() {
    const searchResults = [
      {
        total: 50,
        nextStart: 31,
        results: new Array(10).fill(1)
      },
      {
        results: new Array(10).fill(2)
      },
      {
        results: new Array(10).fill(3)
      }
    ];
    const searchSpy = spyOn(portalModule, "searchItems").and.returnValues(
      ...searchResults.map(res => Promise.resolve(res))
    );
    const results = await fetchAllPages(portalModule.searchItems, {
      num: 10,
      start: 21
    } as ISearchOptions);

    expect(searchSpy).toHaveBeenCalledWith({ start: 21, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 31, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 41, num: 10 });

    expect(results).toEqual([
      ...new Array(10).fill(1),
      ...new Array(10).fill(2),
      ...new Array(10).fill(3)
    ]);
  });

  it("works with a limit", async function() {
    const searchResults = [
      {
        total: 10000,
        nextStart: 11,
        results: new Array(10).fill(1)
      },
      {
        results: new Array(10).fill(2)
      },
      {
        results: new Array(10).fill(3)
      },
      {
        results: new Array(10).fill(4)
      },
      {
        results: new Array(10).fill(5)
      },
      {
        results: new Array(10).fill(6)
      },
      {
        results: new Array(10).fill(7)
      }
    ];
    const searchSpy = spyOn(portalModule, "searchItems").and.returnValues(
      ...searchResults.map(res => Promise.resolve(res))
    );
    const limit = 44;
    const results = await fetchAllPages(
      portalModule.searchItems,
      { num: 10 } as ISearchOptions,
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
      ...new Array(4).fill(5)
    ]);
  });
});
