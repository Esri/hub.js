import { buildUiSchema } from "../../../src/content/_internal/ContentUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as hostedServiceUtilsModule from "../../../src/content/hostedServiceUtils";
import * as checkPermissionModule from "../../../src/permissions/checkPermission";
import { EntityEditorOptions } from "../../../src/core/schemas/internal/EditorOptions";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";

describe("buildUiSchema: content settings", () => {
  it("includes download fields for hosted feature service entities", async () => {
    spyOn(
      hostedServiceUtilsModule,
      "isHostedFeatureServiceMainEntity"
    ).and.returnValue(true);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue({
      access: false,
    });
    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        access: "public",
        type: "Feature Service",
        url: "https://services.arcgis.com/abc/arcgis/rest/services/MyService/FeatureServer/0",
      } as any as EntityEditorOptions,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.downloads.label",
          options: {},
          elements: [
            {
              labelKey: "some.scope.fields.serverExtractCapability.label",
              scope: "/properties/serverExtractCapability",
              type: "Control",
              options: {
                helperText: {
                  labelKey:
                    "some.scope.fields.serverExtractCapability.helperText",
                },
                messages: [
                  {
                    type: "CUSTOM",
                    display: "notice",
                    kind: "warning",
                    icon: "exclamation-mark-triangle",
                    titleKey:
                      "some.scope.fields.serverExtractCapability.noFormatConfigurationNotice.title",
                    labelKey:
                      "some.scope.fields.serverExtractCapability.noFormatConfigurationNotice.body",
                    allowShowBeforeInteract: true,
                    conditions: [
                      {
                        scope: "/properties/serverExtractCapability",
                        schema: {
                          const: false,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.downloadFormats.label",
              scope: "/properties/downloadFormats",
              type: "Control",
              options: {
                control: "hub-field-input-list",
                helperText: {
                  labelKey: "some.scope.fields.downloadFormats.helperText",
                },
                allowReorder: true,
                allowHide: true,
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [
                    {
                      scope: "/properties/serverExtractCapability",
                      schema: {
                        const: false,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it("excludes download fields for other entities", async () => {
    spyOn(
      hostedServiceUtilsModule,
      "isHostedFeatureServiceMainEntity"
    ).and.returnValue(false);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue({
      access: false,
    });
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [],
    });
  });
  it("includes enabled schedule fields for public entities", async () => {
    spyOn(
      hostedServiceUtilsModule,
      "isHostedFeatureServiceMainEntity"
    ).and.returnValue(false);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue({
      access: true,
    });
    const uiSchema = await buildUiSchema(
      "some.scope",
      { access: "public" } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `some.scope.sections.schedule.label`,
          elements: [
            {
              type: "Control",
              scope: "/properties/schedule",
              labelKey: `some.scope.sections.schedule.helperText`,
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
                    helperActionText: `{{some.scope.fields.schedule.manual.helperActionText:translate}}`,
                  },
                ],
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [false],
                },
              ],
            },
            {
              type: "Notice",
              options: {
                notice: {
                  configuration: {
                    id: "schedule-unavailable-notice",
                    noticeType: "notice",
                    closable: false,
                    kind: "warning",
                    icon: "exclamation-mark-triangle",
                    scale: "m",
                  },
                  title: `{{some.scope.fields.schedule.unavailableNotice.title:translate}}`,
                  message: `{{some.scope.fields.schedule.unavailableNotice.body:translate}}`,
                  autoShow: true,
                },
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
            },
            {
              type: "Control",
              scope: "/properties/_forceUpdate",
              options: {
                control: "hub-field-input-tile-select",
                type: "checkbox",
                labels: [
                  `{{some.scope.fields.schedule.forceUpdateButton.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.schedule.forceUpdateButton.description:translate}}`,
                ],
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [true],
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it("includes disabled schedule fields for private entities", async () => {
    spyOn(
      hostedServiceUtilsModule,
      "isHostedFeatureServiceMainEntity"
    ).and.returnValue(false);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue({
      access: true,
    });
    const uiSchema = await buildUiSchema(
      "some.scope",
      { access: "private" } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `some.scope.sections.schedule.label`,
          elements: [
            {
              type: "Control",
              scope: "/properties/schedule",
              labelKey: `some.scope.sections.schedule.helperText`,
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
                    helperActionText: `{{some.scope.fields.schedule.manual.helperActionText:translate}}`,
                  },
                ],
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.DISABLE,
                  conditions: [true],
                },
              ],
            },
            {
              type: "Notice",
              options: {
                notice: {
                  configuration: {
                    id: "schedule-unavailable-notice",
                    noticeType: "notice",
                    closable: false,
                    kind: "warning",
                    icon: "exclamation-mark-triangle",
                    scale: "m",
                  },
                  title: `{{some.scope.fields.schedule.unavailableNotice.title:translate}}`,
                  message: `{{some.scope.fields.schedule.unavailableNotice.body:translate}}`,
                  autoShow: true,
                },
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [true],
                },
              ],
            },
            {
              type: "Control",
              scope: "/properties/_forceUpdate",
              options: {
                control: "hub-field-input-tile-select",
                type: "checkbox",
                labels: [
                  `{{some.scope.fields.schedule.forceUpdateButton.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.schedule.forceUpdateButton.description:translate}}`,
                ],
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
