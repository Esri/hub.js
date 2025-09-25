import { ISearchPosts, PostSort, SortOrder } from "../../../discussions";
import { IHubSearchOptions } from "../../types";

/**
 * Builds a Partial<ISearchPosts> for the given IHubSearchOptions
 * @param options An IHubSearchOptions object
 * @returns a Partial<ISearchPosts> for the given IHubSearchOptions
 */
export function processPostOptions(
  options: IHubSearchOptions
): Partial<ISearchPosts> {
  const processedOptions: Partial<ISearchPosts> = {};
  if (options.num > 0) {
    processedOptions.num = options.num;
  }
  if (options.start > 1) {
    processedOptions.start = options.start;
  }
  processedOptions.sortOrder =
    options.sortOrder === "desc" ? SortOrder.DESC : SortOrder.ASC;
  // sort field
  switch (options.sortField) {
    case "body":
      processedOptions.sortBy = PostSort.BODY;
      break;
    case "channelId":
      processedOptions.sortBy = PostSort.CHANNEL_ID;
      break;
    case "createdAt":
      processedOptions.sortBy = PostSort.CREATED_AT;
      break;
    case "creator":
      processedOptions.sortBy = PostSort.CREATOR;
      break;
    case "discussion":
      processedOptions.sortBy = PostSort.DISCUSSION;
      break;
    case "editor":
      processedOptions.sortBy = PostSort.EDITOR;
      break;
    case "id":
      processedOptions.sortBy = PostSort.ID;
      break;
    case "parentId":
      processedOptions.sortBy = PostSort.PARENT_ID;
      break;
    case "status":
      processedOptions.sortBy = PostSort.STATUS;
      break;
    case "title":
      processedOptions.sortBy = PostSort.TITLE;
      break;
    case "updatedAt":
      processedOptions.sortBy = PostSort.UPDATED_AT;
      break;
  }
  return processedOptions;
}
