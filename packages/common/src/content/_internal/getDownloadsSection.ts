import {
  IUiSchemaElement,
  IUiSchemaMessage,
  UiSchemaMessageTypes,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { getDownloadFlow } from "../../downloads/_internal/getDownloadFlow";
import { isHostedFeatureServiceMainEntity } from "../hostedServiceUtils";

/**
 * @private
 * Constructs the downloads section for an IHubEditableContent entity.
 * Due to numerous product requirements, the content and state of this section
 * can vary greatly depending on the entity type and configuration.
 *
 * @param i18nScope translation scope
 * @param entity entity to get the downloads section for
 * @returns ui schema elements for the downloads section
 */
export function getDownloadsSection(
  i18nScope: string,
  entity: IHubEditableContent
): IUiSchemaElement {
  const downloadSectionElements: IUiSchemaElement[] = [];

  if (shouldShowExtractToggleElement(entity)) {
    const extractToggleElement = getExtractToggleElement(i18nScope);
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

/**
 * NOTE: we only show the extract toggle for main entities of a hosted feature service
 * since we can guarantee that the user will have the necessary permissions to enable
 * extract capabilities on the service.
 */
function shouldShowExtractToggleElement(entity: IHubEditableContent): boolean {
  return isHostedFeatureServiceMainEntity(entity);
}

function getExtractToggleElement(i18nScope: string): IUiSchemaElement {
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

/**
 * Returns the ui schema element for the download formats field. Populating this field
 * is a complex process that depends on the entity type, configuration, and product requirements.
 */
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

  // Product has asked that if the extract capability toggle is present, we should disable
  // the download formats control when the toggle is off. We hope this will encourage more
  // users to opt into the hosted downloads experience.
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
    // Product had us add this branch in to encourage users to make their content / service downloadable.
    // This branch should run when the entity represents a service that cannot be downloaded and extract
    // cannot be enabled. The control will list all the formats that _could_ be available if the user
    // were to make the necessary changes
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

/**
 * Returns true when an entity represents a item/service that
 * cannot be downloaded with its current configuration.
 */
function shouldDisableDownloadFormatsControl(
  entity: IHubEditableContent
): boolean {
  const downloadFlow = getDownloadFlow(entity);
  return !downloadFlow;
}
