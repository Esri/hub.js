export enum ALIGNMENTS {
  start = 'start',
  center = 'center',
  end = 'end',
}
export enum CORNERS {
  square = 'square',
  round = 'round',
}
export enum DROP_SHADOWS {
  none = 'none',
  low = 'low',
  medium = 'medium',
  heavy = 'heavy',
}
export enum LAYOUTS {
  simple = 'simple',
  dataViz = 'dataViz',
  moreInfo = 'moreInfo',
}
export enum VISUAL_INTEREST {
  none = 'none',
  sparkline = 'sparkline',
  icon = 'icon',
  logo = 'logo',
}
export enum SHARING {
  always = 'always',
  hover = 'hover'
}
export enum SOURCE {
  dynamic = 'dynamic',
  static = 'static',
}
export enum UNIT_POSITIONS {
  before = 'before',
  after = 'after',
  below = 'below',
}

export interface IMetricCardConfig {
  metricId: string,
  displayType: string,
  [key: string]: any
}