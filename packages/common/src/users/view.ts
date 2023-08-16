import { IHubSearchResult } from "..";
import { ResultToCardModelFn } from "../core";
import {
  IConvertToCardModelOpts,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";
import { getCardModelUrlFromResult } from "../urls/getCardModelUrl";

/**
 * Convert a user hub search result into a card view model that
 * can be consumed by the suite of hub gallery components
 *
 * @param searchResult hub user search result
 * @param opts view model options
 */
export const userResultToCardModel: ResultToCardModelFn = (
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
    ...getSharedUserCardModel(searchResult),
    actionLinks,
    ...(searchResult.index && { index: searchResult.index }),
    titleUrl,
    ...(searchResult.links.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

/**
 * Given a hub search result, construct the
 * users card view model properties
 *
 * @param user user search result
 * @param locale internationalization locale
 */
const getSharedUserCardModel = (user: IHubSearchResult): IHubCardViewModel => {
  return {
    access: user.access,
    badges: [],
    family: user.family,
    id: user.id,
    source: user.name ? `@${user.id}` : undefined,
    summary: user.summary,
    title: user.name || `@${user.id}`,
    type: user.type,
  };
};
