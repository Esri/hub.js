import { IArcGISContext, IHubSearchResult, getFamily } from "..";
import { getShortenedCategories } from "../content/_internal/internalContentUtils";
import { IHubInitiative } from "../core";
import {
  getCardViewModelTitleUrlFromEntity,
  getCardViewModelTitleUrlFromSearchResult,
} from "../urls/getCardViewModelTitleUrl";
import {
  ConvertEntityToCardViewModelFn,
  ConvertSearchResultToCardViewModelFn,
  IConvertToCardViewModelOpts,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";

/**
 * Convert an initiative entity in a card view model
 * that can be consumed by the suite of hub gallery components
 *
 * @param initiative initiative entity
 * @param context auth & portal information
 * @param opts view model options
 */
export const convertInitiativeEntityToCardViewModel: ConvertEntityToCardViewModelFn<
  IHubInitiative
> = (
  initiative: IHubInitiative,
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
    initiative,
    context,
    target,
    baseUrl
  );

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
 * @param opts view model options
 */
export const convertInitiativeSearchResultToCardViewModel: ConvertSearchResultToCardViewModelFn =
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
