import { IArcGISContext } from "../../../../ArcGISContext";
import { CardEditorOptions } from "../EditorOptions";
import { IUiSchema, UiSchemaRuleEffects } from "../../types";
import { getFeaturedContentCatalogs } from "../getFeaturedContentCatalogs";

const SHOW_FOR_FOLLOW_ACTION = {
  effect: UiSchemaRuleEffects.SHOW,
  condition: {
    scope: '/properties/action',
    schema: { const: 'follow' }
  }
}

/**
 * @private
 * Exports the uiSchema of the stat card
 * @returns
 */
export const buildUiSchema = (
  i18nScope: string,
  config: CardEditorOptions,
  context: IArcGISContext
): IUiSchema => {
  return {
    type: "Layout",
    elements: [
      {
        label: "Select an Entity to Follow",
        scope: "/properties/follow/properties/followedItemId",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION,
        options: {
          control: "hub-field-input-gallery-picker",
          targetEntity: "item",
          catalogs: getFeaturedContentCatalogs(context.currentUser)
        },
      },
      {
        label: "Call-to-Action",
        scope: "/properties/follow/properties/callToAction",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION,
        options: {
          control: "hub-field-input-input",
          type: "textarea",
        }
      },
      {
        label: "Alignment",
        scope: "/properties/follow/properties/callToActionAlignment",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION,
        options: {
          control: "hub-field-input-alignment",
          layout: "inline-space-between"
        },
      },
      {
        label: "Follow label",
        scope: "/properties/follow/properties/followStateText",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION
      },
      {
        label: "Unfollow label",
        scope: "/properties/follow/properties/unfollowStateText",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION,
      },
      {
        label: "Button text alignment",
        scope: "/properties/follow/properties/callToActionAlignment",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION,
        options: {
          control: "hub-field-input-alignment",
          layout: "inline-space-between"
        },
      },
      {
        label: "Button style",
        scope: "/properties/follow/properties/buttonStyle",
        type: "Control",
        rule: SHOW_FOR_FOLLOW_ACTION,
        options: {
          control: "hub-field-input-select",
          labels: ["Solid Background", "Ounline"],
        },
      },
    ],
  };
};
