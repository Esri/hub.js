import { checkPermission } from "../../permissions/checkPermission";
import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubInitiative } from "../../core/types";

/**
 * @private
 * constructs the minimal association group settings uiSchema for Hub Initiatives.
 * This defines how the schema properties should be rendered
 * in the initiative creation experience
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
            labelKey: `${i18nScope}.fields.settings.groupAccess.label`,
            scope: "/properties/_associations/properties/groupAccess",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: `${i18nScope}.fields.settings.groupAccess.helperText`,
              },
              labels: [
                `{{${i18nScope}.fields.settings.groupAccess.private.label:translate}}`,
                `{{${i18nScope}.fields.settings.groupAccess.org.label:translate}}`,
                `{{${i18nScope}.fields.settings.groupAccess.public.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.associations.groupAccess.private.description:translate}}`,
                `{{${i18nScope}.fields.settings.groupAccess.org.description:translate}}`,
                `{{${i18nScope}.fields.settings.groupAccess.public.description:translate}}`,
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
                `{{${i18nScope}.fields.membershipAccess.createAssociation.any:translate}}`,
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
          {
            labelKey: `${i18nScope}.fields.includeInCatalog.label`,
            scope: "/properties/includeInCatalog",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
            },
          },
        ],
      },
    ],
  };
};
