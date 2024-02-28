import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import {
  IUiSchema,
  UiSchemaMessageTypes,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import { IHubSurvey } from "../../core/types/IHubSurvey";

/**
 * @private
 * settings uiSchema for Hub Survey - this
 * defines how the schema properties should be
 * rendered in the Survey settings experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.settings.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.displayMap.label`,
            scope: "/properties/displayMap",
            type: "Control",
            rule: {
              effect: UiSchemaRuleEffects.DISABLE,
              condition: {
                scope: "/properties/hasMapQuestion",
                schema: { const: false },
              },
            },
            options: {
              control: "hub-field-input-tile-select",
              type: "radio",
              labels: [
                `{{${i18nScope}.fields.displayMap.enabled.label:translate}}`,
                `{{${i18nScope}.fields.displayMap.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.displayMap.enabled.description:translate}}`,
                `{{${i18nScope}.fields.displayMap.disabled.description:translate}}`,
              ],
              icons: ["sidecar", "form-elements"],
              layout: "horizontal",
              messages: (options as IHubSurvey).hasMapQuestion
                ? []
                : [
                    {
                      type: UiSchemaMessageTypes.custom,
                      display: "notice",
                      keyword: "mapQuestion",
                      titleKey: `${i18nScope}.fields.displayMap.notice.title`,
                      labelKey: `${i18nScope}.fields.displayMap.notice.message`,
                      allowShowBeforeInteract: true,
                      alwaysShow: true,
                    },
                  ],
            },
          },
        ],
      },
    ],
  };
};
