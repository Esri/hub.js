import { ISearchPosts, PostSort, SortOrder } from "../../../discussions";
import { IHubSearchOptions } from "../../types";

/**
 * A union type of supported sort fields whens searching for posts
 */
type HubSearchPostSortFields =
  | "body"
  | "channelId"
  | "created"
  | "modified"
  | "owner"
  | "discussion"
  | "editor"
  | "id"
  | "parentId"
  | "status"
  | "title";

/**
 * A map of HubSearchPostSortFields to PostSort
 */
const SORT_BY_MAP: Record<HubSearchPostSortFields, PostSort> = {
  body: PostSort.BODY,
  channelId: PostSort.CHANNEL_ID,
  created: PostSort.CREATED_AT,
  modified: PostSort.UPDATED_AT,
  owner: PostSort.CREATOR,
  discussion: PostSort.DISCUSSION,
  editor: PostSort.EDITOR,
  id: PostSort.ID,
  parentId: PostSort.PARENT_ID,
  status: PostSort.STATUS,
  title: PostSort.TITLE,
};

const SORT_ORDER_MAP: Record<"desc" | "asc", SortOrder> = {
  desc: SortOrder.DESC,
  asc: SortOrder.ASC,
};

/**
 * Builds a Partial<ISearchPosts> for the given IHubSearchOptions
 * @param options An IHubSearchOptions object
 * @returns a Partial<ISearchPosts> for the given IHubSearchOptions
 */
export function processPostOptions(
  options: IHubSearchOptions
): Partial<ISearchPosts> {
  const processedOptions: Partial<ISearchPosts> = {};
  // num
  if (options.num > 0) {
    processedOptions.num = options.num;
  }

  // start
  if (options.start > 1) {
    processedOptions.start = options.start;
  }

  // sort order
  if (options.sortOrder && SORT_ORDER_MAP[options.sortOrder]) {
    processedOptions.sortOrder = SORT_ORDER_MAP[options.sortOrder];
  }

  // sort field
  const sortField: PostSort =
    SORT_BY_MAP[options.sortField as HubSearchPostSortFields];
  if (sortField) {
    processedOptions.sortBy = sortField;
  }

  return processedOptions;
}
