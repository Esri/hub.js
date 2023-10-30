import { IArcGISContext, IHubSearchResult } from "..";
import { IHubInitiativeTemplate } from "../core/types/IHubInitiativeTemplate";
import {
  getCardModelUrlFromEntity,
  getCardModelUrlFromResult,
} from "../urls/getCardModelUrl";
import {
  IConvertToCardModelOpts,
  IHubCardViewModel,
  ResultToCardModelFn,
  EntityToCardModelFn,
} from "../core/types/IHubCardViewModel";
import { getFamily } from "../content";
import { getShortenedCategories } from "../content/_internal/internalContentUtils";

/**
 * Convert an initiative template entity into a card view model that can
 * be consumed by the suite of hub gallery components
 *
 * @param initiativeTemplate initiative template entity
 * @param context auth & portal information
 * @param opts view model options
 * @returns
 */
export const initiativeTemplateToCardModel: EntityToCardModelFn<
  IHubInitiativeTemplate
> = (
  initiativeTemplate: IHubInitiativeTemplate,
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
    initiativeTemplate,
    context,
    target,
    baseUrl
  );

  return {
    ...getSharedInitiativeTemplateCardModel(initiativeTemplate, locale),
    actionLinks,
    titleUrl,
    ...(initiativeTemplate.thumbnailUrl && {
      thumbnailUrl: initiativeTemplate.thumbnailUrl,
    }),
  };
};

/**
 * Convert an initiative template hub search result into a card view model that
 * can be consumed by the suite of hub gallery components
 *
 * @param searchResult hub initiative template search result
 * @param opts view model options
 */
export const initiativeTemplateResultToCardModel: ResultToCardModelFn = (
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
    ...getSharedInitiativeTemplateCardModel(searchResult, locale),
    actionLinks,
    ...(!isNaN(searchResult.index) && { index: searchResult.index }),
    titleUrl,
    ...(searchResult.links.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

const getSharedInitiativeTemplateCardModel = (
  entityOrSearchResult: IHubInitiativeTemplate | IHubSearchResult,
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
