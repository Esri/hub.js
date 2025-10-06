import { IHubSearchResult } from "../types/IHubSearchResult";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { searchPostsV2 } from "../../discussions/api/posts";
import { IQuery } from "../types/IHubCatalog";
import { ISearchPosts } from "../..";
import { postToSearchResult } from "./hubDiscussionsHelpers/postToSearchResult";
import { processPostFilters } from "./hubDiscussionsHelpers/processPostFilters";
import { processPostOptions } from "./hubDiscussionsHelpers/processPostOptions";
import { processRelations } from "./hubDiscussionsHelpers/processRelations";

/**
 * @private
 * Executes a Discussions API (v2) post search and resolves an IHubSearchResponse<IHubSearchResult>.
 * Currently supported filters include (filter predicate key => accepted values):
 *   - access: 'public' | 'private' | 'org' | Array<'public' | 'private' | 'org'>
 *   - body: string
 *   - channel: string | string[] (mapped internally to `channels`)
 *   - owner: string | string[] (first value mapped to `creator`)
 *   - discussion: string | string[]
 *   - editor: string | string[]
 *   - status: 'pending' | 'approved' | 'rejected' | 'deleted' | 'hidden' | 'blocked' | Array<...>
 *   - title: string | string[]
 *   - parentId: string | string[] (mapped internally to `parents`)
 *   - groups: string | string[]
 *   - postType: 'text' | 'announcement' | 'poll' | 'question'
 *   - created: IDateRange<string | number> (mapped to createdAfter / createdBefore)
 *   - modified: IDateRange<string | number> (mapped to updatedAfter / updatedBefore)
 *
 * Notes / constraints:
 *   - For single-value filters where an array is provided (e.g., owner, editor, discussion, title, body), only the first value is used.
 *   - Date range predicates use the shape: { from: string|number; to: string|number }.
 *   - Unsupported filters are ignored silently.
 *
 * INCLUDE SUPPORT (options.include tokens mapped to post relations - bare tokens only)
 *   channel     -> PostRelation.CHANNEL
 *   parent      -> PostRelation.PARENT
 *   replies     -> PostRelation.REPLIES (returns replies collection or paging info)
 *   replyCount  -> PostRelation.REPLY_COUNT (numeric aggregate)
 *   reactions   -> PostRelation.REACTIONS
 *   channelAcl  -> PostRelation.CHANNEL_ACL
 *   Unknown tokens are ignored; no namespaced forms (e.g. `post:channel`) are supported.
 *
 * Currently supported sort fields include (pass via `options.sortField`):
 *   - body
 *   - channelId
 *   - created  (maps to createdAt)
 *   - modified (maps to updatedAt)
 *   - owner    (maps to creator)
 *   - discussion
 *   - editor
 *   - id
 *   - parentId
 *   - status
 *   - title
 * Sort order: 'ASC' | 'DESC' (via `options.sortOrder`).
 * Pagination options: `options.num` (page size), `options.start` (1-based offset handled by API).
 *
 * @param query An IQuery object (must include `filters` and `targetEntity: 'post'` upstream)
 * @param options An IHubSearchOptions object
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult>
 */
export async function hubSearchPosts(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const processedFilters = processPostFilters(query.filters);
  const processedOptions = processPostOptions(options);
  const processedRelations = processRelations(options.include);

  const data: ISearchPosts = {
    ...processedFilters,
    ...processedOptions,
    relations: processedRelations,
  };
  const { items, nextStart, total } = await searchPostsV2({
    ...options.requestOptions,
    // Passing `hubApiKey` as `token` to `searchPostsV2`. The token is defined as
    // a prop in `IDiscussionsRequestOptions`, which `ISearchPostsParams` extends
    token: options.requestOptions.hubApiKey,
    data,
  });
  const results = await Promise.all(
    items.map((post) => postToSearchResult(post))
  );
  const hasNext = nextStart > -1;
  return {
    total,
    results,
    hasNext,
    next: (): Promise<IHubSearchResponse<IHubSearchResult>> => {
      if (!hasNext) {
        throw new Error("No more hub posts for the given query and options");
      }
      return hubSearchPosts(query, {
        ...options,
        start: nextStart,
      });
    },
  };
}
