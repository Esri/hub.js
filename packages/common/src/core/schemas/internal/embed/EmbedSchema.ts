import {
  // IAsyncConfigurationSchema,
  IConfigurationSchema,
} from "../../types";

export const EmbedCardSchema: IConfigurationSchema = {
  // export const EmbedSchema: IAsyncConfigurationSchema = {
  // $async: true,
  type: "object",
  required: [],
  properties: {
    embeds: { type: "array" },
  },
};
