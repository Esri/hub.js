import { checkPermission } from "../../permissions/checkPermission";
import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubInitiative } from "../../core/types";

/**
 * @private
 * constructs the association group settings uiSchema for Hub Initiatives.
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubInitiative>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            labelKey: `${i18nScope}.fields.access.label`,
            scope: "/properties/access",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: `${i18nScope}.fields.access.helperText.initiativeAssociation`,
              },
              labels: [
                `{{${i18nScope}.fields.access.private.label:translate}}`,
                `{{${i18nScope}.fields.access.org.label:translate}}`,
                `{{${i18nScope}.fields.access.public.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.access.private.description.initiativeAssociation:translate}}`,
                `{{${i18nScope}.fields.access.org.description.initiativeAssociation:translate}}`,
                `{{${i18nScope}.fields.access.public.description.initiativeAssociation:translate}}`,
              ],
              icons: ["users", "organization", "globe"],
              styles: { "max-width": "45rem" },
            },
          },
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
              disabled: [
                false,
                !checkPermission(
                  "platform:portal:user:addExternalMembersToGroup",
                  context
                ).access,
                !checkPermission(
                  "platform:portal:user:addExternalMembersToGroup",
                  context
                ).access,
              ],
            },
          },
        ],
      },
    ],
  };
};
