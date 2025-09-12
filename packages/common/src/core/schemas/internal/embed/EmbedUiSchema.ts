import type { IArcGISContext } from "../../../../types/IArcGISContext";
import { EmbedCardEditorOptions } from "../EditorOptions";
import { IUiSchema } from "../../types";

export const buildUiSchema = (
  _i18nScope: string,
  _config: EmbedCardEditorOptions,
  _context: IArcGISContext
): IUiSchema => {
  return {
    type: "Layout",
    elements: [
      {
        scope: "/properties/embeds",
        type: "Control",
        options: {
          control: "hub-composite-input-embeds",
        },
      },
    ],
  };
};
