import { IArcGISContext, IHubSearchResult } from "..";
import { getFamily } from "../content";
import { IHubProject } from "../core";
import { getShortenedCategories } from "../content/_internal/internalContentUtils";
import {
  IHubCardViewModel,
  IConvertToCardViewModelOpts,
  ConvertSearchResultToCardViewModelFn,
  ConvertEntityToCardViewModelFn,
} from "../core/types/IHubCardViewModel";
import {
  getCardViewModelTitleUrlFromEntity,
  getCardViewModelTitleUrlFromSearchResult,
} from "../urls/getCardViewModelTitleUrl";

/**
 * Convert a project entity into a card view model that can
 * be consumed by the suite of hub gallery components
 *
 * @param project project entity
 * @param context auth & portal information
 * @param opts view model options
 */
export const convertProjectEntityToCardViewModel: ConvertEntityToCardViewModelFn<
  IHubProject
> = (
  project: IHubProject,
  context: IArcGISContext,
  opts?: IConvertToCardViewModelOpts
): IHubCardViewModel => {
  const {
    actionLinks = [],
    baseUrl = "",
    locale = "en-US",
    target = "self",
  } = opts || {};

  const titleUrl = getCardViewModelTitleUrlFromEntity(
    project,
    context,
    target,
    baseUrl
  );

  return {
    ...getSharedProjectCardViewModel(project, locale),
    actionLinks,
    titleUrl,
    ...(project.thumbnailUrl && { thumbnailUrl: project.thumbnailUrl }),
  };
};

/**
 * Convert a project hub search result into a card view model that
 * can be consumed by the suite of hub gallery components
 *
 * @param searchResult hub project search result
 * @param opts view model options
 */
export const convertProjectSearchResultToCardViewModel: ConvertSearchResultToCardViewModelFn =
  (
    searchResult: IHubSearchResult,
    opts?: IConvertToCardViewModelOpts
  ): IHubCardViewModel => {
    const {
      actionLinks = [],
      baseUrl = "",
      locale = "en-US",
      target = "self",
    } = opts || {};

    const titleUrl = getCardViewModelTitleUrlFromSearchResult(
      searchResult,
      target,
      baseUrl
    );

    return {
      ...getSharedProjectCardViewModel(searchResult, locale),
      actionLinks,
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
