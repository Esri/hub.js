import type { IArcGISContext } from "../../IArcGISContext";
import { IUiSchemaElement } from "../../core/schemas/types";
import { getWellKnownCatalog } from "../../search/wellKnownCatalog";

export function buildReferencedContentSchema(
  i18nScope: string,
  context: IArcGISContext,
  label?: string
): IUiSchemaElement {
  return {
    scope: "/properties/referencedContentIds",
    type: "Control",
    label,
    options: {
      control: "hub-field-input-gallery-picker",
      helperText: {
        labelKey: `${i18nScope}.fields.referencedContent.helperText.label`,
      },
      targetEntity: "item",
      catalogs: [
        getWellKnownCatalog(
          `${i18nScope}.fields.referencedContent`,
          "organization",
          "item",
          {
            user: context.currentUser,
            collectionNames: ["site", "initiative", "project"],
            filters: [],
            context,
          }
        ),
      ],
      facets: [
        {
          label: `{{${i18nScope}.fields.referencedContent.facets.from.label:translate}}`,
          key: "from",
          display: "single-select",
          operation: "OR",
          options: [
            {
              label: `{{${i18nScope}.fields.referencedContent.facets.from.myContent.label:translate}}`,
              key: "myContent",
              selected: true,
              predicates: [
                {
                  owner: context.currentUser.username,
                },
              ],
            },
            {
              label: `{{${i18nScope}.fields.referencedContent.facets.from.myOrganization.label:translate}}`,
              key: "myOrganization",
              selected: false,
              predicates: [
                {
                  orgId: context.currentUser.orgId,
                },
              ],
            },
          ],
        },
        {
          label: `{{${i18nScope}.fields.referencedContent.facets.access.label:translate}}`,
          key: "access",
          field: "access",
          display: "multi-select",
          operation: "OR",
        },
      ],
    },
  };
}
