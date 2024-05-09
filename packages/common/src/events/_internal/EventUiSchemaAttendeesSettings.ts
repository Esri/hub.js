import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IUiSchema } from "../../core/schemas/types";

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
        elements: [
          {
            labelKey: `${i18nScope}.fields.allowRegistration.label`,
            scope: "/properties/allowRegistration",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              type: "radio",
              helperText: {
                labelKey: `${i18nScope}.fields.allowRegistration.helperText`,
              },
              labels: [
                `{{${i18nScope}.fields.allowRegistration.enabled.label:translate}}`,
                `{{${i18nScope}.fields.allowRegistration.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.allowRegistration.enabled.description:translate}}`,
                `{{${i18nScope}.fields.allowRegistration.disabled.description:translate}}`,
              ],
              icons: ["user-calendar", "circle-disallowed"],
              layout: "horizontal",
            },
          },
          {
            labelKey: `${i18nScope}.fields.notifyAttendees.label`,
            scope: "/properties/notifyAttendees",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              type: "radio",
              helperText: {
                labelKey: `${i18nScope}.fields.notifyAttendees.helperText`,
              },
              labels: [
                `{{${i18nScope}.fields.notifyAttendees.enabled.label:translate}}`,
                `{{${i18nScope}.fields.notifyAttendees.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.notifyAttendees.enabled.description:translate}}`,
                `{{${i18nScope}.fields.notifyAttendees.disabled.description:translate}}`,
              ],
              icons: ["envelope", "circle-disallowed"],
              layout: "horizontal",
            },
          },
        ],
      },
    ],
  };
};
