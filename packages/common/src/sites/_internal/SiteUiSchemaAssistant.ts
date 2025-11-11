import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubSite } from "../../core/types/IHubSite";
import { IUiSchema } from "../../core/schemas/types";

/**
 * @private
 * constructs the edit uiSchema for assistants.
 * This defines how the schema properties should
 * be rendered in the assistant editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubSite>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  // NOTE: if this is not defined on the site then
  // the component will use the authenticated user's org
  // which may not be the same as the site's org
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        label: `{{${i18nScope}.assistant.sections.availability.label:translate}}`,
        elements: [
          {
            label: `{{${i18nScope}.assistant.fields.enabled.label:translate}}`,
            scope: "/properties/assistant/properties/enabled",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
            },
          },
          {
            label: `{{${i18nScope}.assistant.fields.access.label:translate}}`,
            scope: "/properties/assistant/properties/access",
            type: "Control",
            options: {
              control: "arcgis-hub-access-level-controls",
              itemType: "assistant",
              orgName: context.portal.name,
              accessOptions: {
                canSetAccessToPublic: options.access === "public",
                canSetAccessToOrg:
                  options.access === "org" || options.access === "public",
                canSetAccessToPrivate: true, // always allow private access
              },
            },
          },
          {
            label: `{{${i18nScope}.assistant.fields.accessGroups.label:translate}}`,
            scope: "/properties/assistant/properties/accessGroups",
            type: "Control",
            options: {
              control: "hub-field-input-gallery-picker",
              targetEntity: "group",
              helperText: {
                label: `{{${i18nScope}.assistant.fields.accessGroups.helperText:translate}}`,
              },
              catalogs: [
                {
                  schemaVersion: 1,
                  scopes: {
                    group: {
                      targetEntity: "group",
                      filters: [
                        {
                          predicates: [
                            {
                              capabilities: {
                                not: ["updateitemcontrol"],
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                  collections: [
                    {
                      targetEntity: "group",
                      scope: {
                        targetEntity: "group",
                        filters: [
                          {
                            predicates: [
                              {
                                q: "*",
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
              facets: [
                {
                  label: `{{${i18nScope}.assistant.fields.accessGroups.facets.label.from:translate}}`,
                  display: "single-select",
                  operation: "OR",
                  options: [
                    {
                      label: `{{${i18nScope}.assistant.fields.accessGroups.facets.label.group:translate}}`,
                      selected: true,
                      predicates: [
                        {
                          owner: context.currentUser.username,
                        },
                      ],
                    },
                    {
                      label: `{{${i18nScope}.assistant.fields.accessGroups.facets.label.org:translate}}`,
                      selected: false,
                      predicates: [
                        {
                          orgid: context.currentUser.orgId,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        label: `{{${i18nScope}.assistant.sections.details.label:translate}}`,
        options: {
          helperText: {
            label: `{{${i18nScope}.assistant.sections.details.helperText:translate}}`,
          },
        },
        elements: [
          {
            label: `{{${i18nScope}.assistant.fields.description.label:translate}}`,
            scope: "/properties/assistant/properties/description",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              placeholder: `{{${i18nScope}.assistant.fields.description.placeholder:translate}}`,
              helperText: {
                label: `{{${i18nScope}.assistant.fields.description.helperText:translate}}`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.description.requiredError:translate}}`,
                },
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.description.maxLengthError:translate}}`,
                },
              ],
            },
          },
          {
            label: `{{${i18nScope}.assistant.fields.location.label:translate}}`,
            scope: "/properties/assistant/properties/location",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              placeholder: `{{${i18nScope}.assistant.fields.location.placeholder:translate}}`,
              helperText: {
                label: `{{${i18nScope}.assistant.fields.location.helperText:translate}}`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.location.requiredError:translate}}`,
                },
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.location.maxLengthError:translate}}`,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        label: `{{${i18nScope}.assistant.sections.personality.label:translate}}`,
        options: {
          helperText: {
            label: `{{${i18nScope}.assistant.sections.personality.helperText:translate}}`,
          },
        },
        elements: [
          {
            label: `{{${i18nScope}.assistant.fields.personality.label:translate}}`,
            scope: "/properties/assistant/properties/personality",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              placeholder: `{{${i18nScope}.assistant.fields.personality.placeholder:translate}}`,
              helperText: {
                label: `{{${i18nScope}.assistant.fields.personality.helperText:translate}}`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.personality.requiredError:translate}}`,
                },
                {
                  type: "ERROR",
                  keyword: "maxLength",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.personality.maxLengthError:translate}}`,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        label: `{{${i18nScope}.assistant.sections.prompts.label:translate}}`,
        options: {
          helperText: {
            label: `{{${i18nScope}.assistant.sections.prompts.helperText:translate}}`,
          },
        },
        elements: [
          {
            label: `{{${i18nScope}.assistant.fields.examplePrompts.label:translate}}`,
            scope: "/properties/assistant/properties/examplePrompts",
            type: "Control",
            options: {
              control: "hub-field-input-list",
              allowEdit: true,
              allowAdd: true,
              allowDelete: true,
              allowReorder: true,
              addItemButtonWidth: "fit",
              helperText: {
                label: `{{${i18nScope}.assistant.fields.examplePrompts.helperText:translate}}`,
              },
              addItemLabel: `{{${i18nScope}.assistant.sections.prompts.addPromptLabel:translate}}`,
              newItemModalTitle: `{{${i18nScope}.assistant.sections.prompts.modal.newPromptModalHeader:translate}}`,
              editItemModalTitle: `{{${i18nScope}.assistant.sections.prompts.modal.editPromptModalHeader:translate}}`,
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.examplePrompts.requiredError:translate}}`,
                },
                {
                  type: "ERROR",
                  keyword: "maxItems",
                  icon: true,
                  label: `{{${i18nScope}.assistant.fields.examplePrompts.maxItemsError:translate}}`,
                },
              ],
              editSchema: {
                type: "object",
                required: ["label"],
                properties: {
                  label: {
                    type: "string",
                    maxLength: 100,
                  },
                },
              },
              editUiSchema: {
                type: "Layout",
                elements: [
                  {
                    scope: "/properties/label",
                    type: "Control",
                    options: {
                      control: "hub-field-input-input",
                      placeholder: `{{${i18nScope}.assistant.fields.examplePrompts.placeholder:translate}}`,
                      helperText: {
                        label: `{{${i18nScope}.assistant.fields.examplePrompts.helperText:translate}}`,
                      },
                      messages: [
                        {
                          type: "ERROR",
                          keyword: "required",
                          icon: true,
                          label: `{{${i18nScope}.assistant.fields.examplePrompts.requiredError:translate}}`,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        type: "Section",
        label: `{{${i18nScope}.assistant.sections.workflows.label:translate}}`,
        options: {
          helperText: {
            label: `{{${i18nScope}.assistant.sections.workflows.helperText:translate}}`,
          },
        },
        elements: [
          {
            scope: "/properties/assistant/properties/workflows",
            type: "Control",
            options: {
              control: "hub-field-input-list",
              allowEdit: true,
              allowAdd: true,
              allowDelete: true,
              addItemButtonWidth: "fit",
              addItemLabel: `{{${i18nScope}.assistant.sections.workflows.addWorkflowLabel:translate}}`,
              newItemModalTitle: `{{${i18nScope}.assistant.sections.workflows.modal.newWorkflowModalHeader:translate}}`,
              editItemModalTitle: `{{${i18nScope}.assistant.sections.workflows.modal.editWorkflowModalHeader:translate}}`,
              // use "action" as the description for the workflow
              descriptionProp: "action",
              descriptionPropPostfix: `{{${i18nScope}.assistant.sections.workflows.descriptionPropPostfix:translate}}`,
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  label: `{{${i18nScope}.assistant.sections.workflows.requiredError:translate}}`,
                },
                {
                  type: "ERROR",
                  keyword: "maxItems",
                  icon: true,
                  label: `{{${i18nScope}.assistant.sections.workflows.maxItemsError:translate}}`,
                },
              ],
              editSchema: {
                type: "object",
                required: ["label", "description", "action"],
                properties: {
                  label: {
                    type: "string",
                    maxLength: 200,
                  },
                  description: {
                    type: "string",
                    maxLength: 1000,
                  },
                  action: {
                    type: "string",
                    enum: ["search", "respond"],
                    default: "search",
                  },
                  response: {
                    type: "string",
                    maxLength: 1000,
                  },
                },
                allOf: [
                  {
                    if: {
                      properties: { action: { const: "respond" } },
                    },
                    then: {
                      required: ["response"],
                    },
                  },
                ],
              },
              editUiSchema: {
                type: "Layout",
                elements: [
                  {
                    label: `{{${i18nScope}.assistant.sections.workflows.modal.title:translate}}`,
                    scope: "/properties/label",
                    type: "Control",
                    options: {
                      control: "hub-field-input-input",
                      messages: [
                        {
                          type: "ERROR",
                          keyword: "required",
                          icon: true,
                          label: `{{${i18nScope}.assistant.sections.workflows.modal.titleRequiredError:translate}}`,
                        },
                        {
                          type: "ERROR",
                          keyword: "maxLength",
                          icon: true,
                          label: `{{${i18nScope}.assistant.sections.workflows.modal.titleMaxLengthError:translate}}`,
                        },
                      ],
                    },
                  },
                  {
                    label: `{{${i18nScope}.assistant.sections.workflows.modal.description:translate}}`,
                    scope: "/properties/description",
                    type: "Control",
                    options: {
                      control: "hub-field-input-input",
                      messages: [
                        {
                          type: "ERROR",
                          keyword: "required",
                          icon: true,
                          label: `{{${i18nScope}.assistant.sections.workflows.modal.descriptionRequiredError:translate}}`,
                        },
                        {
                          type: "ERROR",
                          keyword: "maxLength",
                          icon: true,
                          label: `{{${i18nScope}.assistant.sections.workflows.modal.descriptionMaxLengthError:translate}}`,
                        },
                      ],
                    },
                  },
                  {
                    label: `{{${i18nScope}.assistant.sections.workflows.modal.action.title:translate}}`,
                    scope: "/properties/action",
                    type: "Control",
                    options: {
                      control: "hub-field-input-tile-select",
                      layout: "horizontal",
                      icons: ["search", "speech-bubble"],
                      labels: [
                        `{{${i18nScope}.assistant.sections.workflows.modal.action.search:translate}}`,
                        `{{${i18nScope}.assistant.sections.workflows.modal.action.respond:translate}}`,
                      ],
                      descriptions: [
                        `{{${i18nScope}.assistant.sections.workflows.modal.action.searchDescription:translate}}`,
                        `{{${i18nScope}.assistant.sections.workflows.modal.action.respondDescription:translate}}`,
                      ],
                    },
                  },
                  {
                    label: `{{${i18nScope}.assistant.sections.workflows.modal.action.response:translate}}`,
                    scope: "/properties/response",
                    type: "Control",
                    options: {
                      control: "hub-field-input-input",
                      messages: [
                        {
                          type: "ERROR",
                          keyword: "required",
                          icon: true,
                          label: `{{${i18nScope}.assistant.sections.workflows.modal.action.responseRequiredError:translate}}`,
                        },
                        {
                          type: "ERROR",
                          keyword: "maxLength",
                          icon: true,
                          label: `{{${i18nScope}.assistant.sections.workflows.modal.action.responseMaxLengthError:translate}}`,
                        },
                      ],
                    },
                    rule: {
                      effect: "HIDE",
                      condition: {
                        scope: "/properties/action",
                        schema: { const: "search" },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      // uncomment this for test prompts
      // {
      //   type: "Section",
      //   label: `{{${i18nScope}.assistant.sections.testPrompts.label:translate}}`,
      //   options: {
      //     helperText: {
      //       label: `{{${i18nScope}.assistant.sections.testPrompts.helperText:translate}}`,
      //     },
      //   },
      //   elements: [
      //     {
      //       scope: "/properties/assistant/properties/testPrompts",
      //       type: "Control",
      //       options: {
      //         control: "hub-field-input-list",
      //         allowEdit: true,
      //         allowAdd: true,
      //         allowDelete: true,
      //         addItemButtonWidth: "fit",
      //         addItemLabel: `{{${i18nScope}.assistant.sections.testPrompts.addTestPromptLabel:translate}}`,
      //         newItemModalTitle: `{{${i18nScope}.assistant.sections.testPrompts.modal.newTestPromptModalHeader:translate}}`,
      //         editItemModalTitle: `{{${i18nScope}.assistant.sections.testPrompts.modal.editTestPromptModalHeader:translate}}`,
      //         editSchema: {
      //           type: "object",
      //           required: ["label"],
      //           properties: {
      //             label: {
      //               type: "string",
      //               maxLength: 120,
      //             },
      //           },
      //         },
      //         editUiSchema: {
      //           type: "Layout",
      //           elements: [
      //             {
      //               label: `{{${i18nScope}.assistant.sections.testPrompts.modal.title:translate}}`,
      //               scope: "/properties/label",
      //               type: "Control",
      //               options: {
      //                 control: "hub-field-input-input",
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   ],
      // },
    ],
  };
};
