import { buildUiSchema } from "../../../src/content/_internal/ContentUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as hostedServiceUtilsModule from "../../../src/content/hostedServiceUtils";
import * as checkPermissionModule from "../../../src/permissions/checkPermission";

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
      { access: "public" } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.downloads.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.downloads.helperText",
            },
          },
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
              },
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
                disabled: true,
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
                messages: [
                  {
                    type: "CUSTOM",
                    display: "notice",
                    kind: "warning",
                    icon: "exclamation-mark-triangle",
                    titleKey:
                      "some.scope.fields.schedule.unavailableNotice.title",
                    labelKey:
                      "some.scope.fields.schedule.unavailableNotice.body",
                    allowShowBeforeInteract: true,
                    alwaysShow: true,
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  });
});
