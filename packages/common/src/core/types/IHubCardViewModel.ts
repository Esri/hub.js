import { IArcGISContext } from "../../ArcGISContext";
import { IHubSearchResult } from "../../search/types/IHubSearchResult";
import { AccessLevel } from "./types";

// structure the arcgis-hub-card expects to receive
export interface IHubCardViewModel {
  access?: AccessLevel;
  id?: string;
  title?: string;
  source?: string;
  summary?: string;
  thumbnailUrl?: string;
  titleUrl?: string;
  type?: string;
  family?: string;
  badges?: IBadgeConfig[];
  additionalInfo?: IInfoConfig[];
  actionLinks?: ICardActionLink[];
  index?: number; // position of card in list - used for telemetry
}

// structure defining a hub card badge
export interface IBadgeConfig {
  i18nKey?: string;
  label?: string;
  /**
   * whether the label or translated i18nKey
   * should actually render or just be used
   * for a11y purposes
   */
  showLabel?: boolean;
  icon?: string;
  color: string;
  tooltip?: {
    i18nKey?: string;
    label?: string;
  };
}

// structure defining the additional info for a hub card
export interface IInfoConfig {
  i18nKey?: string;
  label?: string;
  value: string;
}

// structure defining a hub card action link
export interface ICardActionLink {
  action?: string;
  href?: string;
  i18nKey?: string;
  label?: string;
  /**
   * whether the label or translated i18nKey
   * should actually render or just be used
   * for a11y purposes
   */
  showLabel?: boolean;
  icon?: string;
  buttonStyle?: "outline" | "outline-fill" | "solid" | "transparent";
}

export type CardModelTarget =
  // link to the entity's canonical "self" - for most entities,
  // this will be AGO; however, there are exceptions - for sites,
  // "self" will be the site url itself
  | "self"
  // link to the entity's "view" url relative to the site
  | "siteRelative"
  // link to the entity's workspace url relative to the site
  | "workspaceRelative"
  // no link
  | "none"
  // only emit an event when the link is clicked - allows
  // consumers to apply a custom redirect
  | "event";

export type EntityToCardModelFn<T> = (
  entity: T,
  context: IArcGISContext,
  opts?: IConvertToCardModelOpts
) => IHubCardViewModel;

export type ResultToCardModelFn = (
  result: IHubSearchResult,
  opts?: IConvertToCardModelOpts
) => IHubCardViewModel;

export interface IConvertToCardModelOpts {
  actionLinks?: ICardActionLink[];
  baseUrl?: string;
  /**
   * TODO: move transform logic to FE so we don't need to pass
   * locale down (follow https://devtopia.esri.com/dc/hub/issues/7255)
   */
  locale?: string;
  target?: CardModelTarget;
}
