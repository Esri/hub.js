import {
  IUiSchemaElement,
  IUiSchemaMessage,
  UiSchemaMessageTypes,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { getDownloadFlow } from "../../downloads/_internal/getDownloadFlow";
import { isHostedFeatureServiceMainEntity } from "../hostedServiceUtils";

export function getDownloadsSection(
  i18nScope: string,
  entity: IHubEditableContent
): IUiSchemaElement {
  const downloadSectionElements: IUiSchemaElement[] = [];

  if (shouldShowExtractToggleElement(entity)) {
    const extractToggleElement = getExtractToggleElement(i18nScope, entity);
    downloadSectionElements.push(extractToggleElement);
  }

  const downloadFormatsElement = getDownloadFormatsElement(i18nScope, entity);
  downloadSectionElements.push(downloadFormatsElement);

  return {
    type: "Section",
    labelKey: `${i18nScope}.sections.downloads.label`,
    options: {},
    elements: downloadSectionElements,
  };
}

function shouldShowExtractToggleElement(entity: IHubEditableContent): boolean {
  return isHostedFeatureServiceMainEntity(entity);
}

function getExtractToggleElement(
  i18nScope: string,
  entity: IHubEditableContent
): IUiSchemaElement {
  return {
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
  };
}

function getDownloadFormatsElement(
  i18nScope: string,
  entity: IHubEditableContent
): IUiSchemaElement {
  const result: IUiSchemaElement = {
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

  if (shouldShowExtractToggleElement(entity)) {
    result.rules.push({
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
  } else if (shouldDisableDownloadFormatsControl(entity)) {
    result.rules.push({
      effect: UiSchemaRuleEffects.DISABLE,
      conditions: [true],
    });

    result.options.messages = [
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

  return result;
}

function shouldDisableDownloadFormatsControl(
  entity: IHubEditableContent
): boolean {
  const downloadFlow = getDownloadFlow(entity);
  const isMainEntityExtractDisabled =
    isHostedFeatureServiceMainEntity(entity) &&
    downloadFlow !== "createReplica";
  return !downloadFlow || isMainEntityExtractDisabled;
}
