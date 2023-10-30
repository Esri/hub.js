import { IArcGISContext, IHubSearchResult, getFamily } from "..";
import { getShortenedCategories } from "../content/_internal/internalContentUtils";
import { IHubInitiative } from "../core";
import {
  getCardModelUrlFromEntity,
  getCardModelUrlFromResult,
} from "../urls/getCardModelUrl";
import {
  EntityToCardModelFn,
  ResultToCardModelFn,
  IConvertToCardModelOpts,
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
export const initiativeToCardModel: EntityToCardModelFn<IHubInitiative> = (
  initiative: IHubInitiative,
  context: IArcGISContext,
  opts?: IConvertToCardModelOpts
): IHubCardViewModel => {
  const {
    actionLinks = [],
    baseUrl = "",
    locale = "en-US",
    target = "self",
  } = opts || {};

  const titleUrl = getCardModelUrlFromEntity(
    initiative,
    context,
    target,
    baseUrl
  );

  return {
    ...getSharedInitiativeCardModel(initiative, locale),
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
export const initiativeResultToCardModel: ResultToCardModelFn = (
  searchResult: IHubSearchResult,
  opts?: IConvertToCardModelOpts
): IHubCardViewModel => {
  const {
    actionLinks = [],
    baseUrl = "",
    locale = "en-US",
    target = "self",
  } = opts || {};

  const titleUrl = getCardModelUrlFromResult(searchResult, target, baseUrl);

  return {
    ...getSharedInitiativeCardModel(searchResult, locale),
    actionLinks,
    ...(!isNaN(searchResult.index) && { index: searchResult.index }),
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
const getSharedInitiativeCardModel = (
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

  let source: string = null;
  if (entityOrSearchResult.source !== entityOrSearchResult.owner) {
    source = entityOrSearchResult.source;
  }

  return {
    access: entityOrSearchResult.access,
    badges: [],
    id: entityOrSearchResult.id,
    family: getFamily(entityOrSearchResult.type),
    source,
    summary: entityOrSearchResult.summary,
    title: entityOrSearchResult.name,
    type: entityOrSearchResult.type,
    additionalInfo,
  };
};
