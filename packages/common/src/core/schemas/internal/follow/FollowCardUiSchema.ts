import type { IArcGISContext } from "../../../../types/IArcGISContext";
import { IFollowCardEditorOptions } from "../EditorOptions";
import { IUiSchema, UiSchemaRuleEffects } from "../../types";
import {
  WellKnownCatalog,
  WellKnownCollection,
  getWellKnownCatalog,
} from "../../../../search/wellKnownCatalog";
import type { IUser } from "@esri/arcgis-rest-types";
import { IHubCatalog } from "../../../../search/types/IHubCatalog";

// Get the catalogs for the entity gallery picker
function getCatalogs(user: IUser): IHubCatalog[] {
  const catalogNames: WellKnownCatalog[] = ["myContent", "organization"];
  return catalogNames.map((name: WellKnownCatalog) => {
    const opts = {
      user,
      collectionNames: ["site" as WellKnownCollection],
    };
    const catalog = getWellKnownCatalog(
      "selectContent.facets",
      name,
      "item",
      opts
    );
    return catalog;
  });
}

export const buildUiSchema = (
  i18nScope: string,
  config: IFollowCardEditorOptions,
  context: IArcGISContext
): IUiSchema => {
  return {
    type: "Layout",
    elements: [
      {
        labelKey: "selectContent.title",
        scope: "/properties/entityId",
        type: "Control",
        options: {
          control: "hub-field-input-gallery-picker",
          targetEntity: "item",
          catalogs: getCatalogs(context.currentUser),
          facets: [
            {
              label: "{{selectContent.facets.sharing:translate}}",
              key: "access",
              display: "multi-select",
              field: "access",
              options: [],
              operation: "OR",
            },
          ],
        },
      },
      {
        type: "Section",
        labelKey: "callToAction.title",
        rule: HIDE_FOR_NO_ENTITY_ID,
        options: {
          helperText: {
            labelKey: "callToAction.helperText",
          },
        },
        elements: [
          {
            scope: "/properties/callToActionText",
            type: "Control",
            options: {
              type: "textarea",
              rows: 4,
            },
          },
          {
            labelKey: "callToAction.alignment",
            scope: "/properties/callToActionAlign",
            type: "Control",
            options: {
              control: "hub-field-input-alignment",
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: "followButton.title",
        options: {
          helperText: {
            labelKey: "followButton.helperText",
          },
        },
        rule: HIDE_FOR_NO_ENTITY_ID,
        elements: [
          {
            labelKey: "followButton.buttonText",
            scope: "/properties/buttonText",
            type: "Control",
            options: {
              control: "hub-field-input-input",
            },
          },
          {
            labelKey: "followButton.unfollowButtonText",
            scope: "/properties/unfollowButtonText",
            type: "Control",
            options: {
              control: "hub-field-input-input",
            },
          },
          {
            labelKey: "followButton.alignment",
            scope: "/properties/buttonAlign",
            type: "Control",
            options: {
              control: "hub-field-input-alignment",
            },
          },
          {
            labelKey: "followButton.buttonStyle",
            scope: "/properties/buttonStyle",
            type: "Control",
            options: {
              control: "hub-field-input-select",
              labels: [
                "{{followButton.solid:translate}}",
                "{{followButton.outline:translate}}",
              ],
            },
          },
        ],
      },
    ],
  };
};

const HIDE_FOR_NO_ENTITY_ID = {
  effect: UiSchemaRuleEffects.HIDE,
  condition: {
    scope: "/properties/entityId",
    schema: { const: [] as any },
  },
};
