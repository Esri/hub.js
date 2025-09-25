import {
  ISearchPosts,
  PostRelation,
  PostStatus,
  SharingAccess,
} from "../../../discussions/api/types";
import { IFilter } from "../../types";
import { toEnums } from "../hubEventsHelpers/toEnumConverters";
import { flattenFilters } from "./processChannelFilters";

/**
 * Builds a Partial<ISearchPosts> given an Array of IFilter objects
 * @param filters An Array of IFilter
 * @returns A Partial<ISearchPosts> for the given Array of IFilter objects
 */
export function processPostFilters(filters: IFilter[]): Partial<ISearchPosts> {
  const flattenedFilters = flattenFilters(filters);
  const processedFilters: Partial<ISearchPosts> = {};

  // access
  if (flattenedFilters.access?.length) {
    processedFilters.access = toEnums(
      flattenedFilters.access as string[],
      SharingAccess
    );
  }

  // body
  if (flattenedFilters.body?.length) {
    processedFilters.body = flattenedFilters.body[0] as string;
  }

  // channels
  if (flattenedFilters.channel?.length) {
    processedFilters.channels = flattenedFilters.channel as string[];
  }

  // creator
  if (flattenedFilters.creator?.length) {
    processedFilters.creator = flattenedFilters.creator[0] as string;
  }

  // discussion
  if (flattenedFilters.discussion?.length) {
    processedFilters.discussion = flattenedFilters.discussion[0] as string;
  }

  // editor
  if (flattenedFilters.editor?.length) {
    processedFilters.editor = flattenedFilters.editor[0] as string;
  }

  // status
  if (flattenedFilters.status?.length) {
    processedFilters.status = toEnums(
      flattenedFilters.status as string[],
      PostStatus
    );
  }

  // title
  if (flattenedFilters.title?.length) {
    processedFilters.title = flattenedFilters.title[0] as string;
  }

  // parents
  if (flattenedFilters.parentId?.length) {
    processedFilters.parents = flattenedFilters.parentId as string[];
  }

  // relations
  if (flattenedFilters.relation?.length) {
    processedFilters.relations = toEnums(
      flattenedFilters.relation as string[],
      PostRelation
    );
  }
  // TODO: do we need location here?

  return processedFilters;
}
