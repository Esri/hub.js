import { IArcGISContext } from "../ArcGISContext";
import { HubEntity } from "../core/types/HubEntity";
import { CardModelTarget } from "../core/types/IHubCardViewModel";
import { IHubSearchResult } from "../search/types/IHubSearchResult";
import { getItemHomeUrl } from "./get-item-home-url";

/**
 * given a target and hub search result, this util
 * returns a gallery card's title url
 *
 * @param result hub search result
 * @param target context the card should redirect to
 * @param baseUrl base url to work in conjunction with the target
 */
export function getCardModelUrlFromResult(
  result: IHubSearchResult,
  target: CardModelTarget,
  baseUrl?: string
): string {
  let titleUrl;

  if (target === "event") {
    titleUrl = "#";
  } else if (target === "none") {
    titleUrl = undefined;
  } else {
    switch (result.type) {
      default:
        titleUrl = {
          self: result.links?.self,
          siteRelative: baseUrl
            ? `${baseUrl}${result.links?.siteRelative || ""}`
            : result.links?.siteRelative,
          workspaceRelative: baseUrl
            ? `${baseUrl}${result.links?.workspaceRelative || ""}`
            : result.links?.workspaceRelative,
        }[target];
        break;
      case "Hub Site Application":
        titleUrl = result.links?.self;
        break;
    }
  }

  return titleUrl;
}

/**
 * given a target and hub entity, this util
 * returns a gallery card's title url
 *
 * @param entity hub entity
 * @param context auth & portal information
 * @param target context the card should redirect to
 * @param baseUrl base url to work in conjunction with the target
 */
export function getCardModelUrlFromEntity(
  entity: HubEntity,
  context: IArcGISContext,
  target: CardModelTarget,
  baseUrl?: string
): string {
  let titleUrl;

  if (target === "event") {
    titleUrl = "#";
  } else if (target === "none") {
    titleUrl = undefined;
  } else {
    switch (entity.type) {
      default:
        titleUrl = {
          self: entity.links?.self,
          siteRelative: baseUrl
            ? `${baseUrl}${entity.links?.siteRelative || ""}`
            : entity.links?.siteRelative,
          workspaceRelative: baseUrl
            ? `${baseUrl}${entity.links?.workspaceRelative || ""}`
            : entity.links?.workspaceRelative,
        }[target];
        break;
      case "Hub Site Application":
        titleUrl = entity.links?.self;
        break;
    }
  }

  return titleUrl;
}
