import { checkPermission } from "../..";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import {
  IUiSchema,
  IUiSchemaElement,
  IUiSchemaMessage,
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
    const scheduleControlElement: IUiSchemaElement = {
      type: "Control",
      scope: "/properties/schedule",
      labelKey: `${i18nScope}.sections.schedule.helperText`,
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
    };
    // force update checkbox -- TODO: replace with button once available
    const forceUpdateControlElement: IUiSchemaElement = {
      type: "Control",
      scope: "/properties/_forceUpdate",
      options: {
        control: "hub-field-input-tile-select",
        type: "checkbox",
        labels: [
          `{{${i18nScope}.fields.schedule.forceUpdateButton.label:translate}}`,
        ],
        descriptions: [
          `{{${i18nScope}.fields.schedule.forceUpdateButton.description:translate}}`,
        ],
      },
    };

    /**
     * NOTE: Some crazy gymnastics up ahead if the content is not public.
     *
     * The entity editor component will re-calculate the _UI Schema_ passed into the configuration editor
     * if the underlying entity has been changed from the outside (e.g., via the sharing level controls).
     * However, it will not change _the values_ passed into the configuration editor.
     *
     * This means that `options.access` is guaranteed to be up-to-date, but the underlying
     * configuration editor's `values.access` _will not be updated_.
     *
     * As such we cannot rely on an IUiSchemaRule to update the disabled state of the
     * schedule and force update controls, because the rule will be evaluated against
     * _the old value_ of `values.access`.
     *
     * Also, the configuration editor also does not provide a way to statically set the disabled
     * state of a control. We have to rely on an IUiSchemaRule to disable a field.
     *
     * So, here's what we do as a workaround:
     *
     * - Create a "disabled" rule with a condition that always evaluates to true (i.e., this.entity.type === this.entity.type)
     * - Create a "hide" rule with a condition that always evaluates to true (i.e., this.entity.type === this.entity.type)
     * - Add a hidden "type" field to the UI Schema (needed so we can use the value of entity.type in a the "disabled" and "hide" rules)
     * - Add the "disabled" rule to the schedule and force update controls
     * - Add a special notice to the bottom of the force update control which informs the user that scheduling is unavailable
     */
    if (options.access !== "public") {
      // checks if this.values.type === options.type, which is always true
      const alwaysTrueCondition: IUiSchemaRule["condition"] = {
        scope: "/properties/type",
        schema: {
          const: options.type,
        },
      };

      // This rule will cause a control to always be hidden
      const alwaysHiddenRule: IUiSchemaRule = {
        effect: UiSchemaRuleEffects.HIDE,
        condition: alwaysTrueCondition,
      };

      // This rule will cause a control to always be disabled
      const alwaysDisabledRule: IUiSchemaRule = {
        effect: UiSchemaRuleEffects.DISABLE,
        condition: alwaysTrueCondition,
      };

      // NOTE: unfortunately we have to add a hidden "type" field to the ui schema. If we don't, we won't
      // have access to `this.values.type` when evaluating `alwaysDisabledRule` or `alwaysHiddenRule`
      uiSchema.elements.push({
        type: "Control",
        scope: "/properties/type",
        rule: alwaysHiddenRule,
      });

      // Disable the schedule and force update controls
      scheduleControlElement.rule = alwaysDisabledRule;
      forceUpdateControlElement.rule = alwaysDisabledRule;

      // Add a notice to the bottom of the force update control
      forceUpdateControlElement.options.messages = [
        {
          type: UiSchemaMessageTypes.custom,
          display: "notice",
          kind: "warning",
          icon: "exclamation-mark-triangle",
          titleKey: `${i18nScope}.fields.schedule.unavailableNotice.title`,
          labelKey: `${i18nScope}.fields.schedule.unavailableNotice.body`,
          allowShowBeforeInteract: true,
          alwaysShow: true,
        },
      ] as IUiSchemaMessage[];
    }

    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.schedule.label`,
      elements: [scheduleControlElement, forceUpdateControlElement],
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
