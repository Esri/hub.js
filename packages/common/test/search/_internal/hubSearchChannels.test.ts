import * as hubSearchChannels from "../../../src/search/_internal/hubSearchChannels";
import * as API from "../../../src/discussions/api/channels";
import {
  IQuery,
  IHubSearchOptions,
  IHubRequestOptions,
  ISearchChannels,
} from "../../../src";
import SEARCH_CHANNELS_RESPONSE from "./mocks/searchChannelsResponse";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";

describe("discussionsSearchItems Module |", () => {
  let processSearchParamsSpy: jasmine.Spy;
  let toHubSearchResultsSpy: jasmine.Spy;
  let searchChannelsSpy: jasmine.Spy;
  let getGroupSpy: jasmine.Spy;

  beforeEach(() => {
    processSearchParamsSpy = spyOn(
      hubSearchChannels,
      "processSearchParams"
    ).and.callThrough();
    toHubSearchResultsSpy = spyOn(
      hubSearchChannels,
      "toHubSearchResults"
    ).and.callThrough();
    searchChannelsSpy = spyOn(API, "searchChannels").and.callFake(() => {
      return Promise.resolve(SEARCH_CHANNELS_RESPONSE);
    });
    getGroupSpy = spyOn(arcgisRestPortal, "getGroup").and.callFake(() => {
      return Promise.resolve({ title: "My Group Title" });
    });
    spyOn(console, "warn");
  });

  it("calls searchChannels", async () => {
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          predicates: [
            {
              access: "private",
              groups: ["cb0ddfc90f4f45b899c076c88d3fdc84"],
              foo: "bar",
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "desc",
      requestOptions: {
        isPortal: false,
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as IHubRequestOptions,
    };
    const result = await hubSearchChannels.hubSearchChannels(qry, opts);
    expect(processSearchParamsSpy).toHaveBeenCalledTimes(1);
    expect(toHubSearchResultsSpy).toHaveBeenCalledTimes(1);
    expect(searchChannelsSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
    const nextResult = await result.next();
    expect(nextResult).toBeTruthy();
  });
  it("throws error if requestOptions not provided", async () => {
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          predicates: [
            {
              access: "private",
              groups: ["cb0ddfc90f4f45b899c076c88d3fdc84"],
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "desc",
    };
    try {
      await hubSearchChannels.hubSearchChannels(qry, opts);
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("handles undefined values", async () => {
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          predicates: [
            {
              access: "private",
              groups: ["cb0ddfc90f4f45b899c076c88d3fdc84"],
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: undefined,
      sortOrder: undefined,
      requestOptions: {
        isPortal: false,
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as IHubRequestOptions,
    };
    const result = await hubSearchChannels.hubSearchChannels(qry, opts);
    expect(processSearchParamsSpy).toHaveBeenCalledTimes(1);
    expect(toHubSearchResultsSpy).toHaveBeenCalledTimes(1);
    expect(searchChannelsSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });
  it("processes an IQuery object", () => {
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          operation: "OR",
          predicates: [
            {
              access: "private",
            },
            {
              access: "org",
            },
          ],
        },
        {
          predicates: [
            {
              term: "Foo",
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "desc",
      requestOptions: {
        isPortal: false,
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as IHubRequestOptions,
    };
    const result = hubSearchChannels.processSearchParams(opts, qry);
    expect(result.data).toEqual({
      num: 10,
      sortOrder: "DESC",
      access: ["private", "org"],
      name: ["Foo"],
    } as any as ISearchChannels);
  });
  it("excludes group enrichment when include groups not requested", async () => {
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          predicates: [
            {
              access: "private",
              groups: ["cb0ddfc90f4f45b899c076c88d3fdc84"],
              foo: "bar",
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "desc",
      requestOptions: {
        isPortal: false,
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as IHubRequestOptions,
    };
    const result = await hubSearchChannels.hubSearchChannels(qry, opts);
    expect(getGroupSpy).not.toHaveBeenCalled();
    expect(result.results[0].includes).toEqual({ groups: [] });
  });
  it("includes group enrichment when include groups requested", async () => {
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          predicates: [
            {
              access: "private",
              groups: ["cb0ddfc90f4f45b899c076c88d3fdc84"],
              foo: "bar",
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "desc",
      requestOptions: {
        isPortal: false,
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as IHubRequestOptions,
      include: ["groups"],
    };
    const result = await hubSearchChannels.hubSearchChannels(qry, opts);
    expect(getGroupSpy).toHaveBeenCalled();
    expect(result.results[0].includes).toEqual({
      groups: [{ title: "My Group Title" }],
    });
  });
  it("handles error when group is inaccessible", async () => {
    getGroupSpy.and.throwError("groups is inaccessible");
    const qry: IQuery = {
      targetEntity: "channel",
      filters: [
        {
          predicates: [
            {
              access: "private",
              groups: ["cb0ddfc90f4f45b899c076c88d3fdc84"],
              foo: "bar",
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "desc",
      requestOptions: {
        isPortal: false,
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as IHubRequestOptions,
      include: ["groups"],
    };
    const result = await hubSearchChannels.hubSearchChannels(qry, opts);
    expect(getGroupSpy).toHaveBeenCalled();
    /* tslint:disable-next-line: no-console */
    expect(console.warn).toHaveBeenCalled();
    expect(result.results[0].includes).toEqual({ groups: [null] });
  });
});
