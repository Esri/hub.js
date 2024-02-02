import { IArcGISContext } from "../../../../ArcGISContext";
import { IUiSchema, UiSchemaRuleEffects } from "../../types";
import { IActionCardEditorOptions } from "../EditorOptions";
import { getFeaturedContentCatalogs } from "../getFeaturedContentCatalogs";
import { buildUiSchema as buildFollowUiSchema } from '../follow/ProjectUiSchemaFollow';

export const buildUiSchema = (
  i18nScope: string,
  config: IActionCardEditorOptions,
  context: IArcGISContext
): IUiSchema => {
  return {
    type: 'Layout',
    elements: [
      {
        type: 'Section',
        labelKey: 'linkEditor.title',
        options: {
          section: "card",
          actions: [
            {
              action: "delete",
              slot: "footer-start",
              label: "Delete",
              kind: "danger",
              appearance: "outline",
              round: true
            },
            {
              action: "cancel",
              slot: "footer-end",
              label: "Cancel",
              appearance: "outline",
              round: true
            },
            {
              action: "save",
              slot: "footer-end",
              label: "Save",
              round: true,
              disableWhenInvalid: true
            }
          ]
        },
        elements: [
          {
            scope: '/properties/source',
            type: 'Control',
            options: {
              control: 'hub-field-input-radio',
              labels: [ "{{linkEditor.link.source.external.label:translate}}", "{{linkEditor.link.source.content.label:translate}}", "{{linkEditor.link.source.action.label:translate}}" ]
            }
          },
          {
            scope: '/properties/label',
            labelKey: 'linkEditor.link.label.label',
            type: 'Control',
            rule: {
              effect: UiSchemaRuleEffects.HIDE,
              condition: {
                scope: '/properties/source',
                schema: { const: 'action' }
              }
            },
            options: {
              helperText: {
                labelKey: 'linkEditor.link.label.helperText.button'
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: 'linkEditor.link.label.requiredError',
                },
              ],
            }
          },
          {
            scope: '/properties/href',
            labelKey: 'linkEditor.link.href.label',
            type: 'Control',
            rule: {
              effect: UiSchemaRuleEffects.SHOW,
              condition: {
                scope: '/properties/source',
                schema: { const: 'external' }
              }
            },
            options: {
              messages: [
                {
                  type: "ERROR",
                  keyword: "minLength",
                  icon: true,
                  labelKey: 'linkEditor.link.href.requiredError',
                },
                {
                  type: "ERROR",
                  keyword: "format",
                  icon: true,
                  labelKey: 'linkEditor.link.href.formatError',
                },
                {
                  type: "ERROR",
                  keyword: "if",
                  hidden: true,
                },
              ]
            }
          },
          {
            scope: '/properties/contentId',
            labelKey: 'linkEditor.link.contentId.label',
            type: 'Control',
            rule: {
              effect: UiSchemaRuleEffects.SHOW,
              condition: {
                scope: '/properties/source',
                schema: { const: 'content' }
              }
            },
            options: {
              control: 'hub-field-input-gallery-picker',
              targetEntity: "item",
              catalogs: getFeaturedContentCatalogs(context.currentUser),
              facets: [
                {
                  label: `{{${i18nScope}.fields.callToAction.facets.type:translate}}`,
                  key: "type",
                  display: "multi-select",
                  field: "type",
                  options: [],
                  operation: "OR",
                  aggLimit: 100,
                },
                {
                  label: `{{${i18nScope}.fields.callToAction.facets.sharing:translate}}`,
                  key: "access",
                  display: "multi-select",
                  field: "access",
                  options: [],
                  operation: "OR",
                },
              ],
              messages: [
                {
                  type: "ERROR",
                  // matches the error keyword when contentId is conditionally required
                  keyword: "not",
                  icon: true,
                  labelKey: 'linkEditor.link.contentId.requiredError',
                },
              ],
            }
          },
          {
            scope: '/properties/action',
            labelKey: 'linkEditor.link.action.label',
            type: 'Control',
            rule: {
              effect: UiSchemaRuleEffects.SHOW,
              condition: {
                scope: '/properties/source',
                schema: { const: 'action' }
              }
            },
            options: {
              control: 'hub-field-input-combobox',
              selectionMode: "single",
              items: [
                { value: "follow", label: "{{linkEditor.link.action.follow:translate}}", icon: "walking" },
                { value: "share", label: "{{linkEditor.link.action.share:translate}}", icon: "share" }
              ]
            },
          },
          ...buildFollowUiSchema(i18nScope, config, context).elements
        ]
      }
    ]
  }
}