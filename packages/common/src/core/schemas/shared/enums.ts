/**
 * Alignment values allowed for a display
 *
 * values = start | center | end
 */
export enum ALIGNMENTS {
  start = "start",
  center = "center",
  end = "end",
}
/**
 * Corner values allowed for a display
 *
 * values = square | round
 */
export enum CORNERS {
  square = "square",
  round = "round",
}
/**
 * Drop shadow values allowed for a display
 *
 * values = none | low | medium | heavy
 */
export enum DROP_SHADOWS {
  none = "none",
  low = "low",
  medium = "medium",
  heavy = "heavy",
}

/**
 * Tags to wrap the title on each card
 */
export enum CARD_TITLE_TAG {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
}

/**
 * Show thumbnail options,
 * show | hide | only show in grid layout
 */
export enum SHOW_THUMBNAIL {
  show = "show",
  hide = "hide",
  grid = "grid",
}

/**
 * Options for the layout of a gallery
 */
export enum LAYOUT_OPTIONS {
  list = "list",
  grid = "grid",
  table = "table",
  map = "map",
  compact = "compact",
  calendar = "calendar",
}

/**
 * Button styles
 */
export enum BUTTON_STYLES {
  outline = "outline",
  solid = "solid",
  filled = "outline-filled",
  transparent = "transparent",
}
