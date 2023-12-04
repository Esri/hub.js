import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaCreate";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { UiSchemaRuleEffects } from "../../../src";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getSharableGroupsComboBoxItemsModule from "../../../src/core/schemas/internal/getSharableGroupsComboBoxItems";
import * as checkPermissionModule from "../../../src/permissions/checkPermission";
import * as getAuthedImageUrlModule from "../../../src/core/_internal/getAuthedImageUrl";

describe("buildUiSchema: initiative create", () => {
  it("returns the full initiative create uiSchema", async () => {
    spyOn(getLocationExtentModule, "getLocationExtent").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getLocationOptionsModule, "getLocationOptions").and.returnValue(
      Promise.resolve([])
    );
    spyOn(
      getSharableGroupsComboBoxItemsModule,
      "getSharableGroupsComboBoxItems"
    ).and.returnValue([]);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue(false);
    spyOn(getAuthedImageUrlModule, "getAuthedImageUrl").and.returnValue(
      "https://some-image-url.com"
    );

    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          options: { section: "stepper", scale: "l" },
          elements: [
            {
              type: "Step",
              labelKey: "some.scope.sections.details.label",
              elements: [
                {
                  type: "Section",
                  labelKey: "some.scope.sections.basicInfo.label",
                  elements: [
                    {
                      labelKey: "some.scope.fields.name.label",
                      scope: "/properties/name",
                      type: "Control",
                      options: {
                        messages: [
                          {
                            type: "ERROR",
                            keyword: "required",
                            icon: true,
                            labelKey: "some.scope.fields.name.requiredError",
                          },
                          {
                            type: "ERROR",
                            keyword: "maxLength",
                            icon: true,
                            labelKey: "some.scope.fields.name.maxLengthError",
                          },
                        ],
                      },
                    },
                    {
                      labelKey: "some.scope.fields.summary.label",
                      scope: "/properties/summary",
                      type: "Control",
                      options: {
                        control: "hub-field-input-input",
                        type: "textarea",
                        rows: 4,
                        helperText: {
                          labelKey: "some.scope.fields.summary.helperText",
                        },
                        messages: [
                          {
                            type: "ERROR",
                            keyword: "maxLength",
                            icon: true,
                            labelKey: "shared.fields.purpose.maxLengthError",
                          },
                        ],
                      },
                    },
                    {
                      labelKey: "some.scope.fields.hero.label",
                      scope: "/properties/view/properties/hero",
                      type: "Control",
                      options: {
                        control: "hub-field-input-tile-select",
                        layout: "horizontal",
                        helperText: {
                          labelKey: "some.scope.fields.hero.helperText",
                        },
                        labels: [
                          "{{some.scope.fields.hero.map.label:translate}}",
                          "{{some.scope.fields.hero.image.label:translate}}",
                        ],
                        descriptions: [
                          "{{some.scope.fields.hero.map.description:translate}}",
                          "{{some.scope.fields.hero.map.description:translate}}",
                        ],
                        icons: ["map-pin", "image"],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "Step",
              labelKey: "some.scope.sections.hero.label",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/name",
                  schema: { const: "" },
                },
              },
              elements: [
                {
                  type: "Section",
                  labelKey: "some.scope.sections.location.label",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: { const: "image" },
                    },
                  },
                  options: {
                    helperText: {
                      labelKey: "some.scope.sections.location.helperText",
                    },
                  },
                  elements: [
                    {
                      scope: "/properties/location",
                      type: "Control",
                      options: {
                        control: "hub-field-input-location-picker",
                        extent: [],
                        options: [],
                      },
                    },
                  ],
                },
                {
                  labelKey: "some.scope.fields.featuredImage.label",
                  scope: "/properties/view/properties/featuredImage",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: { const: "map" },
                    },
                  },
                  options: {
                    control: "hub-field-input-image-picker",
                    imgSrc: "https://some-image-url.com",
                    maxWidth: 727,
                    maxHeight: 484,
                    aspectRatio: 1.5,
                    helperText: {
                      labelKey: "some.scope.fields.featuredImage.helperText",
                    },
                    sizeDescription: {
                      labelKey:
                        "some.scope.fields.featuredImage.sizeDescription",
                    },
                  },
                },
                {
                  labelKey: "some.scope.fields.featuredImage.altText.label",
                  scope: "/properties/view/properties/featuredImageAltText",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: { const: "map" },
                    },
                  },
                  options: {
                    helperText: {
                      labelKey:
                        "some.scope.fields.featuredImage.altText.helperText",
                    },
                  },
                },
              ],
            },
            {
              type: "Step",
              labelKey: "some.scope.sections.sharing.label",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/name",
                  schema: { const: "" },
                },
              },
              elements: [
                {
                  scope: "/properties/access",
                  type: "Control",
                  options: {
                    control: "arcgis-hub-access-level-controls",
                    orgName: "My org",
                    itemType: "{{some.scope.fields.access.itemType:translate}}",
                  },
                },
                {
                  labelKey: "some.scope.fields.groups.label",
                  scope: "/properties/_groups",
                  type: "Control",
                  options: {
                    control: "hub-field-input-combobox",
                    items: [],
                    disabled: true,
                    allowCustomValues: false,
                    selectionMode: "multiple",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it("returns the full initiative create uiSchema", async () => {
    spyOn(getLocationExtentModule, "getLocationExtent").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getLocationOptionsModule, "getLocationOptions").and.returnValue(
      Promise.resolve([])
    );
    spyOn(
      getSharableGroupsComboBoxItemsModule,
      "getSharableGroupsComboBoxItems"
    ).and.returnValue([]);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue(false);
    spyOn(getAuthedImageUrlModule, "getAuthedImageUrl").and.returnValue(
      "https://some-image-url.com"
    );

    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        view: {
          featuredImageUrl: "https://some-image-url.com",
        },
      } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          options: { section: "stepper", scale: "l" },
          elements: [
            {
              type: "Step",
              labelKey: "some.scope.sections.details.label",
              elements: [
                {
                  type: "Section",
                  labelKey: "some.scope.sections.basicInfo.label",
                  elements: [
                    {
                      labelKey: "some.scope.fields.name.label",
                      scope: "/properties/name",
                      type: "Control",
                      options: {
                        messages: [
                          {
                            type: "ERROR",
                            keyword: "required",
                            icon: true,
                            labelKey: "some.scope.fields.name.requiredError",
                          },
                          {
                            type: "ERROR",
                            keyword: "maxLength",
                            icon: true,
                            labelKey: "some.scope.fields.name.maxLengthError",
                          },
                        ],
                      },
                    },
                    {
                      labelKey: "some.scope.fields.summary.label",
                      scope: "/properties/summary",
                      type: "Control",
                      options: {
                        control: "hub-field-input-input",
                        type: "textarea",
                        rows: 4,
                        helperText: {
                          labelKey: "some.scope.fields.summary.helperText",
                        },
                        messages: [
                          {
                            type: "ERROR",
                            keyword: "maxLength",
                            icon: true,
                            labelKey: "shared.fields.purpose.maxLengthError",
                          },
                        ],
                      },
                    },
                    {
                      labelKey: "some.scope.fields.hero.label",
                      scope: "/properties/view/properties/hero",
                      type: "Control",
                      options: {
                        control: "hub-field-input-tile-select",
                        layout: "horizontal",
                        helperText: {
                          labelKey: "some.scope.fields.hero.helperText",
                        },
                        labels: [
                          "{{some.scope.fields.hero.map.label:translate}}",
                          "{{some.scope.fields.hero.image.label:translate}}",
                        ],
                        descriptions: [
                          "{{some.scope.fields.hero.map.description:translate}}",
                          "{{some.scope.fields.hero.map.description:translate}}",
                        ],
                        icons: ["map-pin", "image"],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "Step",
              labelKey: "some.scope.sections.hero.label",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/name",
                  schema: { const: "" },
                },
              },
              elements: [
                {
                  type: "Section",
                  labelKey: "some.scope.sections.location.label",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: { const: "image" },
                    },
                  },
                  options: {
                    helperText: {
                      labelKey: "some.scope.sections.location.helperText",
                    },
                  },
                  elements: [
                    {
                      scope: "/properties/location",
                      type: "Control",
                      options: {
                        control: "hub-field-input-location-picker",
                        extent: [],
                        options: [],
                      },
                    },
                  ],
                },
                {
                  labelKey: "some.scope.fields.featuredImage.label",
                  scope: "/properties/view/properties/featuredImage",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: { const: "map" },
                    },
                  },
                  options: {
                    control: "hub-field-input-image-picker",
                    imgSrc: "https://some-image-url.com",
                    maxWidth: 727,
                    maxHeight: 484,
                    aspectRatio: 1.5,
                    helperText: {
                      labelKey: "some.scope.fields.featuredImage.helperText",
                    },
                    sizeDescription: {
                      labelKey:
                        "some.scope.fields.featuredImage.sizeDescription",
                    },
                  },
                },
                {
                  labelKey: "some.scope.fields.featuredImage.altText.label",
                  scope: "/properties/view/properties/featuredImageAltText",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: { const: "map" },
                    },
                  },
                  options: {
                    helperText: {
                      labelKey:
                        "some.scope.fields.featuredImage.altText.helperText",
                    },
                  },
                },
              ],
            },
            {
              type: "Step",
              labelKey: "some.scope.sections.sharing.label",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/name",
                  schema: { const: "" },
                },
              },
              elements: [
                {
                  scope: "/properties/access",
                  type: "Control",
                  options: {
                    control: "arcgis-hub-access-level-controls",
                    orgName: "My org",
                    itemType: "{{some.scope.fields.access.itemType:translate}}",
                  },
                },
                {
                  labelKey: "some.scope.fields.groups.label",
                  scope: "/properties/_groups",
                  type: "Control",
                  options: {
                    control: "hub-field-input-combobox",
                    items: [],
                    disabled: true,
                    allowCustomValues: false,
                    selectionMode: "multiple",
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
