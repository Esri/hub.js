import { IQuery } from "../../../src/search/types/IHubCatalog";
import { hubSearchChannels } from "../../../src/search/_internal";
import { IHubSearchOptions, IHubSearchResult } from "../../../src/search/types";
import * as channelsModule from "../../../src/discussions/api/channels";
import * as processChannelFiltersModule from "../../../src/search/_internal/hubDiscussionsHelpers/processChannelFilters";
import * as processChannelOptionsModule from "../../../src/search/_internal/hubDiscussionsHelpers/processChannelOptions";
import * as channelResultsToSearchResultsModule from "../../../src/search/_internal/hubDiscussionsHelpers/channelResultsToSearchResults";
import { IChannel, IPagedResponse } from "../../../src/discussions/api/types";

describe("hubSearchChannels", () => {
  const query: IQuery = {
    targetEntity: "channel",
    filters: [
      {
        predicates: [
          {
            id: ["c1", "c2", "c3"],
          },
        ],
      },
    ],
  };

  it("should reject when searchOptions.requestOptions is not provided", async () => {
    const hubSearchOptions: IHubSearchOptions = {
      num: 3,
      start: 1,
    };
    const processChannelFiltersSpy = spyOn(
      processChannelFiltersModule,
      "processChannelFilters"
    );
    const processChannelOptionsSpy = spyOn(
      processChannelOptionsModule,
      "processChannelOptions"
    );
    const searchChannelsSpy = spyOn(channelsModule, "searchChannelsV2");
    const channelResultsToSearchResultsSpy = spyOn(
      channelResultsToSearchResultsModule,
      "channelResultsToSearchResults"
    );
    try {
      await hubSearchChannels(query, hubSearchOptions);
      fail("did not reject");
    } catch (e) {
      expect(processChannelFiltersSpy).not.toHaveBeenCalled();
      expect(processChannelOptionsSpy).not.toHaveBeenCalled();
      expect(searchChannelsSpy).not.toHaveBeenCalled();
      expect(channelResultsToSearchResultsSpy).not.toHaveBeenCalled();
      expect((e as Error).message).toEqual(
        "options.requestOptions is required"
      );
    }
  });
  it("should search for channels and transform results to IHubSearchResult objects", async () => {
    const hubSearchOptions: IHubSearchOptions = {
      requestOptions: {
        authentication: { token: "token" },
      },
      num: 3,
      start: 1,
    } as unknown as IHubSearchOptions;
    const processedFilters = {
      ids: ["c1", "c2", "c3"],
    };
    const channelResultsPage1: IPagedResponse<IChannel> = {
      total: 3,
      nextStart: 3,
      start: 1,
      num: 3,
      items: [
        {
          id: "c1",
        },
        {
          id: "c2",
        },
      ],
    } as unknown as IPagedResponse<IChannel>;
    const channelResultsPage2: IPagedResponse<IChannel> = {
      total: 3,
      nextStart: -1,
      start: 2,
      num: 3,
      items: [
        {
          id: "c3",
        },
      ],
    } as unknown as IPagedResponse<IChannel>;
    const searchResultsPage1: IHubSearchResult[] = [
      {
        id: "c1",
        type: "channel",
      },
      {
        id: "c2",
        type: "channel",
      },
    ] as unknown as IHubSearchResult[];
    const searchResultsPage2: IHubSearchResult[] = [
      {
        id: "c3",
        type: "channel",
      },
    ] as unknown as IHubSearchResult[];
    const processChannelFiltersSpy = spyOn(
      processChannelFiltersModule,
      "processChannelFilters"
    ).and.returnValue(processedFilters);
    const processChannelOptionsSpy = spyOn(
      processChannelOptionsModule,
      "processChannelOptions"
    ).and.returnValues(
      {
        num: 3,
        start: 1,
      },
      {
        num: 3,
        start: 3,
      }
    );
    const searchChannelsSpy = spyOn(
      channelsModule,
      "searchChannelsV2"
    ).and.returnValues(
      Promise.resolve(channelResultsPage1),
      Promise.resolve(channelResultsPage2)
    );
    const channelResultsToSearchResultsSpy = spyOn(
      channelResultsToSearchResultsModule,
      "channelResultsToSearchResults"
    ).and.returnValues(
      Promise.resolve(searchResultsPage1),
      Promise.resolve(searchResultsPage2)
    );
    let results = await hubSearchChannels(query, hubSearchOptions);
    expect(results).toEqual({
      total: 3,
      results: searchResultsPage1,
      hasNext: true,
      next: jasmine.any(Function),
    });
    expect(searchChannelsSpy).toHaveBeenCalledTimes(1);
    expect(searchChannelsSpy).toHaveBeenCalledWith({
      data: {
        ...processedFilters,
        num: 3,
        start: 1,
      },
      ...hubSearchOptions.requestOptions,
    });
    expect(processChannelFiltersSpy).toHaveBeenCalledTimes(1);
    expect(processChannelFiltersSpy).toHaveBeenCalledWith(query.filters);
    expect(processChannelOptionsSpy).toHaveBeenCalledTimes(1);
    expect(processChannelOptionsSpy).toHaveBeenCalledWith(hubSearchOptions);
    expect(channelResultsToSearchResultsSpy).toHaveBeenCalledTimes(1);
    expect(channelResultsToSearchResultsSpy).toHaveBeenCalledWith(
      channelResultsPage1.items,
      hubSearchOptions
    );

    // next page
    searchChannelsSpy.calls.reset();
    processChannelFiltersSpy.calls.reset();
    processChannelOptionsSpy.calls.reset();
    channelResultsToSearchResultsSpy.calls.reset();
    results = await results.next();
    expect(results).toEqual({
      total: 3,
      results: searchResultsPage2,
      hasNext: false,
      next: jasmine.any(Function),
    });
    expect(searchChannelsSpy).toHaveBeenCalledTimes(1);
    expect(searchChannelsSpy).toHaveBeenCalledWith({
      data: {
        ...processedFilters,
        num: 3,
        start: 3,
      },
      ...hubSearchOptions.requestOptions,
    });
    expect(processChannelFiltersSpy).toHaveBeenCalledTimes(1);
    expect(processChannelFiltersSpy).toHaveBeenCalledWith(query.filters);
    expect(processChannelOptionsSpy).toHaveBeenCalledTimes(1);
    expect(processChannelOptionsSpy).toHaveBeenCalledWith({
      ...hubSearchOptions,
      start: 3,
    });
    expect(channelResultsToSearchResultsSpy).toHaveBeenCalledTimes(1);
    expect(channelResultsToSearchResultsSpy).toHaveBeenCalledWith(
      channelResultsPage2.items,
      {
        ...hubSearchOptions,
        start: 3,
      }
    );
  });
});
