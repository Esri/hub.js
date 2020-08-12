export interface ILayout {
  sections: ISection[];
  header?: object;
  footer?: object;
}

export interface ITemplatizedLayout {
  layout: ILayout;
  assets: string[];
}

export interface ISection {
  rows: IRow[];
  assets?: string[];
  style?: {
    background: ISettings;
  };
}

export interface ITemplatizedSection {
  sections: ISection[];
  assets: string[];
}

export interface IRow {
  cards: ICard[];
}

export interface ITemplatizedRow {
  cards: ICard[];
  assets: string[];
}

export interface ICard {
  component: IComponent;
}

export interface ITemplatizedCard {
  card: ICard;
  assets: string[];
}

interface IComponent {
  name: string;
  settings: ISettings;
}

export interface ISettings extends IEntry {
  version?: number;
  initiativeId?: string;
  initiativeIds?: string[];
  fileSrc?: string;
  cropSrc?: string;
  groups?: Array<Record<string, any>>;
  query?: Record<string, any>;
  orgId?: string;
  siteId?: string;
  surveyId?: string;
  itemId?: string;
  webmap?: string | string[];
  ids?: string | string[];
}

export interface IEntry {
  cropId?: string;
  resource?: string;
}
