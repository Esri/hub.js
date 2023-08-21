import {
  ALIGNMENTS,
  CORNERS,
  DROP_SHADOWS,
  LAYOUTS,
  SHARING,
  SOURCE,
  UNIT_POSITIONS,
  VISUAL_INTEREST,
} from "./cards/types";

const ALTERNATE_VISUAL_INTEREST = Object.keys(VISUAL_INTEREST).filter(
  (x) => x !== VISUAL_INTEREST.sparkline
);

export const MetricSchema = {
  required: ["value"],
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: Object.keys(SOURCE),
      default: SOURCE.dynamic,
    },
    cardTitle: {
      type: "string",
    },
    value: {
      type: "string",
    },
    dynamicMetric: {
      type: "object",
    },
    allowUnitFormatting: {
      type: "boolean",
      default: false,
    },
    unit: {
      type: "string",
    },
    unitPosition: {
      type: "string",
      default: UNIT_POSITIONS.after,
      enum: Object.keys(UNIT_POSITIONS),
    },
    serverTimeout: {
      type: ["number", "null"],
      maximum: 99,
      minimum: 0,
    },
    subtitle: {
      type: "string",
    },
    trailingText: {
      type: "string",
    },
    textAlign: {
      type: "string",
      default: ALIGNMENTS.start,
    },
    allowLink: {
      type: "boolean",
      default: false,
    },
    sourceLink: {
      type: "string",
    },
    sourceTitle: {
      type: "string",
    },
    corners: {
      type: "string",
      default: CORNERS.square,
      enum: Object.keys(CORNERS),
    },
    valueColor: {
      type: "string",
    },
    layout: {
      type: "string",
      default: LAYOUTS.simple,
      enum: Object.keys(LAYOUTS),
    },
    dropShadow: {
      type: "string",
      default: DROP_SHADOWS.none,
      enum: Object.keys(DROP_SHADOWS),
    },
    visualInterest: {
      type: "string",
      default: VISUAL_INTEREST.none,
      if: { properties: { layout: { const: "simple" } } },
      then: { enum: Object.keys(VISUAL_INTEREST) },
      else: { enum: ALTERNATE_VISUAL_INTEREST },
    },
    shareable: {
      type: "boolean",
      default: false,
    },
    shareableByValue: {
      type: "boolean",
      default: false,
    },
    shareableOnHover: {
      type: "string",
      default: SHARING.always,
      enum: Object.keys(SHARING),
    },
    popoverTitle: {
      type: "string",
    },
    popoverDescription: {
      type: "string",
    },
  },
  // allOf: [
  //   { $ref: "#/definitions/if-source-title-then-source-link" },
  // ],
  // definitions: {
  //   // TODO: reimplement popover with layouts release
  //   "if-layout-moreinfo-then-require-popover-title-description": {
  //     if: {
  //       properties: { layout: { const: LAYOUTS.moreInfo } },
  //       required: ["layout"]
  //     },
  //     then: {
  //       required: ["popoverTitle", "popoverDescription"]
  //     }
  //   },
  //   "if-source-title-then-source-link": {
  //     if: {
  //       properties: { sourceTitle: { not: { enum: ['', undefined] } } },
  //       required: ["sourceTitle"]
  //     },
  //     then: {
  //       required: ["sourceLink"]
  //     }
  //   }
  // }
};
