import { checkPermission } from "../..";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import {
  IUiSchema,
  IUiSchemaRule,
  UiSchemaMessageTypes,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { isHostedFeatureServiceEntity } from "../hostedServiceUtils";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Editable Content.
 * This defines how the schema properties should be
 * rendered in the content settings editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  _context: IArcGISContext
): Promise<IUiSchema> => {
  const uiSchema: IUiSchema = {
    type: "Layout",
    elements: [],
  };

  if (
    checkPermission("hub:content:workspace:settings:schedule", _context).access
  ) {
    // NOTE: unfortunately we have to add a hidden "access" field so
    // we can use the value of "access" in other UI Schema rules.
    const alwaysHiddenRule: IUiSchemaRule = {
      effect: UiSchemaRuleEffects.SHOW,
      condition: {
        scope: "/properties/access",
        schema: {
          const: "non-existent-access-type",
        },
      },
    };
    uiSchema.elements.push({
      type: "Control",
      scope: "/properties/access",
      rule: alwaysHiddenRule,
    });

    const isNotPublicCondition: IUiSchemaRule["condition"] = {
      scope: "/properties/access",
      schema: {
        enum: ["private", "org", "shared"],
      },
    };
    const disableScheduleRule: IUiSchemaRule = {
      effect: UiSchemaRuleEffects.DISABLE,
      condition: isNotPublicCondition,
    };

    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.schedule.label`,
      elements: [
        {
          type: "Control",
          scope: "/properties/schedule",
          labelKey: `${i18nScope}.sections.schedule.helperText`,
          rule: disableScheduleRule,
          options: {
            type: "Control",
            control: "hub-field-input-scheduler",
            labelKey: "fieldHeader",
            format: "radio",
            inputs: [
              { type: "automatic" },
              { type: "daily" },
              { type: "weekly" },
              { type: "monthly" },
              { type: "yearly" },
              {
                type: "manual",
                helperActionIcon: "information-f",
                helperActionText: `{{${i18nScope}.fields.schedule.manual.helperActionText:translate}}`,
              },
            ],
          },
        },
        // force update checkbox -- TODO: replace with button once available
        {
          type: "Control",
          scope: "/properties/_forceUpdate",
          rule: disableScheduleRule,
          options: {
            control: "hub-field-input-tile-select",
            type: "checkbox",
            labels: [
              `{{${i18nScope}.fields.schedule.forceUpdateButton.label:translate}}`,
            ],
            descriptions: [
              `{{${i18nScope}.fields.schedule.forceUpdateButton.description:translate}}`,
            ],
            messages: [
              {
                type: UiSchemaMessageTypes.custom,
                display: "notice",
                kind: "warning",
                icon: "exclamation-mark-triangle",
                titleKey: `${i18nScope}.fields.schedule.unavailableNotice.title`,
                labelKey: `${i18nScope}.fields.schedule.unavailableNotice.body`,
                allowShowBeforeInteract: true,
                condition: isNotPublicCondition,
              },
            ],
          },
        },
      ],
    });
  }

  if (isHostedFeatureServiceEntity(options as IHubEditableContent)) {
    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.downloads.label`,
      options: {
        helperText: {
          labelKey: `${i18nScope}.sections.downloads.helperText`,
        },
      },
      elements: [
        {
          labelKey: `${i18nScope}.fields.serverExtractCapability.label`,
          scope: "/properties/serverExtractCapability",
          type: "Control",
          options: {
            helperText: {
              labelKey: `${i18nScope}.fields.serverExtractCapability.helperText`,
            },
          },
        },
      ],
    });
  }
  return uiSchema;
};
