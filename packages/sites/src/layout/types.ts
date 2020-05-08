export interface ITemplatizedCard {
  card: ICard,
  assets: string[]
}

export interface ICard {
  component: IComponent
}

interface IComponent {
  name: string,
  settings: ISettings
}

export interface ISettings {
  initiativeId: string
  initiativeIds: string[],
  fileSrc: string,
  cropSrc: string,
  groups: IGroup[],
  query: IQuery,
  orgId: string,
  siteId: string
}

interface IGroup {
  id: string,
  title: string
}

interface IQuery {
  groups: IGroup[] | string[],
  orgId: string
}

export interface ILayout {
  sections: ISection[],
  header: Object,
  footer: Object
}

export interface ISection {
  rows: IRow[],
  assets: string[],
  style: {
    background: IEntry
  }
}

export interface IRow {
  cards: ICard[]
}

export interface IEntry {
  cropId: string,
  resource: string
}