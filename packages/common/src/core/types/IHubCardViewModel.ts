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
  icon?: string;
  buttonStyle?: "outline" | "outline-fill" | "solid" | "transparent";
}
