import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import {
  IUiSchema,
  IUiSchemaElement,
  IUiSchemaMessage,
  UiSchemaMessageTypes,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import {
  IHubEditableContent,
  IServiceExtendedProps,
} from "../../core/types/IHubEditableContent";
import { canUseHubDownloadSystem } from "../../downloads";
import { canUseExportImageFlow } from "../../downloads/_internal/canUseExportImageFlow";
import { canUseCreateReplica } from "../../downloads/canUseCreateReplica";
import { getProp } from "../../objects/get-prop";
import { checkPermission } from "../../permissions/checkPermission";
import { isHostedFeatureServiceMainEntity } from "../hostedServiceUtils";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Editable Content.
 * This defines how the schema properties should be
 * rendered in the content settings editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  _context: IArcGISContext
): Promise<IUiSchema> => {
  const uiSchema: IUiSchema = {
    type: "Layout",
    elements: [],
  };
  if (
    checkPermission(
      "hub:content:workspace:settings:schedule",
      _context,
      options
    ).access
  ) {
    const scheduleControlElement: IUiSchemaElement = {
      type: "Control",
      scope: "/properties/schedule",
      labelKey: `${i18nScope}.sections.schedule.helperText`,
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
            helperActionText: `{{${i18nScope}.fields.schedule.manual.helperActionText:translate}}`,
          },
        ],
      },
    };

    const scheduleSectionElements: IUiSchemaElement[] = [
      scheduleControlElement,
    ];

    if (options.access !== "public") {
      // Disable the schedule control and add the unavailable notice
      scheduleControlElement.options.disabled = true;
      scheduleControlElement.options.messages = [
        {
          type: UiSchemaMessageTypes.custom,
          display: "notice",
          kind: "warning",
          icon: "exclamation-mark-triangle",
          titleKey: `${i18nScope}.fields.schedule.unavailableNotice.title`,
          labelKey: `${i18nScope}.fields.schedule.unavailableNotice.body`,
          allowShowBeforeInteract: true,
          alwaysShow: true,
        },
      ] as IUiSchemaMessage[];
    } else {
      // force update checkbox -- TODO: replace with button once available
      scheduleSectionElements.push({
        type: "Control",
        scope: "/properties/_forceUpdate",
        options: {
          control: "hub-field-input-tile-select",
          type: "checkbox",
          labels: [
            `{{${i18nScope}.fields.schedule.forceUpdateButton.label:translate}}`,
          ],
          descriptions: [
            `{{${i18nScope}.fields.schedule.forceUpdateButton.description:translate}}`,
          ],
        },
      });
    }

    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.schedule.label`,
      elements: scheduleSectionElements,
    });
  }
  // TODO: restrict this to only downloadable service entities
  // add canDownload utility function to check if the entity is downloadable
  // AND only reference or single layer services

  const isReferenceLayer =
    ["Feature Service", "Map Service"].includes(options.type) &&
    /\/\d+$/.test((options as IHubEditableContent).url);
  const isSingleLayer =
    getProp(options, "extendedProps.server.layers.length") === 1;
  const isDownloadableImageService = canUseExportImageFlow(
    options as IHubEditableContent
  );

  if (isReferenceLayer || isSingleLayer || isDownloadableImageService) {
    const downloadSectionElements: IUiSchemaElement[] = [];

    if (isHostedFeatureServiceMainEntity(options as IHubEditableContent)) {
      downloadSectionElements.push({
        labelKey: `${i18nScope}.fields.serverExtractCapability.label`,
        scope: "/properties/serverExtractCapability",
        type: "Control",
        options: {
          helperText: {
            labelKey: `${i18nScope}.fields.serverExtractCapability.helperText`,
          },
          messages: [
            {
              type: UiSchemaMessageTypes.custom,
              display: "notice",
              kind: "warning",
              icon: "exclamation-mark-triangle",
              titleKey: `${i18nScope}.fields.serverExtractCapability.noFormatConfigurationNotice.title`,
              labelKey: `${i18nScope}.fields.serverExtractCapability.noFormatConfigurationNotice.body`,
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
          ] as IUiSchemaMessage[],
        },
      });
    }

    const downloadFormatsControl: IUiSchemaElement = {
      labelKey: `${i18nScope}.fields.downloadFormats.label`,
      scope: "/properties/downloadFormats",
      type: "Control",
      options: {
        control: "hub-field-input-list",
        helperText: {
          labelKey: `${i18nScope}.fields.downloadFormats.helperText`,
        },
        allowReorder: true,
        allowHide: true,
      },
      rules: [],
    };

    if (isHostedFeatureServiceMainEntity(options as IHubEditableContent)) {
      downloadFormatsControl.rules.push({
        effect: UiSchemaRuleEffects.DISABLE,
        conditions: [
          {
            scope: "/properties/serverExtractCapability",
            schema: {
              const: false,
            },
          },
        ],
      });
    }

    // conditions that prevent downloads
    // 1. Is not hosted feature service main entity
    // 2. Can you use createReplica
    // 3. Can you use download system
    if (
      !isHostedFeatureServiceMainEntity(options as IHubEditableContent) &&
      !canUseCreateReplica(options as IHubEditableContent) &&
      !canUseHubDownloadSystem(options as IHubEditableContent) &&
      !canUseExportImageFlow(options as IHubEditableContent)
    ) {
      downloadFormatsControl.rules.push({
        effect: UiSchemaRuleEffects.DISABLE,
        conditions: [true],
      });

      downloadFormatsControl.options.messages = [
        {
          type: UiSchemaMessageTypes.custom,
          display: "notice",
          kind: "warning",
          icon: "exclamation-mark-triangle",
          titleKey: `${i18nScope}.fields.downloadFormats.downloadsUnavailableNotice.title`,
          labelKey: `${i18nScope}.fields.downloadFormats.downloadsUnavailableNotice.body`,
          allowShowBeforeInteract: true,
          alwaysShow: true,
        },
      ] as IUiSchemaMessage[];
    }

    downloadSectionElements.push(downloadFormatsControl);

    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.downloads.label`,
      options: {},
      elements: downloadSectionElements,
    });
  }

  return uiSchema;
};
