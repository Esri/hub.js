import { IArcGISContext } from "../ArcGISContext";
import { IHubSearchResult } from "../search/types";
import { getFamily } from "../content/get-family";
import { IHubTemplate } from "../core/types/IHubTemplate";
import { getShortenedCategories } from "../content/_internal/internalContentUtils";
import {
  getCardModelUrlFromEntity,
  getCardModelUrlFromResult,
} from "../urls/getCardModelUrl";
import {
  IHubCardViewModel,
  IConvertToCardModelOpts,
  ResultToCardModelFn,
  EntityToCardModelFn,
} from "../core/types/IHubCardViewModel";

/**
 * Convert a template entity into a card view model that can
 * be consumed by the suite of hub gallery components
 *
 * @param template template entity
 * @param context auth & portal information
 * @param opts view model options
 */
export const templateToCardModel: EntityToCardModelFn<IHubTemplate> = (
  template: IHubTemplate,
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
    template,
    context,
    target,
    baseUrl
  );

  return {
    ...getSharedTemplateCardModel(template, locale),
    actionLinks,
    titleUrl,
    ...(template.thumbnailUrl && { thumbnailUrl: template.thumbnailUrl }),
  };
};

/**
 * Convert a template hub search result into a card view model
 * that can be consumed by the suite of hub gallery components
 *
 * @param searchResult hub template search result
 * @param opts view model options
 */
export const templateResultToCardModel: ResultToCardModelFn = (
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
    ...getSharedTemplateCardModel(searchResult, locale),
    actionLinks,
    ...(!isNaN(searchResult.index) && { index: searchResult.index }),
    titleUrl,
    ...(searchResult.links.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

/**
 * Given a template entity OR hub serach result, construct the
 * template's shared card view model properties
 *
 * @param entityOrSearchResult template entity or hub search result
 * @param locale internationalization locale
 */
const getSharedTemplateCardModel = (
  entityOrSearchResult: IHubTemplate | IHubSearchResult,
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
