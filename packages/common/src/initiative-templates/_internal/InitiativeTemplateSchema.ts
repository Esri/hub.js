import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

export const InitiativeTemplateSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    previewUrl: {
      type: "string",
      if: { minLength: 1 },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      then: { format: "url" },
    },
    recommendedTemplates: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};
