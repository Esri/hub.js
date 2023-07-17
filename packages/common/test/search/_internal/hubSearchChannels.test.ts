import * as hubSearchChannels from "../../../src/search/_internal/hubSearchChannels";
import * as API from "../../../src/discussions/api/channels";
import { IQuery, IHubSearchOptions, IHubRequestOptions } from "../../../src";
import SEARCH_CHANNELS_RESPONSE from "./mocks/searchChannelsResponse";

describe("discussionsSearchItems Module |", () => {
  let processSearchParamsSpy: jasmine.Spy;
  let toHubSearchResultSpy: jasmine.Spy;
  let searchChannelsSpy: jasmine.Spy;

  beforeEach(() => {
    processSearchParamsSpy = spyOn(
      hubSearchChannels,
      "processSearchParams"
    ).and.callThrough();
    toHubSearchResultSpy = spyOn(
      hubSearchChannels,
      "toHubSearchResult"
    ).and.callThrough();
    searchChannelsSpy = spyOn(API, "searchChannels").and.callFake(() => {
      return Promise.resolve(SEARCH_CHANNELS_RESPONSE);
    });
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
    expect(toHubSearchResultSpy).toHaveBeenCalledTimes(1);
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
});
