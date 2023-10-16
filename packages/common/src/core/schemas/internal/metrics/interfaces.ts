export enum ALIGNMENTS {
  start = "start",
  center = "center",
  end = "end",
}
export enum CORNERS {
  square = "square",
  round = "round",
}
export enum DROP_SHADOWS {
  none = "none",
  low = "low",
  medium = "medium",
  heavy = "heavy",
}
export enum LAYOUTS {
  simple = "simple",
  dataViz = "dataViz",
  moreInfo = "moreInfo",
}
export enum SCALE {
  small = "s",
  medium = "m",
  large = "l",
}
export enum UNIT_POSITIONS {
  before = "before",
  after = "after",
  below = "below",
}
export enum VISUAL_INTEREST {
  none = "none",
  sparkline = "sparkline",
  icon = "icon",
  logo = "logo",
}

export enum SHARING {
  always = "always",
  hover = "hover",
}

export enum SOURCE {
  dynamic = "dynamic",
  static = "static",
}

export type SelectionMode = "multiple" | "none" | "single";

export interface IShareableCard {
  shareable: boolean;
  shareableByValue: boolean;
  shareableByReference: boolean;
  shareableOnHover: boolean;
  element: HTMLElement;
  getState?(): any;
}

export enum IMAGE_TYPES {
  thumbnail = "thumbnail",
  icon = "icon",
}
