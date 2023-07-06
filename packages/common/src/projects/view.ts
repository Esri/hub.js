import { IArcGISContext, IHubSearchResult } from "..";
import { getFamily } from "../content";
import {
  getHubRelativeUrl,
  getShortenedCategories,
} from "../content/_internal/internalContentUtils";
import { IHubProject } from "../core";
import { getRelativeWorkspaceUrl } from "../core/getRelativeWorkspaceUrl";
import { IHubCardViewModel } from "../core/types/IHubCardViewModel";
import { getItemHomeUrl } from "../urls/get-item-home-url";

/**
 * Convert a project entity into a card view model that can
 * be consumed by the suite of hub gallery components
 *
 * @param project project entity
 * @param context auth & portal information
 * @param target card link contextual target
 * @param locale internationalization locale
 */
export const getCardViewModelFromProjectEntity = (
  project: IHubProject,
  context: IArcGISContext,
  target: "ago" | "view" | "workspace" = "ago",
  locale: string = "en-US"
): IHubCardViewModel => {
  const titleUrl = {
    ago: getItemHomeUrl(project.id, context.hubRequestOptions),
    view: getHubRelativeUrl(project.type, project.id),
    workspace: getRelativeWorkspaceUrl(project.type, project.id),
  }[target];

  return {
    ...getSharedProjectCardViewModel(project, locale),
    titleUrl,
    ...(project.thumbnailUrl && { thumbnailUrl: project.thumbnailUrl }),
  };
};

/**
 * Convert a project hub search result into a card view model that
 * can be consumed by the suite of hub gallery components
 *
 * @param searchResult hub project search result
 * @param target card link contextual target
 * @param locale internationalization locale
 */
export const getCardViewModelFromProjectSearchResult = (
  searchResult: IHubSearchResult,
  target: "ago" | "view" | "workspace" = "ago",
  locale: string = "en-US"
): IHubCardViewModel => {
  const titleUrl = {
    ago: searchResult.links.self,
    view: searchResult.links.siteRelative,
    workspace: searchResult.links.workspaceRelative,
  }[target];

  return {
    ...getSharedProjectCardViewModel(searchResult, locale),
    titleUrl,
    ...(searchResult.links.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

/**
 * Given a project entity OR hub serach result, construct the
 * project's shared card view model properties
 *
 * @param entityOrSearchResult project entity or hub search result
 * @param locale internationalization locale
 */
const getSharedProjectCardViewModel = (
  entityOrSearchResult: IHubProject | IHubSearchResult,
  locale: string
): IHubCardViewModel => {
  return {
    access: entityOrSearchResult.access,
    badges: [],
    id: entityOrSearchResult.id,
    family: getFamily(entityOrSearchResult.type),
    source: entityOrSearchResult.owner,
    summary: entityOrSearchResult.summary,
    title: entityOrSearchResult.name,
    type: entityOrSearchResult.type,
    additionalInfo: [
      {
        i18nKey: "type",
        value: entityOrSearchResult.type,
      },
      {
        i18nKey: "dateUpdated",
        value: entityOrSearchResult.updatedDate.toLocaleDateString(locale),
      },
      ...(entityOrSearchResult.tags?.length
        ? [
            {
              i18nKey: "tags",
              value: entityOrSearchResult.tags.join(", "),
            },
          ]
        : []),
      ...(entityOrSearchResult.categories?.length
        ? [
            {
              i18nKey: "categories",
              value: getShortenedCategories(
                entityOrSearchResult.categories
              ).join(", "),
            },
          ]
        : []),
      {
        i18nKey: "dateCreated",
        value: entityOrSearchResult.createdDate.toLocaleDateString(locale),
      },
    ],
  };
};
