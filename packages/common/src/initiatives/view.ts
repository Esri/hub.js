import { IArcGISContext, IHubSearchResult, getFamily } from "..";
import {
  getHubRelativeUrl,
  getShortenedCategories,
} from "../content/_internal/internalContentUtils";
import { IHubInitiative } from "../core";
import {
  ICardActionLink,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";
import { getItemHomeUrl } from "../urls/get-item-home-url";
import { getRelativeWorkspaceUrl } from "../core/getRelativeWorkspaceUrl";

/**
 * Convert an initiative entity in a card view model
 * that can be consumed by the suite of hub gallery components
 *
 * @param initiative initiative entity
 * @param context auth & portal information
 * @param target card link contextual target
 * @param actionLinks card action links
 * @param locale internationalization locale
 */
export const convertInitiativeEntityToCardViewModel = (
  initiative: IHubInitiative,
  context: IArcGISContext,
  target: "ago" | "view" | "workspace" = "ago",
  actionLinks: ICardActionLink[] = [],
  /**
   * TODO: move transform logic to FE so we don't need to pass
   * locale down (follow https://devtopia.esri.com/dc/hub/issues/7255)
   */
  locale: string = "en-US"
): IHubCardViewModel => {
  const titleUrl = {
    ago: getItemHomeUrl(initiative.id, context.hubRequestOptions),
    view: getHubRelativeUrl(initiative.type, initiative.id),
    workspace: getRelativeWorkspaceUrl(initiative.type, initiative.id),
  }[target];

  return {
    ...getSharedInitiativeCardViewModel(initiative, locale),
    actionLinks,
    titleUrl,
    ...(initiative.thumbnailUrl && { thumbnailUrl: initiative.thumbnailUrl }),
  };
};

/**
 * Conver an initiative search result into a card view model
 * that can be consumed by the suite of hub gallery components
 *
 * @param searchResult hub initiative search result
 * @param target card link contextual target
 * @param actionLinks card action links
 * @param locale internationalization locale
 */
export const convertInitiativeSearchResultToCardViewModel = (
  searchResult: IHubSearchResult,
  target: "ago" | "view" | "workspace" = "ago",
  actionLinks: ICardActionLink[] = [],
  /**
   * TODO: move transform logic to FE so we don't need to pass
   * locale down (follow https://devtopia.esri.com/dc/hub/issues/7255)
   */
  locale: string = "en-US"
): IHubCardViewModel => {
  const titleUrl = {
    ago: searchResult.links.self,
    view: searchResult.links.siteRelative,
    workspace: searchResult.links.workspaceRelative,
  }[target];

  return {
    ...getSharedInitiativeCardViewModel(searchResult, locale),
    actionLinks,
    titleUrl,
    ...(searchResult.links.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

/**
 * Given an initiative entiy OR hub search result, construct the
 * initiative's shared card view model properties
 *
 * @param entityOrSearchResult intiative entity or hub search result
 * @param locale internationalization locale
 */
const getSharedInitiativeCardViewModel = (
  entityOrSearchResult: IHubInitiative | IHubSearchResult,
  locale: string
): IHubCardViewModel => {
  const additionalInfo = [
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
            value: getShortenedCategories(entityOrSearchResult.categories).join(
              ", "
            ),
          },
        ]
      : []),
    {
      i18nKey: "dateCreated",
      value: entityOrSearchResult.createdDate.toLocaleDateString(locale),
    },
  ];

  return {
    access: entityOrSearchResult.access,
    badges: [],
    id: entityOrSearchResult.id,
    family: getFamily(entityOrSearchResult.type),
    source: entityOrSearchResult.owner,
    summary: entityOrSearchResult.summary,
    title: entityOrSearchResult.name,
    type: entityOrSearchResult.type,
    additionalInfo,
  };
};
