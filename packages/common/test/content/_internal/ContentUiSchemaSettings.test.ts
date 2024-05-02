import { buildUiSchema } from "../../../src/content/_internal/ContentUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as hostedServiceUtilsModule from "../../../src/content/hostedServiceUtils";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";

describe("buildUiSchema: content settings", () => {
  it("includes download fields for hosted feature service entities", async () => {
    spyOn(
      hostedServiceUtilsModule,
      "isHostedFeatureServiceEntity"
    ).and.returnValue(true);

    const contextWithPermission = {
      ...MOCK_CONTEXT,
      featureFlags: {
        "hub:content:workspace:settings:schedule": true,
      },
    };
    const uiSchema = await buildUiSchema(
      "some.scope",
      { access: "public" } as any,
      contextWithPermission
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
              scope: "/properties/schedule/properties/_forceUpdate",
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
      "isHostedFeatureServiceEntity"
    ).and.returnValue(false);

    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [],
    });
  });
});
