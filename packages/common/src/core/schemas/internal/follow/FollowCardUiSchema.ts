import { IArcGISContext } from "../../../../ArcGISContext";
import { CardEditorOptions } from "../EditorOptions";
import { IUiSchema } from "../../types";
import {
  WellKnownCatalog,
  WellKnownCollection,
  getWellKnownCatalog,
} from "../../../../search/wellKnownCatalog";
import { IUser } from "@esri/arcgis-rest-types";
import { IHubCatalog } from "../../../../search/types/IHubCatalog";

function getCatalog(user: IUser): IHubCatalog[] {
  const catalogNames: WellKnownCatalog[] = [
    "myContent",
    "favorites",
    "organization",
  ];
  const catalogs = catalogNames.map((name: WellKnownCatalog) => {
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

  return catalogs;
}

export const buildUiSchema = (
  i18nScope: string,
  config: CardEditorOptions,
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
          catalogs: getCatalog(context.currentUser),
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
        elements: [
          {
            labelKey: "callToAction.description",
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
          labelKey: "followButton.description",
        },
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
              labels: ["Solid Background", "Outline"],
            },
          },
        ],
      },
    ],
  };
};
