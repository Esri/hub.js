import type { IArcGISContext } from "../../../../types/IArcGISContext";
import { getWellKnownCatalog } from "../../../../search/wellKnownCatalog";
import {
  IUiSchema,
  UiSchemaMessageTypes,
  UiSchemaRuleEffects,
} from "../../types";
import { IEventGalleryCardEditorOptions } from "../EditorOptions";
import { fetchCategoriesUiSchemaElement } from "../fetchCategoriesUiSchemaElement";
import { getTagItems } from "../getTagItems";

export async function buildUiSchema(
  i18nScope: string,
  options: IEventGalleryCardEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> {
  const categoriesUiSchema = await fetchCategoriesUiSchemaElement(
    `${i18nScope}.content`,
    context
  );
  categoriesUiSchema[0].rules = [
    {
      effect: UiSchemaRuleEffects.SHOW,
      conditions: [
        {
          scope: "/properties/selectionMode",
          schema: { const: "dynamic" },
        },
      ],
    },
  ];
  delete categoriesUiSchema[0].options.helperText;
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        options: {
          section: "accordion",
          selectionMode: "single",
        },
        elements: [
          {
            type: "Section",
            label: `{{${i18nScope}.content.label:translate}}`,
            options: {
              section: "accordionItem",
              expanded: true,
            },
            elements: [
              {
                scope: "/properties/selectionMode",
                type: "Control",
                options: {
                  control: "hub-field-input-radio-group",
                  enum: {
                    i18nScope: `${i18nScope}.content.selectionMode`,
                  },
                  width: "full",
                },
              },
              {
                label: `{{${i18nScope}.content.access.label:translate}}`,
                scope: "/properties/access",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  descriptions: [
                    `{{${i18nScope}.content.access.private.description:translate}}`,
                    `{{${i18nScope}.content.access.org.description:translate}}`,
                    `{{${i18nScope}.content.access.public.description:translate}}`,
                  ],
                  icons: ["users", "organization", "globe"],
                  labels: [
                    `{{${i18nScope}.content.access.private.label:translate}}`,
                    `{{${i18nScope}.content.access.org.label:translate}}`,
                    `{{${i18nScope}.content.access.public.label:translate}}`,
                  ],
                  type: "checkbox",
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    conditions: [
                      {
                        scope: "/properties/selectionMode",
                        schema: { const: "dynamic" },
                      },
                    ],
                  },
                ],
              },
              {
                label: `{{${i18nScope}.content.tags.label:translate}}`,
                scope: "/properties/tags",
                type: "Control",
                options: {
                  control: "hub-field-input-combobox",
                  items: await getTagItems(
                    options.tags,
                    context.portal.id,
                    context.hubRequestOptions
                  ),
                  allowCustomValues: true,
                  selectionMode: "multiple",
                  placeholderIcon: "label",
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    conditions: [
                      {
                        scope: "/properties/selectionMode",
                        schema: { const: "dynamic" },
                      },
                    ],
                  },
                ],
              },
              ...categoriesUiSchema,
              {
                scope: "/properties/entityIds",
                type: "Control",
                options: {
                  control: "hub-field-input-gallery-picker",
                  targetEntity: "item",
                  catalogs: [
                    getWellKnownCatalog(
                      `${i18nScope}.content.entityIds`,
                      "organization",
                      "item",
                      {
                        user: context.currentUser,
                        collectionNames: ["site", "initiative", "project"],
                        filters: [],
                        context,
                      }
                    ),
                  ],
                  facets: [
                    {
                      label: "{{facets.from.label:translate}}",
                      key: "from",
                      display: "single-select",
                      operation: "OR",
                      options: [
                        {
                          label: "{{facets.from.myContent.label:translate}}",
                          key: "myContent",
                          selected: true,
                          predicates: [
                            {
                              owner: context.currentUser.username,
                            },
                          ],
                        },
                        {
                          label:
                            "{{facets.from.myOrganization.label:translate}}",
                          key: "myOrganization",
                          selected: false,
                          predicates: [
                            {
                              orgId: context.currentUser.orgId,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      label: "{{facets.sharing.label:translate}}",
                      key: "access",
                      field: "access",
                      display: "multi-select",
                      operation: "OR",
                    },
                  ],
                  width: "full",
                  kind: "brand",
                  appearance: "solid",
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    conditions: [
                      {
                        scope: "/properties/selectionMode",
                        schema: { const: "dynamic" },
                      },
                    ],
                  },
                ],
              },
              {
                scope: "/properties/eventIds",
                type: "Control",
                options: {
                  control: "hub-field-input-gallery-picker",
                  targetEntity: "event",
                  catalogs: [
                    {
                      schemaVersion: 1,
                      title: "{{catalogs.event.label:translate}}",
                      scopes: {
                        event: {
                          targetEntity: "event",
                          filters: [
                            {
                              predicates: [
                                { orgid: context.currentUser.orgId },
                              ],
                            },
                          ],
                        },
                      },
                      collections: [
                        {
                          key: "event",
                          label:
                            "{{catalogs.event.collections.event.label:translate}}",
                          targetEntity: "event",
                          include: [],
                          scope: {
                            targetEntity: "event",
                            filters: [
                              {
                                predicates: [],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                  facets: [
                    {
                      label: "{{facets.from.label:translate}}",
                      key: "from",
                      display: "single-select",
                      operation: "OR",
                      options: [
                        {
                          label: "{{facets.from.myContent.label:translate}}",
                          key: "myContent",
                          selected: true,
                          predicates: [
                            {
                              owner: (context.currentUser as any).id,
                            },
                          ],
                        },
                        {
                          label:
                            "{{facets.from.myOrganization.label:translate}}",
                          key: "myOrganization",
                          selected: false,
                          predicates: [
                            {
                              orgId: context.currentUser.orgId,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      label: "{{facets.sharing.label:translate}}",
                      key: "access",
                      display: "multi-select",
                      operation: "OR",
                      options: [
                        {
                          label: "{{facets.sharing.public.label:translate}}",
                          key: "public",
                          selected: false,
                          predicates: [
                            {
                              access: "public",
                            },
                          ],
                        },
                        {
                          label: "{{facets.sharing.private.label:translate}}",
                          key: "private",
                          selected: false,
                          predicates: [
                            {
                              access: "private",
                            },
                          ],
                        },
                        {
                          label:
                            "{{facets.sharing.organization.label:translate}}",
                          key: "org",
                          selected: false,
                          predicates: [
                            {
                              access: "org",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  width: "full",
                  kind: "brand",
                  appearance: "solid",
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    conditions: [
                      {
                        scope: "/properties/selectionMode",
                        schema: { const: "manual" },
                      },
                    ],
                  },
                ],
              },
              {
                type: "Slot",
                options: {
                  name: "add-content-slot",
                },
              },
            ],
          },
          {
            type: "Section",
            label: `{{${i18nScope}.appearance.label:translate}}`,
            options: {
              section: "accordionItem",
            },
            elements: [
              {
                label: `{{${i18nScope}.appearance.titleHeading.label:translate}}`,
                scope: "/properties/titleHeading",
                type: "Control",
                options: {
                  control: "hub-field-input-radio-group",
                  enum: {
                    i18nScope: `${i18nScope}.appearance.titleHeading`,
                  },
                  width: "full",
                  tooltip: {
                    label: `{{${i18nScope}.appearance.titleHeading.tooltip:translate}}`,
                  },
                },
              },
              {
                label: `{{${i18nScope}.appearance.corners.label:translate}}`,
                scope: "/properties/corners",
                type: "Control",
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `${i18nScope}.appearance.corners`,
                  },
                },
              },
              {
                label: `{{${i18nScope}.appearance.shadow.label:translate}}`,
                scope: "/properties/shadow",
                type: "Control",
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `${i18nScope}.appearance.shadow`,
                  },
                },
              },
              {
                label: `{{${i18nScope}.appearance.showAdditionalInfo.label:translate}}`,
                scope: "/properties/showAdditionalInfo",
                type: "Control",
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                },
              },
              {
                label: `{{${i18nScope}.appearance.layout.label:translate}}`,
                options: {
                  control: "hub-field-input-select",
                  enum: { i18nScope: `${i18nScope}.appearance.layout` },
                },
                scope: "/properties/layout",
                type: "Control",
              },
            ],
          },
          {
            type: "Section",
            label: `{{${i18nScope}.options.label:translate}}`,
            options: {
              section: "accordionItem",
            },
            elements: [
              {
                label: `{{${i18nScope}.options.openIn.label:translate}}`,
                scope: "/properties/openIn",
                type: "Control",
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `${i18nScope}.options.openIn`,
                  },
                },
              },
              {
                type: "Notice",
                options: {
                  notice: {
                    configuration: {
                      id: "open-in-notice",
                      noticeType: "notice",
                      closeable: false,
                      kind: "brand",
                      scale: "m",
                    },
                    title: `{{${i18nScope}.options.openIn.notice.title:translate}}`,
                    body: `{{${i18nScope}.options.openIn.notice.body:translate}}`,
                    autoShow: true,
                    actions: [
                      {
                        label: `{{${i18nScope}.options.openIn.notice.link:translate}}`,
                        ariaLabel: `{{${i18nScope}.options.openIn.notice.linkAriaLabel:translate}}`,
                        icon: "launch",
                        href: "https://www.w3.org/TR/WCAG20-TECHS/G200.html",
                        target: "_blank",
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
}
