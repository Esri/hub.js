import { IArcGISContext } from "../../../../types/IArcGISContext";
import { IUiSchema } from "../../types";
import { EntityEditorOptions } from "../EditorOptions";
import { buildUiSchema as buildDiscussionsSettingsUiSchema } from "./EntityUiSchemaDiscussionsSettings";

export const buildUiSchema = (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return buildDiscussionsSettingsUiSchema(
    i18nScope,
    options,
    context,
    "compact"
  );
};
