import {
  IArcGISContext,
  IHubCatalog,
  IUiSchemaComboboxItem,
  IUiSchemaElement,
  UiSchemaRuleEffects,
} from "../../../../../src";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/events/EventGalleryCardUiSchema";
import * as getTagItemsModule from "../../../../../src/core/schemas/internal/getTagItems";
import * as fetchCategoriesUiSchemaElementModule from "../../../../../src/core/schemas/internal/fetchCategoriesUiSchemaElement";
import * as wellKnownCatalogModule from "../../../../../src/search/wellKnownCatalog";

describe("EventGalleryCardUiSchema", () => {
  describe("buildUiSchema", () => {
    it("should resolve a IUiSchema for the event gallery card editor", async () => {
      const context = {
        portal: { id: "portal-1" },
        hubRequestOptions: { isPortal: false },
        currentUser: { id: "31c", username: "jdoe", orgId: "portal-1" },
      } as unknown as IArcGISContext;
      const tags = ["tag1", "tag2"];
      const comboboxItems = [
        {
          value: "abc",
          label: "ABC",
          icon: "gear",
          selected: true,
          children: [],
        } as IUiSchemaComboboxItem,
      ];
      const categoriesUiSchemaElement = {
        type: "Control",
        scope: "/properties/categories",
        rules: [],
        options: {},
        label: "Categories",
      } as IUiSchemaElement;
      const catalog = {
        title: "My catalog",
        scopes: {},
        collections: [],
        schemaVersion: 1,
      } as IHubCatalog;
      const getTagItemsSpy = spyOn(
        getTagItemsModule,
        "getTagItems"
      ).and.returnValue(Promise.resolve(comboboxItems));
      const fetchCategoriesUiSchemaElementSpy = spyOn(
        fetchCategoriesUiSchemaElementModule,
        "fetchCategoriesUiSchemaElement"
      ).and.returnValue(Promise.resolve(categoriesUiSchemaElement));
      const getWellKnownCatalogSpy = spyOn(
        wellKnownCatalogModule,
        "getWellKnownCatalog"
      ).and.returnValue(catalog);
      const result = await buildUiSchema("some.scope", { tags }, context);
      expect(fetchCategoriesUiSchemaElementSpy).toHaveBeenCalledTimes(1);
      expect(fetchCategoriesUiSchemaElementSpy).toHaveBeenCalledWith(
        "some.scope.content",
        context
      );
      expect(getWellKnownCatalogSpy).toHaveBeenCalledTimes(1);
      expect(getWellKnownCatalogSpy).toHaveBeenCalledWith(
        "some.scope.content.entityIds",
        "organization",
        "item",
        {
          user: context.currentUser,
          collectionNames: ["site", "initiative", "project"],
          filters: [],
          context,
        }
      );
      expect(getTagItemsSpy).toHaveBeenCalledTimes(1);
      expect(getTagItemsSpy).toHaveBeenCalledWith(
        tags,
        context.portal.id,
        context.hubRequestOptions
      );
      expect(result).toEqual({
        type: "Layout",
        elements: [
          {
            type: "Section",
            options: { section: "accordion", selectionMode: "single" },
            elements: [
              {
                type: "Section",
                label: "{{some.scope.content.label:translate}}",
                options: { section: "accordionItem", expanded: true },
                elements: [
                  {
                    scope: "/properties/selectionMode",
                    type: "Control",
                    options: {
                      control: "hub-field-input-radio-group",
                      enum: { i18nScope: "some.scope.content.selectionMode" },
                      width: "full",
                    },
                  },
                  {
                    label: "{{some.scope.content.access.label:translate}}",
                    scope: "/properties/access",
                    type: "Control",
                    options: {
                      control: "hub-field-input-tile-select",
                      descriptions: [
                        "{{some.scope.content.access.private.description:translate}}",
                        "{{some.scope.content.access.org.description:translate}}",
                        "{{some.scope.content.access.public.description:translate}}",
                      ],
                      icons: ["users", "organization", "globe"],
                      labels: [
                        "{{some.scope.content.access.private.label:translate}}",
                        "{{some.scope.content.access.org.label:translate}}",
                        "{{some.scope.content.access.public.label:translate}}",
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
                    label: "{{some.scope.content.tags.label:translate}}",
                    scope: "/properties/tags",
                    type: "Control",
                    options: {
                      control: "hub-field-input-combobox",
                      items: comboboxItems,
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
                  {
                    ...categoriesUiSchemaElement,
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
                    scope: "/properties/entityIds",
                    type: "Control",
                    options: {
                      control: "hub-field-input-gallery-picker",
                      targetEntity: "item",
                      catalogs: [catalog],
                      facets: [
                        {
                          label: "{{facets.from.label:translate}}",
                          key: "from",
                          display: "single-select",
                          operation: "OR",
                          options: [
                            {
                              label:
                                "{{facets.from.myContent.label:translate}}",
                              key: "myContent",
                              selected: true,
                              predicates: [{ owner: "jdoe" }],
                            },
                            {
                              label:
                                "{{facets.from.myOrganization.label:translate}}",
                              key: "myOrganization",
                              selected: false,
                              predicates: [{ orgId: "portal-1" }],
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
                                { predicates: [{ orgid: "portal-1" }] },
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
                                filters: [{ predicates: [] }],
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
                              label:
                                "{{facets.from.myContent.label:translate}}",
                              key: "myContent",
                              selected: true,
                              predicates: [{ owner: "31c" }],
                            },
                            {
                              label:
                                "{{facets.from.myOrganization.label:translate}}",
                              key: "myOrganization",
                              selected: false,
                              predicates: [{ orgId: "portal-1" }],
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
                              label:
                                "{{facets.sharing.public.label:translate}}",
                              key: "public",
                              selected: false,
                              predicates: [{ access: "public" }],
                            },
                            {
                              label:
                                "{{facets.sharing.private.label:translate}}",
                              key: "private",
                              selected: false,
                              predicates: [{ access: "private" }],
                            },
                            {
                              label:
                                "{{facets.sharing.organization.label:translate}}",
                              key: "org",
                              selected: false,
                              predicates: [{ access: "org" }],
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
                ],
              },
              {
                type: "Section",
                label: "{{some.scope.appearance.label:translate}}",
                options: { section: "accordionItem" },
                elements: [
                  {
                    label:
                      "{{some.scope.appearance.titleHeading.label:translate}}",
                    scope: "/properties/titleHeading",
                    type: "Control",
                    options: {
                      control: "hub-field-input-radio-group",
                      enum: { i18nScope: "some.scope.appearance.titleHeading" },
                      width: "full",
                      tooltip: {
                        label:
                          "{{some.scope.appearance.titleHeading.tooltip:translate}}",
                      },
                    },
                  },
                  {
                    label: "{{some.scope.appearance.corners.label:translate}}",
                    scope: "/properties/corners",
                    type: "Control",
                    options: {
                      control: "hub-field-input-select",
                      enum: { i18nScope: "some.scope.appearance.corners" },
                    },
                  },
                  {
                    label: "{{some.scope.appearance.shadow.label:translate}}",
                    scope: "/properties/shadow",
                    type: "Control",
                    options: {
                      control: "hub-field-input-select",
                      enum: { i18nScope: "some.scope.appearance.shadow" },
                    },
                  },
                  {
                    label:
                      "{{some.scope.appearance.showAdditionalInfo.label:translate}}",
                    scope: "/properties/showAdditionalInfo",
                    type: "Control",
                    options: {
                      control: "hub-field-input-switch",
                      layout: "inline-space-between",
                    },
                  },
                ],
              },
              {
                type: "Section",
                label: "{{some.scope.options.label:translate}}",
                options: { section: "accordionItem" },
                elements: [
                  {
                    label: "{{some.scope.options.openIn.label:translate}}",
                    scope: "/properties/openIn",
                    type: "Control",
                    options: {
                      control: "hub-field-input-select",
                      enum: { i18nScope: "some.scope.options.openIn" },
                      messages: [
                        {
                          type: "CUSTOM",
                          display: "notice",
                          kind: "brand",
                          titleKey: "some.scope.options.openIn.notice.title",
                          label:
                            "{{some.scope.options.openIn.notice.body:translate}}",
                          link: {
                            kind: "external",
                            label:
                              "{{some.scope.options.openIn.notice.link:translate}}",
                            href: "https://www.w3.org/TR/WCAG20-TECHS/G200.html",
                            target: "_blank",
                          },
                          allowShowBeforeInteract: true,
                          alwaysShow: true,
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });
});
