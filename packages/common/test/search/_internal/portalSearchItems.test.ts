import * as Portal from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  Filter,
  IFilterGroup,
  IHubSearchOptions,
  _searchContent,
} from "../../../src";
import * as AggResponse from "../../mocks/portal-search/response-with-aggregations.json";
import * as SimpleResponse from "../../mocks/portal-search/simple-response.json";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { portalSearchItems } from "../../../src/search/_internal/portalSearchItems";

fdescribe("portalSearchItems:", () => {
  it("simple search", async () => {
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleResponse));
    });
    const f: IFilterGroup<"item"> = {
      operation: "AND",
      filterType: "item",
      filters: [
        {
          filterType: "item",
          term: "water",
        },
      ],
    };
    const opts: IHubSearchOptions = {};

    await portalSearchItems([f], opts);

    expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
    const [expectedParams] = searchItemsSpy.calls.argsFor(0);
    // verify q
    expect(expectedParams.q).toEqual("water");
    // verify countFields
    expect(expectedParams.countFields).not.toBeDefined();
  });
  it("simple search with aggregations", async () => {
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleResponse));
    });
    const f: IFilterGroup<"item"> = {
      operation: "AND",
      filterType: "item",
      filters: [
        {
          filterType: "item",
          term: "water",
        },
      ],
    };
    const opts: IHubSearchOptions = {
      aggFields: ["tags"],
    };

    await portalSearchItems([f], opts);

    expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
    const [expectedParams] = searchItemsSpy.calls.argsFor(0);
    // verify q
    expect(expectedParams.q).toEqual("water");
    expect(expectedParams.countFields).toEqual("tags");
    expect(expectedParams.countSize).toEqual(10);
  });
  it("simple search enterprise", async () => {
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleResponse));
    });
    const f: IFilterGroup<"item"> = {
      operation: "AND",
      filterType: "item",
      filters: [
        {
          filterType: "item",
          term: "water",
        },
      ],
    };
    const opts: IHubSearchOptions = {
      api: {
        type: "arcgis",
        url: "https://my-portal.com/gis",
      },
      aggFields: ["tags"],
      aggLimit: 100,
    };

    await portalSearchItems([f], opts);

    expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
    const [expectedParams] = searchItemsSpy.calls.argsFor(0);
    // verify q
    expect(expectedParams.q).toEqual("water");
    expect(expectedParams.countFields).toEqual("tags");
    expect(expectedParams.countSize).toEqual(100);
    expect(expectedParams.portal).toEqual(
      "https://my-portal.com/gis/sharing/rest"
    );
  });
  it("simple search next", async () => {
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleResponse));
    });
    const f: Filter<"content"> = {
      filterType: "content",
      term: "water",
    };
    const opts: IHubSearchOptions = {};

    const res = await _searchContent(f, opts);
    await res.next();
    expect(searchItemsSpy.calls.count()).toBe(2, "should call searchItems");
    const [expectedParams] = searchItemsSpy.calls.argsFor(1);
    // verify q
    expect(expectedParams.q).toEqual("water");
  });
});
