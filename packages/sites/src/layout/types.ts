import { IGroup } from "@esri/arcgis-rest-portal";

export interface ILayout {
  sections: ISection[],
  header ?: Object,
  footer ?: Object
}

export interface ITemplatizedLayout {
  layout: ILayout,
  assets: string[]
}

export interface ISection {
  rows: IRow[],
  assets ?: string[],
  style ?: {
    background: ISettings
  }
}

export interface ITemplatizedSection {
  sections: ISection[],
  assets: string[]
}

export interface IRow {
  cards: ICard[]
}

export interface ITemplatizedRow {
  cards: ICard[],
  assets: string[]
}

export interface ICard {
  component: IComponent
}

export interface ITemplatizedCard {
  card: ICard,
  assets: string[]
}

interface IComponent {
  name: string,
  settings: ISettings
}

export interface ISettings extends IEntry {
  version ?: Number,
  initiativeId ?: string
  initiativeIds ?: string[],
  fileSrc ?: string,
  cropSrc ?: string,
  groups ?: Record<string,any>[],
  query ?: Record<string,any>,
  orgId ?: string,
  siteId ?: string,
  webmap ?: string | string[],
  ids ?: string | string[]
}

export interface IEntry {
  cropId ?: string,
  resource ?: string
}