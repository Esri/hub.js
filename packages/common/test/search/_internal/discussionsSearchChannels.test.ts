import { discussionsSearchChannels } from "../../../src/search/_internal";
import * as helpers from "../../../src/search/_internal/discussionsSearchChannelsHelpers";
import * as API from "../../../src/discussions/api/channels";
import { IQuery, IHubSearchOptions } from "../../../src";
import SEARCH_CHANNELS_RESPONSE from "./mocks/searchChannelsResponse";

describe("discussionsSearchItems Module |", () => {
  let processSearchParamsSpy: jasmine.Spy;
  let toHubSearchResultSpy: jasmine.Spy;
  let searchChannelsSpy: jasmine.Spy;

  beforeEach(() => {
    processSearchParamsSpy = spyOn(
      helpers,
      "processSearchParams"
    ).and.callThrough();
    toHubSearchResultSpy = spyOn(
      helpers,
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
            },
          ],
        },
      ],
    };
    const opts: IHubSearchOptions = {
      num: 10,
      sortField: "createdAt",
      sortOrder: "DESC",
      api: {
        type: "discussions",
        url: "/api/discussions/v1/channels",
      },
      requestOptions: {
        hubApiUrl: "https://hubqa.arcgis.com/api",
        token: "my-secret-token",
      } as any,
    };
    const result = await discussionsSearchChannels(qry, opts);
    expect(processSearchParamsSpy).toHaveBeenCalledTimes(1);
    expect(toHubSearchResultSpy).toHaveBeenCalledTimes(1);
    expect(searchChannelsSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });
});
