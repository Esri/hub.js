import { IArcGISContext } from "../..";
import { IHubSearchResult } from "../../search";
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
  icon?: string;
  color: string;
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
  showLabel?: boolean;
  icon?: string;
  buttonStyle?: "outline" | "outline-fill" | "solid" | "transparent";
}

export type CardViewModelTargets =
  | "self"
  | "siteRelative"
  | "workspaceRelative"
  | "none"
  | "event";

export type ConvertEntityToCardViewModelFn<T> = (
  entity: T,
  context: IArcGISContext,
  opts?: IConvertToCardViewModelOpts
) => IHubCardViewModel;

export type ConvertSearchResultToCardViewModelFn = (
  result: IHubSearchResult,
  opts?: IConvertToCardViewModelOpts
) => IHubCardViewModel;

export interface IConvertToCardViewModelOpts {
  actionLinks?: ICardActionLink[];
  baseUrl?: string;
  /**
   * TODO: move transform logic to FE so we don't need to pass
   * locale down (follow https://devtopia.esri.com/dc/hub/issues/7255)
   */
  locale?: string;
  target?: CardViewModelTargets;
}
