import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubSite } from "../../core";
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
  // eslint-disable-next-line @typescript-eslint/require-await
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
                canSetAccessToPublic: true,
                canSetAccessToOrg: true,
                canSetAccessToPrivate: true,
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
            label: "Assistant Personality",
            scope: "/properties/assistant/properties/personality",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              placeholder: `{{${i18nScope}.assistant.fields.personality.placeholder:translate}}`,
              helperText: {
                label: `{{${i18nScope}.assistant.fields.personality.helperText:translate}}`,
              },
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
              control: "hub-field-input-multiselect",
              placeholder: `{{${i18nScope}.assistant.fields.examplePrompts.placeholder:translate}}`,
              allowCustomValues: true,
              helperText: {
                label: `{{${i18nScope}.assistant.fields.examplePrompts.helperText:translate}}`,
              },
            },
          },
        ],
      },
    ],
  };
};
