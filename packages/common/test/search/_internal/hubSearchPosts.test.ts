import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { IHubSearchResult } from "../../../src/search/types/IHubSearchResult";
import {
  IPagedResponse,
  IPost,
  PostRelation,
} from "../../../src/discussions/api/types";
import { hubSearchPosts } from "../../../src/search/_internal/hubSearchPosts";
import * as processPostFiltersModule from "../../../src/search/_internal/hubDiscussionsHelpers/processPostFilters";
import * as processPostOptionsModule from "../../../src/search/_internal/hubDiscussionsHelpers/processPostOptions";
import * as postsModule from "../../../src/discussions/api/posts";
import * as postResultsToSearchResultsModule from "../../../src/search/_internal/hubDiscussionsHelpers/postToSearchResult";

describe("hubSearchPosts", () => {
  const query: IQuery = {
    targetEntity: "post",
    filters: [
      {
        predicates: [
          {
            id: ["p1", "p2", "p3"],
          },
        ],
      },
    ],
  };

  it("should search for posts and transform results to IHubSearchResult objects", async () => {
    const hubSearchOptions: IHubSearchOptions = {
      requestOptions: {
        authentication: { token: "token" },
      },
      num: 3,
      start: 1,
    } as unknown as IHubSearchOptions;
    const processedFilters = { ids: ["p1", "p2", "p3"] };
    const postResultsPage1: IPagedResponse<IPost> = {
      total: 3,
      nextStart: 3,
      start: 1,
      num: 3,
      items: [{ id: "p1" }, { id: "p2" }],
    } as unknown as IPagedResponse<IPost>;
    const postResultsPage2: IPagedResponse<IPost> = {
      total: 3,
      nextStart: -1,
      start: 2,
      num: 3,
      items: [{ id: "p3" }],
    } as unknown as IPagedResponse<IPost>;
    const searchResultsPage1: IHubSearchResult[] = [
      { id: "p1", type: "post" },
      { id: "p2", type: "post" },
    ] as unknown as IHubSearchResult[];
    const searchResultsPage2: IHubSearchResult[] = [
      { id: "p3", type: "post" },
    ] as unknown as IHubSearchResult[];
    const processPostFiltersSpy = spyOn(
      processPostFiltersModule,
      "processPostFilters"
    ).and.returnValue(processedFilters);
    const processPostOptionsSpy = spyOn(
      processPostOptionsModule,
      "processPostOptions"
    ).and.returnValues({ num: 3, start: 1 }, { num: 3, start: 3 });
    const searchPostsSpy = spyOn(postsModule, "searchPostsV2").and.returnValues(
      Promise.resolve(postResultsPage1),
      Promise.resolve(postResultsPage2)
    );
    const postResultsToSearchResultsSpy = spyOn(
      postResultsToSearchResultsModule,
      "postToSearchResult"
    ).and.callFake((post: IPost) => {
      return { id: post.id, type: "post" } as IHubSearchResult;
    });

    let results = await hubSearchPosts(query, hubSearchOptions);
    expect(results).toEqual({
      total: 3,
      results: searchResultsPage1,
      hasNext: true,
      next: jasmine.any(Function),
    });
    expect(searchPostsSpy).toHaveBeenCalledTimes(1);
    expect(searchPostsSpy).toHaveBeenCalledWith({
      ...hubSearchOptions.requestOptions,
      data: {
        ...processedFilters,
        num: 3,
        start: 1,
        relations: [],
      },
    });
    expect(processPostFiltersSpy).toHaveBeenCalledTimes(1);
    expect(processPostFiltersSpy).toHaveBeenCalledWith(query.filters);
    expect(processPostOptionsSpy).toHaveBeenCalledTimes(1);
    expect(processPostOptionsSpy).toHaveBeenCalledWith(hubSearchOptions);
    expect(postResultsToSearchResultsSpy).toHaveBeenCalledTimes(2);
    expect(postResultsToSearchResultsSpy).toHaveBeenCalledWith(
      postResultsPage1.items[0]
    );
    expect(postResultsToSearchResultsSpy).toHaveBeenCalledWith(
      postResultsPage1.items[1]
    );

    // next page
    searchPostsSpy.calls.reset();
    processPostFiltersSpy.calls.reset();
    processPostOptionsSpy.calls.reset();
    postResultsToSearchResultsSpy.calls.reset();
    results = await results.next();
    expect(results).toEqual({
      total: 3,
      results: searchResultsPage2,
      hasNext: false,
      next: jasmine.any(Function),
    });
    expect(searchPostsSpy).toHaveBeenCalledTimes(1);
    expect(searchPostsSpy).toHaveBeenCalledWith({
      ...hubSearchOptions.requestOptions,
      data: {
        ...processedFilters,
        num: 3,
        start: 3,
        relations: [],
      },
    });
    expect(processPostFiltersSpy).toHaveBeenCalledTimes(1);
    expect(processPostFiltersSpy).toHaveBeenCalledWith(query.filters);
    expect(processPostOptionsSpy).toHaveBeenCalledTimes(1);
    expect(processPostOptionsSpy).toHaveBeenCalledWith({
      ...hubSearchOptions,
      start: 3,
    });
    expect(postResultsToSearchResultsSpy).toHaveBeenCalledTimes(1);
    expect(postResultsToSearchResultsSpy).toHaveBeenCalledWith(
      postResultsPage2.items[0]
    );

    // no next page
    try {
      await results.next();
      fail("did not reject");
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual(
        "No more hub posts for the given query and options"
      );
    }
  });

  it("maps include to relations (de-duplicated)", async () => {
    const hubSearchOptions: IHubSearchOptions = {
      requestOptions: { authentication: { token: "token" } },
      include: [
        "channel",
        "replies",
        "replies", // duplicate
        "replyCount",
        "reactions",
        "channelAcl",
        "channel", // duplicate
        "parent",
        "unknown", // ignored
      ],
    } as unknown as IHubSearchOptions;

    const processedFilters = {};
    spyOn(processPostFiltersModule, "processPostFilters").and.returnValue(
      processedFilters
    );
    spyOn(processPostOptionsModule, "processPostOptions").and.returnValue({});
    const apiResponse: IPagedResponse<IPost> = {
      total: 1,
      nextStart: -1,
      start: 1,
      num: 1,
      items: [{ id: "p1" }],
    } as unknown as IPagedResponse<IPost>;
    const searchPostsSpy = spyOn(postsModule, "searchPostsV2").and.returnValue(
      Promise.resolve(apiResponse)
    );
    spyOn(
      postResultsToSearchResultsModule,
      "postToSearchResult"
    ).and.returnValue({
      id: "p1",
      type: "post",
    } as unknown as IHubSearchResult);

    const results = await hubSearchPosts(query, hubSearchOptions);
    expect(results.total).toBe(1);
    // Ensure relations array was passed and de-duplicated, order preserved by first appearance
    expect(searchPostsSpy).toHaveBeenCalledTimes(1);
    const callArgs = searchPostsSpy.calls.argsFor(0)[0];
    const passedRelations = callArgs.data.relations;
    expect(passedRelations).toEqual([
      PostRelation.CHANNEL,
      PostRelation.REPLIES,
      PostRelation.REPLY_COUNT,
      PostRelation.REACTIONS,
      PostRelation.CHANNEL_ACL,
      PostRelation.PARENT,
    ]);
  });

  it("results in empty relations array when no include map", async () => {
    const hubSearchOptions: IHubSearchOptions = {
      requestOptions: { authentication: { token: "token" } },
      include: ["foo", "bar"],
    } as unknown as IHubSearchOptions;
    const processedFilters = {};
    spyOn(processPostFiltersModule, "processPostFilters").and.returnValue(
      processedFilters
    );
    spyOn(processPostOptionsModule, "processPostOptions").and.returnValue({});
    const apiResponse: IPagedResponse<IPost> = {
      total: 0,
      nextStart: -1,
      start: 1,
      num: 0,
      items: [],
    } as unknown as IPagedResponse<IPost>;
    const searchPostsSpy = spyOn(postsModule, "searchPostsV2").and.returnValue(
      Promise.resolve(apiResponse)
    );
    spyOn(
      postResultsToSearchResultsModule,
      "postToSearchResult"
    ).and.callThrough();

    await hubSearchPosts(query, hubSearchOptions);
    const callArgs = searchPostsSpy.calls.argsFor(0)[0];
    expect(callArgs.data.relations).toEqual([]);
  });
});
