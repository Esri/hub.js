import { IArcGISContext, IHubSearchResult } from "..";
import { getFamily } from "../content";
import {
  getHubRelativeUrl,
  getShortenedCategories,
} from "../content/_internal/internalContentUtils";
import { IHubProject } from "../core";
import { getRelativeWorkspaceUrl } from "../core/_internal/getRelativeWorkspaceUrl";
import { IHubCardViewModel } from "../core/types/IHubCardViewModel";
import { getItemHomeUrl } from "../urls";

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

export const getCardViewModelFromProjectSearchResult = (
  searchResult: IHubSearchResult,
  target: "ago" | "view" | "workspace" = "ago",
  locale: string = "en-US"
): IHubCardViewModel => {
  const titleUrl = {
    ago: searchResult.links?.self,
    view: searchResult.links?.siteRelative,
    workspace: searchResult.links?.workspaceRelative,
  }[target];

  return {
    ...getSharedProjectCardViewModel(searchResult, locale),
    titleUrl,
    ...(searchResult.links?.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

const getSharedProjectCardViewModel = (
  entityOrSearchResult: IHubProject | IHubSearchResult,
  locale: string = "en-US"
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
      ...(entityOrSearchResult.type
        ? [{ i18nKey: "type", value: entityOrSearchResult.type }]
        : []),
      ...(entityOrSearchResult.updatedDate
        ? [
            {
              i18nKey: "dateUpdated",
              value:
                entityOrSearchResult.updatedDate.toLocaleDateString(locale),
            },
          ]
        : []),
      ...(entityOrSearchResult.tags?.length
        ? [{ i18nKey: "tags", value: entityOrSearchResult.tags.join(", ") }]
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
      ...(entityOrSearchResult.createdDate
        ? [
            {
              i18nKey: "type",
              value:
                entityOrSearchResult.createdDate.toLocaleDateString(locale),
            },
          ]
        : []),
    ],
  };
};
