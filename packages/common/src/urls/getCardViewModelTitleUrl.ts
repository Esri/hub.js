import { IArcGISContext } from "..";
import { getRelativeWorkspaceUrl } from "../core/getRelativeWorkspaceUrl";
import { getHubRelativeUrl } from "../content/_internal/internalContentUtils";
import { HubEntity } from "../core";
import { CardViewModelTargets } from "../core/types/IHubCardViewModel";
import { IHubSearchResult } from "../search";
import { getItemHomeUrl } from "./get-item-home-url";

/**
 * returns a gallery card's title url from a hub search result
 *
 * @param result hub search result
 * @param target context the card should redirect to
 * @param baseUrl base url to work in conjunction with the target
 * @returns
 */
export function getCardViewModelTitleUrlFromSearchResult(
  result: IHubSearchResult,
  target: CardViewModelTargets,
  baseUrl?: string
): string {
  let titleUrl;

  switch (result.type) {
    default:
      titleUrl = {
        none: undefined,
        event: undefined,
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

      ["none", "event"].includes(target) && (titleUrl = undefined);
      break;
  }

  return titleUrl;
}

/**
 * returns a gallery card's title url from an entity
 *
 * @param entity hub entity
 * @param context auth & portal information
 * @param target context the card should redirect to
 * @param baseUrl base url to work in conjunction with the target
 */
export function getCardViewModelTitleUrlFromEntity(
  entity: HubEntity,
  context: IArcGISContext,
  target: CardViewModelTargets,
  baseUrl?: string
): string {
  let titleUrl;

  switch (entity.type) {
    default:
      titleUrl = {
        none: undefined,
        event: undefined,
        self: getItemHomeUrl(entity.id, context.hubRequestOptions),
        siteRelative: baseUrl
          ? `${baseUrl}${getHubRelativeUrl(entity.type, entity.id)}`
          : getHubRelativeUrl(entity.type, entity.id),
        workspaceRelative: baseUrl
          ? `${baseUrl}${getRelativeWorkspaceUrl(entity.type, entity.id)}`
          : getRelativeWorkspaceUrl(entity.type, entity.id),
      }[target];
      break;
    case "Hub Site Application":
      titleUrl = getItemHomeUrl(entity.id, context.hubRequestOptions);

      ["none", "event"].includes(target) && (titleUrl = undefined);
      break;
  }

  return titleUrl;
}
