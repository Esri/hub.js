// module for shared metric schema definitions
import { SOURCE } from "./interfaces";

// if metric type = static, require value
export const IF_STATIC_THEN_REQUIRE_VALUE = {
  if: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        properties: {
          type: { const: "static" },
        },
      },
    },
  },
  then: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        required: ["value"],
      },
    },
  },
};

// if sourceTitle is not empty, require sourceLink
export const IF_SOURCE_TITLE_THEN_SOURCE_LINK = {
  if: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        properties: { sourceTitle: { not: { const: "" } } },
        required: ["sourceTitle"],
      },
    },
  },
  then: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        required: ["sourceLink"],
      },
    },
  },
};

// if valueType = "string" | "date", set value type to
//  "string", otherwise set value type to "number"
export const VALUE_TYPE_MAPPING = {
  if: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        properties: {
          valueType: { enum: ["string", "date"] },
        },
      },
    },
  },
  then: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        properties: { value: { type: "string" } },
      },
    },
  },
  else: {
    type: "object",
    properties: {
      _metric: {
        type: "object",
        properties: { value: { type: "number" } },
      },
    },
  },
};

// if type = "static", then we should format link as a url
// otherwise, it can take any shape (so that relative links are allowed)
// NOTE: we can remove this rule once we update the url formatter
// to allow relative links
export const IF_STATIC_THEN_URL_FORMAT = {
  if: {
    type: "object",
    properties: {
      _metric: {
        properties: {
          type: { const: SOURCE.static },
        },
      },
    },
  },
  then: {
    type: "object",
    properties: {
      _metric: {
        properties: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          sourceLink: { format: "url" },
        },
      },
    },
  },
};
