import { IArcGISContext } from "../../../types/IArcGISContext";
import { getWellKnownCatalogs } from "../../../search";
import { IUiSchemaElement, UiSchemaRuleEffects } from "../types";
import { checkPermission } from "../../../permissions/checkPermission";

/**
 * When creating an entity, an editor can elect to initialize
 * the entity's catalog with a new group or an existing group.
 * The following util builds the UiSchema elements to render
 * this configuration in various creation flows.
 *
 * @param i18nScope intl - scope for translations
 * @param context contextual - portal & auth information
 */
export function buildCatalogSetupUiSchemaElement(
  i18nScope: string,
  context: IArcGISContext
): IUiSchemaElement[] {
  const canCreateViewGroup = checkPermission(
    "hub:group:create:view",
    context
  ).access;
  return [
    {
      scope: "/properties/_catalogSetup/properties/type",
      type: "Control",
      label: "{{shared.fields._catalogSetup.type.label:translate}}",
      options: {
        control: "hub-field-input-tile-select",
        helperText: {
          label: `{{${i18nScope}.fields._catalogSetup.type.helperText:translate}}`,
        },
        layout: "horizontal",
        scale: "m",
        labels: [
          "{{shared.fields._catalogSetup.type.blank.label:translate}}",
          "{{shared.fields._catalogSetup.type.newGroup.label:translate}}",
          "{{shared.fields._catalogSetup.type.existingGroup.label:translate}}",
        ],
        descriptions: [
          "{{shared.fields._catalogSetup.type.blank.description:translate}}",
          "{{shared.fields._catalogSetup.type.newGroup.description:translate}}",
          "{{shared.fields._catalogSetup.type.existingGroup.description:translate}}",
        ],
        rules: [
          [
            {
              effect: "SHOW",
              conditions: [true],
            },
          ],
          // only show the "quick start" option if the user is
          // able to create a view group
          [
            {
              effect: "SHOW",
              conditions: [canCreateViewGroup],
            },
          ],
          [
            {
              effect: "SHOW",
              conditions: [true],
            },
          ],
        ],
        icons: ["rectangle", "rectangle-plus", "group"],
      },
    },
    {
      scope: "/properties/_catalogSetup/properties/groupId",
      type: "Control",
      options: {
        control: "hub-field-input-gallery-picker",
        targetEntity: "group",
        linkTarget: "siteRelative",
        catalogs: getWellKnownCatalogs(
          "shared.wellKnownCatalogs.group",
          "group",
          ["myGroups", "orgGroups", "communityGroups", "publicGroups"],
          context
        ),
        facets: ["group-role", "group-type", "group-access"],
        canReorder: false,
        messages: [
          {
            type: "ERROR",
            keyword: "required",
            icon: true,
            label:
              "{{shared.fields._catalogSetup.groupId.requiredError:translate}}",
          },
        ],
      },
      rules: [
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [
            {
              scope: "/properties/_catalogSetup/properties/type",
              schema: { const: "existingGroup" },
            },
          ],
        },
      ],
    },
  ];
}
