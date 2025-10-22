import {
  ISearchPosts,
  PostRelation,
  PostStatus,
  PostType,
  SharingAccess,
} from "../../../discussions/api/types";
import { IFilter } from "../../types/IHubCatalog";
import { IDateRange } from "../../types/types";
import { bboxStringToGeoJSONPolygon } from "../bboxStringToGeoJSONPolygon";
import { toEnum, toEnums } from "../hubEventsHelpers/toEnumConverters";
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

  // bbox
  if (flattenedFilters.bbox?.length) {
    // for now, just map bbox to the `geometry` filter. a `featureGeometry` filter
    // also exists, but we cannot use it in combination with `geometry` because
    // the API will `AND` those conditions together. if we desire the ability to
    // match posts whose `geometry` OR `featureGeometry` interesect the provided bbox,
    // we will need a new API parameter, and update this mapping to use it.
    const polygon = bboxStringToGeoJSONPolygon(
      flattenedFilters.bbox[0] as string
    );
    processedFilters.geometry = polygon;
  }

  // `term` searches against both `title` and `body` so
  // ignore `title` and `body` filters when `term` is provied
  if (flattenedFilters.term?.length) {
    processedFilters.term = flattenedFilters.term[0] as string;
  } else {
    // title
    if (flattenedFilters.title?.length) {
      processedFilters.title = flattenedFilters.title[0] as string;
    }

    // body
    if (flattenedFilters.body?.length) {
      processedFilters.body = flattenedFilters.body[0] as string;
    }
  }

  // channels
  if (flattenedFilters.channel?.length) {
    processedFilters.channels = flattenedFilters.channel as string[];
  }

  // creator
  if (flattenedFilters.owner?.length) {
    processedFilters.creator = flattenedFilters.owner[0] as string;
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

  // parents
  if (Array.isArray(flattenedFilters.parentId)) {
    processedFilters.parents = flattenedFilters.parentId as string[];
  }

  // groups
  if (flattenedFilters.groups?.length) {
    processedFilters.groups = flattenedFilters.groups as string[];
  }

  // post type
  if (flattenedFilters.postType?.length) {
    processedFilters.postType = toEnum(
      flattenedFilters.postType[0] as string,
      PostType
    );
  }

  // created
  if (flattenedFilters.created?.length) {
    processedFilters.createdBefore = new Date(
      (flattenedFilters.created[0] as IDateRange<string | number>).to
    );
    processedFilters.createdAfter = new Date(
      (flattenedFilters.created[0] as IDateRange<string | number>).from
    );
  }

  // modified
  if (flattenedFilters.modified?.length) {
    processedFilters.updatedBefore = new Date(
      (flattenedFilters.modified[0] as IDateRange<string | number>).to
    );
    processedFilters.updatedAfter = new Date(
      (flattenedFilters.modified[0] as IDateRange<string | number>).from
    );
  }

  // relations
  if (flattenedFilters.relation?.length) {
    processedFilters.relations = toEnums(
      flattenedFilters.relation as string[],
      PostRelation
    );
  }

  return processedFilters;
}
