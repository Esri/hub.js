import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import {
  IPortal,
  IUserItemOptions,
  getItem,
  removeItem,
} from "@esri/arcgis-rest-portal";
import {
  IDownloadFormatConfiguration,
  IHubContentEditor,
  IHubEditableContent,
  IHubLocation,
} from "../core";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  updateModel,
  // upsertModelResources,
} from "../models";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import { IHubRequestOptions, IModel } from "../hub-types";
import {
  createSettingV2,
  getDefaultEntitySettings,
  setDiscussableKeyword,
  updateSettingV2,
} from "../discussions";
import { modelToHubEditableContent } from "./modelToHubEditableContent";
import {
  getService,
  IFeatureServiceDefinition,
  parseServiceUrl,
} from "@esri/arcgis-rest-feature-service";
import { updateServiceDefinition } from "@esri/arcgis-rest-feature-service";
import {
  hasServiceCapability,
  isHostedFeatureServiceMainEntity,
  ServiceCapabilities,
  toggleServiceCapability,
} from "./hostedServiceUtils";
import { IItemAndIServerEnrichments } from "../items/_enrichments";
import {
  isDownloadSchedulingAvailable,
  maybeUpdateSchedule,
} from "./manageSchedule";
import { forceUpdateContent } from "./_internal/internalContentUtils";
import { deepEqual, getProp, setProp } from "../objects";
import { getDownloadFlow } from "../downloads/_internal/getDownloadFlow";
import { getDownloadConfiguration } from "../downloads/getDownloadConfiguration";
import { shouldShowDownloadsConfiguration } from "./_internal/shouldShowDownloadsConfiguration";
import { Polygon } from "geojson";
import { arcgisToGeoJSON } from "@terraformer/arcgis";

// TODO: move this to defaults?
const DEFAULT_CONTENT_MODEL: IModel = {
  item: {
    title: "No Title Provided",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: [],
  },
  data: null,
} as unknown as IModel;

/**
 * @private
 * Create a new Hub Content item
 *
 * Minimal properties are name and org
 *
 */
export async function createContent(
  partialContent: Partial<IHubEditableContent>,
  requestOptions: IHubRequestOptions
): Promise<IHubEditableContent> {
  // let resources;
  // merge incoming with the default
  // this expansion solves the typing somehow
  const content = { /* ...DEFAULT_PROJECT, */ ...partialContent };

  content.typeKeywords = setDiscussableKeyword(
    content.typeKeywords,
    content.isDiscussable
  );

  // Map project object onto a default project Model
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.entityToStore(content, cloneObject(DEFAULT_CONTENT_MODEL));

  // TODO: if we have resources disconnect them from the model for now.
  // if (model.resources) {
  //   resources = configureBaseResources(
  //     cloneObject(model.resources),
  //     EntityResourceMap
  //   );
  //   delete model.resources;
  // }
  // create the item
  model = await createModel(model, requestOptions as IUserRequestOptions);

  // TODO: if we have resources, create them, then re-attach them to the model
  // if (resources) {
  //   model = await upsertModelResources(model, resources, requestOptions);
  // }
  // map the model back into a IHubEditableContent
  const newContent = mapper.storeToEntity(model, {});
  // TODO:
  // newContent = computeProps(model, newContent, requestOptions);
  // and return it
  return newContent as IHubEditableContent;
}

/**
 * @private
 * Update a Hub Content
 * @param content
 * @param requestOptions
 */
export async function updateContent(
  content: IHubEditableContent,
  requestOptions: IHubRequestOptions
): Promise<IHubEditableContent> {
  // Get the backing item
  // NOTE: We can't just call `getModel` because we need to be able
  // to properly handle other types like PDFs that don't have JSON data
  const item = await getItem(content.id, requestOptions);
  const model: IModel = { item };
  content.typeKeywords = setDiscussableKeyword(
    content.typeKeywords,
    content.isDiscussable
  );
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(content, model);

  // NOTE: Product has asked that we display a _disabled_ downloads configuration for
  // certain types of entities, but not allow users to change any settings. The following
  // checks are in place to make sure we don't accidentally save configurations in
  // situations where we shouldn't
  const downloadFlow = getDownloadFlow(content);
  const updatedFormats = getProp(
    content,
    "extendedProps.downloads.formats"
  ) as string;
  const isMainEntityExtractDisabled =
    isHostedFeatureServiceMainEntity(content) &&
    downloadFlow !== "createReplica";
  const wasDownloadsConfigurationDisplayed =
    shouldShowDownloadsConfiguration(content);
  if (
    wasDownloadsConfigurationDisplayed && // whether the downloads configuration was displayed
    downloadFlow && // whether the entity can be downloaded
    updatedFormats && // whether download format configuration is present
    !isMainEntityExtractDisabled
  ) {
    const updatedDownloadsConfiguration = cloneObject(
      content.extendedProps.downloads
    );

    setProp(
      "item.properties.downloads",
      updatedDownloadsConfiguration,
      modelToUpdate,
      true
    );
  }

  // TODO: if we have resources disconnect them from the model for now.
  // if (modelToUpdate.resources) {
  //   resources = configureBaseResources(
  //     cloneObject(modelToUpdate.resources),
  //     EntityResourceMap
  //   );
  //   delete modelToUpdate.resources;
  // }

  // update the backing item
  const updatedModel = await updateModel(
    modelToUpdate,
    requestOptions as IUserRequestOptions
  );

  // update enrichment values
  const enrichments: IItemAndIServerEnrichments = {};

  // NOTE: Due to platform limitations, The only way we can guarantee that a user can update the
  // service definition without performing a no-op update is if the user has edit rights to the
  // "main" item of the hosted feature service. Just like AGO, we don't allow users to update the
  // service if the current item is just a reference to a pre-existing service.
  if (isHostedFeatureServiceMainEntity(content)) {
    const currentDefinition = await getService({
      ...requestOptions,
      url: content.url,
    });
    const currentServerExtractEnabled = hasServiceCapability(
      ServiceCapabilities.EXTRACT,
      currentDefinition
    );
    // To avoid over-updating the service, we only fire an update call if Extract has changed
    // TODO: Change the edit flow and entity schema to read from `extendedProps.serverExtractCapability`
    if (currentServerExtractEnabled !== content.serverExtractCapability) {
      const updatedDefinition = toggleServiceCapability(
        ServiceCapabilities.EXTRACT,
        currentDefinition
      );
      const updatedServiceCapabilities: Partial<IFeatureServiceDefinition> = {
        capabilities: updatedDefinition.capabilities,
      };
      await updateServiceDefinition(parseServiceUrl(content.url), {
        authentication: requestOptions.authentication,
        updateDefinition: updatedServiceCapabilities,
      });
      enrichments.server = updatedDefinition;
    } else {
      enrichments.server = currentDefinition;
    }
  }

  if (isDownloadSchedulingAvailable(requestOptions, content.access)) {
    // if schedule has "Force Update" checked and clicked save, initiate an update
    if (deepEqual(content._forceUpdate, [true])) {
      // [true]
      await forceUpdateContent(item.id, requestOptions as IUserRequestOptions);
    }

    delete content._forceUpdate;

    await maybeUpdateSchedule(content, requestOptions as IUserRequestOptions);
  }

  // map back into a content
  const updatedContent = modelToHubEditableContent(
    updatedModel,
    requestOptions,
    enrichments,
    content
  );

  // persist location geometries to discussion settings as Polygon[]
  let allowedLocations: Polygon[];
  try {
    allowedLocations =
      updatedContent.location.geometries?.map(
        (geometry) => arcgisToGeoJSON(geometry) as any as Polygon
      ) || null;
  } catch (e) {
    allowedLocations = null;
    /* tslint:disable no-console */
    console.warn("Esri JSON conversion failed", e);
  }

  const defaultSettings = getDefaultEntitySettings("content");
  const settings = {
    ...defaultSettings.settings,
    discussions: {
      ...defaultSettings.settings.discussions,
      ...updatedContent.discussionSettings,
      allowedLocations,
    },
  };

  if (!settings.discussions.allowedChannelIds?.length) {
    settings.discussions.allowedChannelIds = null;
  }
  if (!settings.discussions.allowedLocations?.length) {
    settings.discussions.allowedLocations = null;
  }

  const newOrUpdatedSettings = updatedContent.entitySettingsId
    ? await updateSettingV2({
        id: updatedContent.entitySettingsId,
        data: { settings },
        ...requestOptions,
      })
    : await createSettingV2({
        data: {
          id: updatedContent.id,
          type: defaultSettings.type,
          settings,
        },
        ...requestOptions,
      });
  updatedContent.entitySettingsId = newOrUpdatedSettings.id;
  updatedContent.discussionSettings = newOrUpdatedSettings.settings.discussions;

  return updatedContent;
}

/**
 * @private
 * Remove a Hub Content
 * @param id
 * @param requestOptions
 */
export async function deleteContent(
  id: string,
  requestOptions: IHubRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}

/**
 * Convert a IHubContentEditor back to an IHubContent
 * @param editor
 * @param portal
 * @returns
 */
export function editorToContent(
  editor: IHubContentEditor,
  _portal: IPortal
): IHubEditableContent {
  // Clone the editor to prevent mutation
  const clonedEditor = cloneObject(editor);
  // Remove unneeded properties
  delete clonedEditor.downloadFormats;
  // Cast the editor to a content
  const content = cloneObject(clonedEditor) as IHubEditableContent;

  // Conditionally set the downloads configuration. We only want
  // to set the configuration if the entity is actually downloadable
  const downloadFlow = getDownloadFlow(content);
  if (downloadFlow && editor.downloadFormats) {
    const downloadConfiguration = getDownloadConfiguration(content);
    // Convert the download format display objects to the stored format
    const forStorage: IDownloadFormatConfiguration[] =
      editor.downloadFormats.map((format) => {
        const noLabel = cloneObject(format);
        delete noLabel.label;
        return noLabel;
      });
    downloadConfiguration.formats = forStorage;
    setProp("extendedProps.downloads", downloadConfiguration, content, true);
  }

  // copy the location extent up one level
  content.extent = (editor.location as IHubLocation)?.extent || [];

  return content;
}
