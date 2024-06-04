import { IConfigurationSchema } from "../../types";

export const EmbedSchema: IConfigurationSchema = {
  type: "object",
  required: [],
  properties: {
    id: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 1,
      default: ["57b06bab05194c109f630a904dd76e35"],
    },
    height: {
      type: "number",
      default: 500,
    },
    isScrollable: {
      type: "boolean",
      default: true,
    },
    hideOnMobile: {
      type: "boolean",
      default: false,
    },
    mobile: {
      type: "object",
      properties: {
        id: {
          type: "array",
          items: {
            type: "string",
          },
          maxItems: 1,
          default: ["57b06bab05194c109f630a904dd76e35"],
        },
        height: {
          type: "number",
          default: 500,
        },
        isScrollable: {
          type: "boolean",
          default: true,
        },
      },
    },
  },
};
