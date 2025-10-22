import { getDownloadsSection } from "../../../src/content/_internal/getDownloadsSection";
import { UiSchemaRuleEffects } from "../../../src/core/enums/uiSchemaRuleEffects";
import { IHubEditableContent } from "../../../src/core/types/IHubEditableContent";

describe("getDownloadsSection", () => {
  it("should show the downloads section with the extract toggle element", () => {
    const i18nScope = "some.scope";
    const entity: IHubEditableContent = {
      type: "Feature Service",
      typeKeywords: ["Hosted Service"],
    } as any as IHubEditableContent;

    const result = getDownloadsSection(i18nScope, entity);
    expect(result).toEqual({
      type: "Section",
      labelKey: "some.scope.sections.downloads.label",
      options: {},
      elements: [
        {
          labelKey: "some.scope.fields.serverExtractCapability.label",
          scope: "/properties/serverExtractCapability",
          type: "Control",
          options: {
            control: "hub-field-input-tile-select",
            labels: [
              `{{some.scope.fields.serverExtractCapability.exportDataSetting.label:translate}}`,
              `{{some.scope.fields.serverExtractCapability.defaultDownloadsSystem.label:translate}}`,
            ],
            descriptions: [
              `{{some.scope.fields.serverExtractCapability.exportDataSetting.description:translate}}`,
              `{{some.scope.fields.serverExtractCapability.defaultDownloadsSystem.description:translate}}`,
            ],
            layout: "vertical",
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
    });
  });

  it("should disable the download formats control for entities that cannot be downloaded", () => {
    const i18nScope = "some.scope";
    const entity: IHubEditableContent = {
      type: "Map Service",
      typeKeywords: [],
      access: "private",
    } as any as IHubEditableContent;

    const result = getDownloadsSection(i18nScope, entity);
    expect(result).toEqual({
      type: "Section",
      labelKey: "some.scope.sections.downloads.label",
      options: {},
      elements: [
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
            messages: [
              {
                type: "CUSTOM",
                display: "notice",
                kind: "warning",
                icon: "exclamation-mark-triangle",
                titleKey:
                  "some.scope.fields.downloadFormats.downloadsUnavailableNotice.title",
                labelKey:
                  "some.scope.fields.downloadFormats.downloadsUnavailableNotice.body",
                allowShowBeforeInteract: true,
                alwaysShow: true,
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
      ],
    });
  });

  it("should get downloads section without disable downloads format control", () => {
    const i18nScope = "some.scope";
    const entity: IHubEditableContent = {
      type: "Feature Service",
      typeKeywords: [],
      url: "https://services.arcgis.com/123456/arcgis/rest/services/MyService/FeatureServer",
      access: "public",
      serverQueryCapability: true,
    } as any as IHubEditableContent;

    const result = getDownloadsSection(i18nScope, entity);
    expect(result).toEqual({
      type: "Section",
      labelKey: "some.scope.sections.downloads.label",
      options: {},
      elements: [
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
          rules: [],
        },
      ],
    });
  });
});
