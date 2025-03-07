import { IUiSchema } from "../../core/schemas/types";
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
  // the create and edit schemas are the same at this time, this leaves the door open for them to change over time
  return buildUiSchemaCreate(i18nScope, options, context);
};
