import type { IArcGISContext } from "../../types/IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
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
  // We want to conver it over to a boolean as it can be undefined which doesn't play well
  // with the rules in our schema system
  const hasMapQuestion = !(options as IHubSurvey).hasMapQuestion;
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
            },
          },
          {
            type: "Notice",
            options: {
              notice: {
                configuration: {
                  id: "map-question-notice",
                  noticeType: "notice",
                  closable: false,
                  kind: "info",
                  scale: "m",
                },
                title: `{{${i18nScope}.fields.displayMap.notice.title:translate}}`,
                body: `{{${i18nScope}.fields.displayMap.notice.message:translate}}`,
                autoShow: true,
              },
            },
            rules: [
              {
                effect: UiSchemaRuleEffects.SHOW,
                conditions: [hasMapQuestion],
              },
            ],
          },
        ],
      },
    ],
  };
};
