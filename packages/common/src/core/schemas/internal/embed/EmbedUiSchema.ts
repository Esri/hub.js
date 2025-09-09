import type { IArcGISContext } from "../../../../types/IArcGISContext";
import { IEmbedCardEditorOptions } from "../EditorOptions";
import { IUiSchema } from "../../types";

export const buildUiSchema = (
  _i18nScope: string,
  _config: IEmbedCardEditorOptions,
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
