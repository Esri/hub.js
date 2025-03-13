import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { IArcGISContext } from "../../types";
import { IHubChannel } from "../../core/types";
import { buildUiSchema as buildUiSchemaCreate } from "./ChannelUiSchemaCreate";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Channels.
 * This defines how the schema properties should be
 * rendered in the channel editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubChannel>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const uiSchema = await buildUiSchemaCreate(i18nScope, options, context);
  if (options.canEdit) {
    uiSchema.elements.splice(0, 0, {
      type: "Notice",
      options: {
        noticeId: "20250311-channel-edit-warning",
      },
    });
  }
  return uiSchema;
};
