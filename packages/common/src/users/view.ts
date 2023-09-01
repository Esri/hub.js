import { IHubSearchResult } from "..";
import { ResultToCardModelFn } from "../core";
import {
  IBadgeConfig,
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
    ...(!isNaN(searchResult.index) && { index: searchResult.index }),
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
  const badges = [] as IBadgeConfig[];
  const memberType = user.memberType;

  /**
   * for group members, we want to configure
   * member type badges to render in the user
   * card
   */
  if (memberType) {
    if (user.isGroupOwner) {
      badges.push({
        icon: "user-key",
        color: "gray",
        i18nKey: "badges.members.owner",
        hideLabel: true,
        tooltip: { i18nKey: "badges.members.owner" },
      });
    } else if (memberType === "admin") {
      badges.push({
        icon: "user-up",
        color: "gray",
        i18nKey: "badges.members.admin",
        hideLabel: true,
        tooltip: { i18nKey: "badges.members.admin" },
      });
    } else {
      badges.push({
        icon: "user",
        color: "gray",
        i18nKey: "badges.members.member",
        hideLabel: true,
        tooltip: { i18nKey: "badges.members.member" },
      });
    }
  }

  return {
    access: user.access,
    badges,
    family: user.family,
    id: user.id,
    source: user.name ? `@${user.id}` : undefined,
    summary: user.summary,
    title: user.name || `@${user.id}`,
    type: user.type,
  };
};
