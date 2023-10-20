import { buildUiSchema } from "../../../src/initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { UiSchemaMessageTypes } from "../../../src/core/schemas/types";
import * as getRecommendedTemplatesCatalogModule from "../../../src/initiative-templates/_internal/getRecommendedTemplatesCatalog";

describe("buildUiSchema: initiative template edit", () => {
  it("returns the full initiative template edit uiSchema", async () => {
    spyOn(
      getRecommendedTemplatesCatalogModule,
      "getRecommendedTemplatesCatalog"
    ).and.returnValue([]);
    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        thumbnail: "thumbnail/custom.png",
        thumbnailUrl: "https://some-thumbnail-url.com",
      } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: `some.scope.sections.basicInfo.label`,
          elements: [
            {
              type: "Control",
              scope: "/properties/name",
              labelKey: `some.scope.fields.name.label`,
              options: {
                messages: [
                  {
                    type: UiSchemaMessageTypes.error,
                    keyword: "required",
                    icon: true,
                    labelKey: `some.scope.fields.name.requiredError`,
                  },
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: `shared.fields.name.maxLengthError`,
                  },
                ],
              },
            },
            {
              type: "Control",
              scope: "/properties/previewUrl",
              labelKey: `some.scope.fields.previewUrl.label`,
              options: {
                helperText: {
                  labelKey: "some.scope.fields.previewUrl.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "format",
                    icon: true,
                    labelKey: "some.scope.fields.previewUrl.formatError",
                  },
                  {
                    type: "ERROR",
                    keyword: "if",
                    hidden: true,
                  },
                ],
              },
            },
            {
              type: "Control",
              scope: "/properties/summary",
              labelKey: `some.scope.fields.summary.label`,
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
                    labelKey: `shared.fields.summary.maxLengthError`,
                  },
                ],
              },
            },
            {
              type: "Control",
              scope: "/properties/description",
              labelKey: `some.scope.fields.description.label`,
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                helperText: {
                  labelKey: "some.scope.fields.description.helperText",
                },
              },
            },
            {
              type: "Control",
              scope: "/properties/_thumbnail",
              labelKey: `shared.fields._thumbnail.label`,
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-thumbnail-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                helperText: {
                  labelKey: "some.scope.fields._thumbnail.helperText",
                },
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
                },
                messages: [],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.fields.recommendedTemplates.label`,
          elements: [
            {
              type: "Control",
              scope: "/properties/recommendedTemplates",

              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "item",
                catalogs: [],
                facets: [
                  {
                    label: `{{some.scope.fields.recommendedTemplates.facets.sharing:translate}}`,
                    key: "access",
                    field: "access",
                    display: "multi-select",
                    operation: "OR",
                  },
                ],
                canReorder: false,
                linkTarget: "workspaceRelative",
                pickerTitle: {
                  labelKey: `some.scope.fields.recommendedTemplates.pickerTitle`,
                },
              },
            },
          ],
        },
      ],
    });
  });
});
