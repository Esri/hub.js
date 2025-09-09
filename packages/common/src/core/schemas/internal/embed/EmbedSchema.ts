import { IConfigurationSchema } from "../../types";

export const EmbedCardSchema: IConfigurationSchema = {
  type: "object",
  required: [],
  properties: {
    embeds: { type: "array" },
  },
};
