import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaAssistant";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: site assistant", () => {
  it("returns the full site assistant uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          label: `{{some.scope.assistant.sections.availability.label:translate}}`,
          elements: [
            {
              label: `{{some.scope.assistant.fields.enabled.label:translate}}`,
              scope: "/properties/assistant/properties/enabled",
              type: "Control",
              options: {
                control: "hub-field-input-switch",
                layout: "inline-space-between",
              },
            },
            {
              label: `{{some.scope.assistant.fields.access.label:translate}}`,
              scope: "/properties/assistant/properties/access",
              type: "Control",
              options: {
                control: "arcgis-hub-access-level-controls",
                itemType: "assistant",
                orgName: MOCK_CONTEXT.portal.name,
                accessOptions: {
                  canSetAccessToPublic: true,
                  canSetAccessToOrg: true,
                  canSetAccessToPrivate: true,
                },
              },
            },
            {
              label: `{{some.scope.assistant.fields.accessGroups.label:translate}}`,
              scope: "/properties/assistant/properties/accessGroups",
              type: "Control",
              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "group",
                helperText: {
                  label: `{{some.scope.assistant.fields.accessGroups.helperText:translate}}`,
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
                    label: `{{some.scope.assistant.fields.accessGroups.facets.label.from:translate}}`,
                    display: "single-select",
                    operation: "OR",
                    options: [
                      {
                        label: `{{some.scope.assistant.fields.accessGroups.facets.label.group:translate}}`,
                        selected: true,
                        predicates: [
                          {
                            owner: MOCK_CONTEXT.currentUser.username,
                          },
                        ],
                      },
                      {
                        label: `{{some.scope.assistant.fields.accessGroups.facets.label.org:translate}}`,
                        selected: false,
                        predicates: [
                          {
                            orgid: MOCK_CONTEXT.currentUser.orgId,
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
          label: `{{some.scope.assistant.sections.details.label:translate}}`,
          options: {
            helperText: {
              label: `{{some.scope.assistant.sections.details.helperText:translate}}`,
            },
          },
          elements: [
            {
              label: `{{some.scope.assistant.fields.description.label:translate}}`,
              scope: "/properties/assistant/properties/description",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                placeholder: `{{some.scope.assistant.fields.description.placeholder:translate}}`,
                helperText: {
                  label: `{{some.scope.assistant.fields.description.helperText:translate}}`,
                },
              },
            },
            {
              label: `{{some.scope.assistant.fields.location.label:translate}}`,
              scope: "/properties/assistant/properties/location",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                placeholder: `{{some.scope.assistant.fields.location.placeholder:translate}}`,
                helperText: {
                  label: `{{some.scope.assistant.fields.location.helperText:translate}}`,
                },
              },
            },
          ],
        },
        {
          type: "Section",
          label: `{{some.scope.assistant.sections.personality.label:translate}}`,
          options: {
            helperText: {
              label: `{{some.scope.assistant.sections.personality.helperText:translate}}`,
            },
          },
          elements: [
            {
              label: "Assistant Personality",
              scope: "/properties/assistant/properties/personality",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                placeholder: `{{some.scope.assistant.fields.personality.placeholder:translate}}`,
                helperText: {
                  label: `{{some.scope.assistant.fields.personality.helperText:translate}}`,
                },
              },
            },
          ],
        },
        {
          type: "Section",
          label: `{{some.scope.assistant.sections.prompts.label:translate}}`,
          options: {
            helperText: {
              label: `{{some.scope.assistant.sections.prompts.helperText:translate}}`,
            },
          },
          elements: [
            {
              label: `{{some.scope.assistant.fields.examplePrompts.label:translate}}`,
              scope: "/properties/assistant/properties/examplePrompts",
              type: "Control",
              options: {
                control: "hub-field-input-multiselect",
                placeholder: `{{some.scope.assistant.fields.examplePrompts.placeholder:translate}}`,
                allowCustomValues: true,
                helperText: {
                  label: `{{some.scope.assistant.fields.examplePrompts.helperText:translate}}`,
                },
              },
            },
          ],
        },
        {
          type: "Section",
          label: `{{some.scope.assistant.sections.workflows.label:translate}}`,
          options: {
            helperText: {
              label: `{{some.scope.assistant.sections.workflows.helperText:translate}}`,
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
                addItemLabel: `{{some.scope.assistant.sections.workflows.addWorkflowLabel:translate}}`,
                newItemModalTitle: `{{some.scope.assistant.sections.workflows.modal.newWorkflowModalHeader:translate}}`,
                editItemModalTitle: `{{some.scope.assistant.sections.workflows.modal.editWorkflowModalHeader:translate}}`,
                // use "action" as the description for the workflow
                descriptionProp: "action",
                descriptionPropPostfix: `{{some.scope.assistant.sections.workflows.descriptionPropPostfix:translate}}`,
                editSchema: {
                  type: "object",
                  required: ["label", "description", "action"],
                  properties: {
                    label: {
                      type: "string",
                      maxLength: 120,
                    },
                    description: {
                      type: "string",
                    },
                    action: {
                      type: "string",
                      enum: ["search", "respond"],
                      default: "search",
                    },
                    response: {
                      type: "string",
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
                      label: `{{some.scope.assistant.sections.workflows.modal.title:translate}}`,
                      scope: "/properties/label",
                      type: "Control",
                      options: {
                        control: "hub-field-input-input",
                      },
                    },
                    {
                      label: `{{some.scope.assistant.sections.workflows.modal.description:translate}}`,
                      scope: "/properties/description",
                      type: "Control",
                      options: {
                        control: "hub-field-input-input",
                      },
                    },
                    {
                      label: `{{some.scope.assistant.sections.workflows.modal.action.title:translate}}`,
                      scope: "/properties/action",
                      type: "Control",
                      options: {
                        control: "hub-field-input-tile-select",
                        layout: "horizontal",
                        icons: ["search", "speech-bubble"],
                        labels: [
                          `{{some.scope.assistant.sections.workflows.modal.action.search:translate}}`,
                          `{{some.scope.assistant.sections.workflows.modal.action.respond:translate}}`,
                        ],
                        descriptions: [
                          `{{some.scope.assistant.sections.workflows.modal.action.searchDescription:translate}}`,
                          `{{some.scope.assistant.sections.workflows.modal.action.respondDescription:translate}}`,
                        ],
                      },
                    },
                    {
                      label: `{{some.scope.assistant.sections.workflows.modal.action.response:translate}}`,
                      scope: "/properties/response",
                      type: "Control",
                      options: {
                        control: "hub-field-input-input",
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
      ],
    });
  });
});
