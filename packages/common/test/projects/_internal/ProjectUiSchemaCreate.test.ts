import { buildUiSchema } from "../../../src/projects/_internal/ProjectUiSchemaCreate";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { UiSchemaRuleEffects } from "../../../src";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getSharableGroupsComboBoxItemsModule from "../../../src/core/schemas/internal/getSharableGroupsComboBoxItems";
import * as checkPermissionModule from "../../../src/permissions/checkPermission";

describe("buildUiSchema: project create", () => {
  it("returns the full project create uiSchema", async () => {
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

    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          options: { section: "stepper", scale: "l" },
          elements: [
            {
              type: "Section",
              labelKey: "some.scope.sections.details.label",
              options: {
                section: "step",
              },
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
                            labelKey: `some.scope.fields.name.maxLengthError`,
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
                            labelKey: `shared.fields.purpose.maxLengthError`,
                          },
                        ],
                      },
                    },
                    {
                      labelKey: "some.scope.fields.status.label",
                      scope: "/properties/status",
                      type: "Control",
                      options: {
                        control: "hub-field-input-select",
                        enum: {
                          i18nScope: "some.scope.fields.status.enum",
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.location.label",
              options: {
                section: "step",
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [
                    {
                      scope: "/properties/name",
                      schema: { const: "" },
                    },
                  ],
                },
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [
                    {
                      scope: "/properties/name",
                      schema: { minLength: 250 },
                    },
                  ],
                },
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  condition: {
                    scope: "/properties/summary",
                    schema: { minLength: 2048 },
                  },
                },
              ],
              elements: [
                {
                  type: "Section",
                  labelKey: "some.scope.sections.location.label",
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
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.sharing.label",
              options: {
                section: "step",
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [
                    {
                      scope: "/properties/name",
                      schema: { const: "" },
                    },
                  ],
                },
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [
                    {
                      scope: "/properties/name",
                      schema: { minLength: 250 },
                    },
                  ],
                },
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  condition: {
                    scope: "/properties/summary",
                    schema: { minLength: 2048 },
                  },
                },
              ],
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
