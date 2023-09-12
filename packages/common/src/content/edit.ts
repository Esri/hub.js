import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  IPortal,
  IUserItemOptions,
  getItem,
  removeItem,
  IItem,
} from "@esri/arcgis-rest-portal";
import { IHubContentEditor, IHubEditableContent } from "../core";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  getModel,
  updateModel,
  // upsertModelResources,
} from "../models";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import { IModel } from "../types";
import { hasCapability } from "./_internal/computeProps";
import { getProp } from "../objects/get-prop";
import { EnrichmentMap, modelToHubEditableContent } from "./fetch";
import {
  getService,
  IFeatureServiceDefinition,
} from "@esri/arcgis-rest-feature-layer";
import { updateServiceDefinition } from "@esri/arcgis-rest-service-admin";

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
  requestOptions: IUserRequestOptions
): Promise<IHubEditableContent> {
  // let resources;
  // merge incoming with the default
  // this expansion solves the typing somehow
  const content = { /* ...DEFAULT_PROJECT, */ ...partialContent };

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
  model = await createModel(model, requestOptions);

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
  requestOptions: IUserRequestOptions
): Promise<IHubEditableContent> {
  // Get the backing item
  // NOTE: We can't just call `getMode`l because we need to be able
  // to properly handle other types like PDFs that don't have JSON data
  const item = await getItem(content.id, requestOptions);
  const model: IModel = { item };
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(content, model);

  // prevent map from displaying when boundary is 'none'
  const locationType = getProp(modelToUpdate, "item.properties.location.type");
  modelToUpdate.item.properties.boundary =
    locationType === "none" ? "none" : "item";

  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);

  // update enrichment values
  const enrichments: EnrichmentMap = {};
  if (isHostedFeatureService(content)) {
    const currentDefinition = await getService({
      ...requestOptions,
      url: content.url,
    });
    const currentServerExtractEnabled = hasCapability(
      "Extract",
      currentDefinition
    );
    // To avoid over-updating the service, we only fire an update call if Extract has changed
    if (currentServerExtractEnabled !== content.serverExtractCapability) {
      const updatedDefinition = toggleFeatureServiceCapability(
        "Extract",
        currentDefinition
      );
      await updateServiceDefinition(content.url, {
        authentication: requestOptions.authentication,
        updateDefinition: updatedDefinition,
      });
      enrichments.server = updatedDefinition;
    } else {
      enrichments.server = currentDefinition;
    }
  }

  return modelToHubEditableContent(updatedModel, requestOptions, enrichments);
}

// TODO: Move this
export function isHostedFeatureService(
  content: IHubEditableContent | IItem
): boolean {
  return (
    content.type === "Feature Service" &&
    content.typeKeywords.includes("Hosted Service")
  );
}

/**
 * TODO: MOVE THIS
 * Toggles a single capability on a given feature service.
 * Returns a service definition object with updated capabilities
 * @param {string} capability capability to toggle
 * @param {string} serviceUrl url of service to modify
 * @param {IServiceDefinition} serviceDefinition current definition of the service
 *
 * @returns {IServiceDefinition} updated definition
 */
export function toggleFeatureServiceCapability(
  capability: string,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const updatedDefinition = hasCapability(capability, serviceDefinition)
    ? removeCapability(capability, serviceDefinition)
    : addCapability(capability, serviceDefinition);

  return updatedDefinition;
}

// TODO: Move this
function addCapability(
  capability: string,
  serverDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const capabilities = (serverDefinition.capabilities || "")
    .split(",")
    .concat(capability)
    .join(",");
  const updated = { ...serverDefinition, capabilities };
  return updated;
}

// TODO: Move this
export function removeCapability(
  capability: string,
  serverDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const capabilities = (serverDefinition.capabilities || "")
    .split(",")
    .filter((c) => c !== capability)
    .join(",");
  const updated = { ...serverDefinition, capabilities };
  return updated;
}

/**
 * @private
 * Remove a Hub Content
 * @param id
 * @param requestOptions
 */
export async function deleteContent(
  id: string,
  requestOptions: IUserRequestOptions
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
  portal: IPortal
): IHubEditableContent {
  // clone into a IHubContentEditor
  const content = cloneObject(editor) as IHubEditableContent;

  // copy the location extent up one level
  content.extent = editor.location?.extent;

  return content;
}
