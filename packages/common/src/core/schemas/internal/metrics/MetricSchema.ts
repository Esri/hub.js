import { IConfigurationSchema } from "../../types";
import { UNIT_POSITIONS, VISUAL_INTEREST, LAYOUTS, SOURCE } from "./interfaces";
import { ALIGNMENTS, DROP_SHADOWS } from "../../shared/enums";

// when the user selects the dataViz uiSchema/layout, we show fewer visual interest options
const ALTERNATE_VISUAL_INTEREST = Object.keys(VISUAL_INTEREST).filter(
  (x) => x !== VISUAL_INTEREST.sparkline
);

export const MetricSchema: IConfigurationSchema = {
  type: "object",
  required: [],
  properties: {
    type: {
      type: "string",
      enum: Object.keys(SOURCE),
      default: SOURCE.dynamic,
    },
    cardTitle: {
      type: "string",
    },
    value: {},
    valueType: {
      type: "string",
      default: "string",
      enum: ["string", "number", "date"],
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
      type: "number",
      maximum: 95,
      minimum: 5,
      default: 10,
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
    allowDynamicLink: {
      type: "boolean",
      default: true,
    },
    sourceLink: {
      type: "string",
    },
    sourceTitle: {
      type: "string",
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
      type: "boolean",
      default: true,
    },
    popoverTitle: {
      type: "string",
    },
    popoverDescription: {
      type: "string",
    },
  },
  allOf: [
    { $ref: "#/definitions/if-source-title-then-source-link" },
    { $ref: "#/definitions/value-type-value-mapping" },
    { $ref: "#/definitions/if-static-then-url-format" },
  ],
  definitions: {
    // TODO: reimplement popover with layouts release
    "if-layout-moreinfo-then-require-popover-title-description": {
      if: {
        type: "object",
        properties: { layout: { const: LAYOUTS.moreInfo } },
        required: ["layout"],
      },
      then: {
        required: ["popoverTitle", "popoverDescription"],
      },
    },
    "if-source-title-then-source-link": {
      if: {
        type: "object",
        properties: { sourceTitle: { not: { const: "" } } },
        required: ["sourceTitle"],
      },
      then: {
        required: ["sourceLink"],
      },
    },
    "value-type-value-mapping": {
      if: {
        type: "object",
        properties: {
          valueType: { enum: ["string", "date"] },
        },
      },
      then: {
        type: "object",
        properties: { value: { type: "string" } },
      },
      else: {
        type: "object",
        properties: { value: { type: "number" } },
      },
    },
    "if-static-then-url-format": {
      if: {
        type: "object",
        properties: {
          type: { const: SOURCE.static },
        },
      },
      then: {
        type: "object",
        properties: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          sourceLink: { format: "url" },
        },
      },
    },
  },
};
