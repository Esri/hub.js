import { IArcGISContext } from "../../../../ArcGISContext";
import { IUiSchema } from "../../types";
import { IStatCardEditorOptions } from "../EditorOptions";

/**
 * @private
 * Exports the uiSchema of metrics for projects
 * @param i18nScope
 * @param config
 * @param context
 * @returns
 */
export const buildUiSchema = (
  i18nScope: string,
  config: IStatCardEditorOptions,
  context: IArcGISContext
): IUiSchema => {
  // To be filled out in a later issue
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.details.sectionTitle`,
        options: {
          section: "block",
        },
        elements: [
          {
            labelKey: `${i18nScope}.details.title`,
            scope: "/properties/cardTitle",
            type: "Control",
          },
        ],
      },
    ],
  };
};
