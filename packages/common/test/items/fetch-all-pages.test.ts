import { fetchAllPages } from "../../src/items";
import * as portalModule from "@esri/arcgis-rest-portal";
import { ISearchOptions } from "@esri/arcgis-rest-portal";

describe("fetchAllPages", function() {
  it("fetches all the pages", async function() {
    const searchResults = [
      {
        total: 130,
        results: [1]
      },
      {
        results: new Array(100).fill(1)
      },
      {
        results: new Array(30).fill(2)
      }
    ];
    const searchSpy = spyOn(portalModule, "searchItems").and.returnValues(
      ...searchResults.map(res => Promise.resolve(res))
    );
    const results = await fetchAllPages(
      portalModule.searchItems,
      {} as ISearchOptions
    );

    expect(searchSpy).toHaveBeenCalledWith({ num: 1 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 100 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 101, num: 100 });

    expect(results).toEqual([
      ...new Array(100).fill(1),
      ...new Array(30).fill(2)
    ]);
  });

  it("can handle custom page amount", async function() {
    const searchResults = [
      {
        total: 50,
        results: [1]
      },
      {
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
      }
    ];
    const searchSpy = spyOn(portalModule, "searchItems").and.returnValues(
      ...searchResults.map(res => Promise.resolve(res))
    );
    const results = await fetchAllPages(
      portalModule.searchItems,
      {} as ISearchOptions,
      10
    );

    expect(searchSpy).toHaveBeenCalledWith({ num: 1 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 1, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 11, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 21, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 31, num: 10 });
    expect(searchSpy).toHaveBeenCalledWith({ start: 41, num: 10 });

    expect(results).toEqual([
      ...new Array(10).fill(1),
      ...new Array(10).fill(2),
      ...new Array(10).fill(3),
      ...new Array(10).fill(4),
      ...new Array(10).fill(5)
    ]);
  });
});
