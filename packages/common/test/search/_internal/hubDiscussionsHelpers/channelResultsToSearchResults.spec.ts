// Make ESM named-exports spyable by mocking the module and merging the original exports.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
}));

import * as restPortal from "@esri/arcgis-rest-portal";
import { IChannel } from "../../../../src/discussions/api/types";
import { IHubSearchOptions } from "../../../../src/search/types/IHubSearchOptions";
import { channelResultsToSearchResults } from "../../../../src/search/_internal/hubDiscussionsHelpers/channelResultsToSearchResults";
import { IHubSearchResult } from "../../../../src/search/types/IHubSearchResult";
import * as discussionUtilsModule from "../../../../src/discussions/utils";
import { describe, it, expect, afterEach, vi } from "vitest";

describe("channelResultsToSearchResults", () => {
  afterEach(() => vi.restoreAllMocks());

  it("should resolve an array of IHubSearchResult without group enrichments", async () => {
    const channels: IChannel[] = [
      {
        id: "c1",
        groups: ["g1"],
      },
      {
        id: "c2",
        groups: ["g1", "g2"],
      },
      {
        id: "c3",
        groups: ["g3", "g4"],
      },
    ] as unknown as IChannel[];
    const hubSearchOptions: IHubSearchOptions = {
      requestOptions: {
        authentication: { token: "token-123" },
      },
    } as unknown as IHubSearchOptions;
    const groupResults: restPortal.IGroup[] = [
      {
        id: "g1",
      },
      {
        id: "g2",
      },
      {
        id: "g4",
      },
    ] as any as restPortal.IGroup[];
    const channelSearchResults: IHubSearchResult[] = [
      {
        id: "c1",
        includes: { groups: [] },
      },
      {
        id: "c2",
        includes: { groups: [] },
      },
      {
        id: "c3",
        includes: { groups: [] },
      },
    ] as unknown as IHubSearchResult[];
    const searchGroupsSpy = vi
      .spyOn(restPortal, "searchGroups")
      .mockResolvedValue(groupResults as any);
    const channelToSearchResultSpy = vi
      .spyOn(discussionUtilsModule, "channelToSearchResult")
      .mockImplementation(
        (channel: IChannel) =>
          ({
            id: channel.id,
            includes: { groups: [] },
          } as unknown as IHubSearchResult)
      );
    const results = await channelResultsToSearchResults(
      channels,
      hubSearchOptions
    );
    expect(searchGroupsSpy).not.toHaveBeenCalled();
    expect(channelToSearchResultSpy).toHaveBeenCalledTimes(3);
    expect(channelToSearchResultSpy).toHaveBeenCalledWith(channels[0], []);
    expect(channelToSearchResultSpy).toHaveBeenCalledWith(channels[1], []);
    expect(channelToSearchResultSpy).toHaveBeenCalledWith(channels[2], []);
    expect(results).toEqual(channelSearchResults);
  });

  it("should resolve an array of IHubSearchResult with group enrichments", async () => {
    const channels: IChannel[] = [
      {
        id: "c1",
        groups: ["g1"],
      },
      {
        id: "c2",
        groups: ["g1", "g2"],
      },
      {
        id: "c3",
        groups: ["g3", "g4"],
      },
    ] as unknown as IChannel[];
    const hubSearchOptions: IHubSearchOptions = {
      include: "groups",
      requestOptions: {
        authentication: { token: "token-123" },
      },
    } as unknown as IHubSearchOptions;
    const groupResults: restPortal.IGroup[] = [
      {
        id: "g1",
      },
      {
        id: "g2",
      },
      {
        id: "g4",
      },
    ] as any as restPortal.IGroup[];
    const channelSearchResults: IHubSearchResult[] = [
      {
        id: "c1",
        includes: { groups: [groupResults[0]] },
      },
      {
        id: "c2",
        includes: { groups: [groupResults[0], groupResults[1]] },
      },
      {
        id: "c3",
        includes: { groups: [null, groupResults[2]] },
      },
    ] as unknown as IHubSearchResult[];
    const searchGroupsSpy = vi
      .spyOn(restPortal, "searchGroups")
      .mockResolvedValue({ results: groupResults } as any);
    const channelToSearchResultSpy = vi
      .spyOn(discussionUtilsModule, "channelToSearchResult")
      .mockImplementation(
        (channel: IChannel) =>
          ({
            id: channel.id,
            includes: {
              groups: channel.groups.map(
                (groupId) =>
                  groupResults.find(({ id }) => id === groupId) || null
              ),
            },
          } as any)
      );
    const results = await channelResultsToSearchResults(
      channels,
      hubSearchOptions
    );
    expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: "id:g1 OR id:g2 OR id:g3 OR id:g4",
      num: 4,
      ...hubSearchOptions.requestOptions,
    });
    expect(channelToSearchResultSpy).toHaveBeenCalledTimes(3);
    expect(channelToSearchResultSpy).toHaveBeenCalledWith(channels[0], [
      groupResults[0],
    ]);
    expect(channelToSearchResultSpy).toHaveBeenCalledWith(channels[1], [
      groupResults[0],
      groupResults[1],
    ]);
    expect(channelToSearchResultSpy).toHaveBeenCalledWith(channels[2], [
      null,
      groupResults[2],
    ]);
    expect(results).toEqual(channelSearchResults);
  });
});
