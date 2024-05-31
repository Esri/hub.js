import { IUiSchema } from "../../core";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IHubGroup } from "../../core";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Groups
 * This defines how the schema properties should be
 * rendered in the group settings experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const entity = options as IHubGroup;
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.membershipAccess.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.membershipAccess.label`,
            scope: "/properties/membershipAccess",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.membershipAccess.org:translate}}`,
                `{{${i18nScope}.fields.membershipAccess.collab:translate}}`,
                `{{${i18nScope}.fields.membershipAccess.any:translate}}`,
              ],
              disabled: [false, false, entity.isSharedUpdate],
            },
          },
          {
            labelKey: `${i18nScope}.fields.contributeContent.label`,
            scope: "/properties/isViewOnly",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.contributeContent.all:translate}}`,
                `{{${i18nScope}.fields.contributeContent.admins:translate}}`,
              ],
            },
          },
        ],
      },
    ],
  };
};
