import { IHubSearchResult } from "..";
import { ResultToCardModelFn } from "../core";
import {
  IConvertToCardModelOpts,
  IHubCardViewModel,
} from "../core/types/IHubCardViewModel";
import { getCardModelUrlFromResult } from "../urls/getCardModelUrl";

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
    ...getSharedUserCardModel(searchResult, locale),
    actionLinks,
    ...(searchResult.index && { index: searchResult.index }),
    titleUrl,
    ...(searchResult.links.thumbnail && {
      thumbnailUrl: searchResult.links.thumbnail,
    }),
  };
};

const getSharedUserCardModel = (
  user: IHubSearchResult,
  locale: string
): IHubCardViewModel => {
  const additionalInfo = [
    {
      i18nKey: "org",
      value: user.orgName,
    },
    {
      i18nKey: "type",
      value: user.type,
    },
    ...(user.tags?.length
      ? [
          {
            i18nKey: "tags",
            value: user.tags.join(", "),
          },
        ]
      : []),
    {
      i18nKey: "dateUpdated",
      value: user.updatedDate.toLocaleDateString(locale),
    },
  ];

  return {
    access: user.access,
    badges: [],
    family: user.family,
    id: user.id,
    source: user.name ? `@${user.id}` : undefined,
    summary: user.summary,
    title: user.name || `@${user.id}`,
    type: user.type,
    additionalInfo,
  };
};
