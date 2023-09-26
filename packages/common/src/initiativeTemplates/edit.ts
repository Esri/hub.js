import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import { createModel, getModel, updateModel } from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import {
  IPortal,
  IUserItemOptions,
  removeItem,
} from "@esri/arcgis-rest-portal";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import {
  IHubInitiativeTemplate,
  IHubInitiativeTemplateEditor,
} from "../core/types/IHubInitiativeTemplate";
import {
  DEFAULT_INITIATIVE_TEMPLATE,
  DEFAULT_INITIATIVE_TEMPLATE_MODEL,
} from "./defaults";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import { setDiscussableKeyword } from "../discussions";
import { IModel } from "../types";

/**
 * @private
 * Create a new Hub Initiative Template item
 * @param partialInitiativeTemplate
 * @param requestOptions
 * @returns
 */
export async function createInitiativeTemplate(
  partialInitiativeTemplate: Partial<IHubInitiativeTemplate>,
  requestOptions: IUserRequestOptions
): Promise<IHubInitiativeTemplate> {
  const initiativeTemplate = {
    ...DEFAULT_INITIATIVE_TEMPLATE,
    ...partialInitiativeTemplate,
  };

  // Create slug from the title if one is not passed in
  if (!initiativeTemplate.slug) {
    initiativeTemplate.slug = constructSlug(
      initiativeTemplate.name,
      initiativeTemplate.orgUrlKey
    );
  }

  // Ensure slug is unique
  initiativeTemplate.slug = await getUniqueSlug(
    { slug: initiativeTemplate.slug },
    requestOptions
  );
  // add slug and status to keywords
  initiativeTemplate.typeKeywords = setSlugKeyword(
    initiativeTemplate.typeKeywords,
    initiativeTemplate.slug
  );
  initiativeTemplate.typeKeywords = setDiscussableKeyword(
    initiativeTemplate.typeKeywords,
    initiativeTemplate.isDiscussable
  );

  // Map initiative template object onto a default initiative template model
  const mapper = new PropertyMapper<Partial<IHubInitiativeTemplate>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.entityToStore(
    initiativeTemplate,
    cloneObject(DEFAULT_INITIATIVE_TEMPLATE_MODEL)
  );
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubInitiativeTemplate
  let newInitiativeTemplate = mapper.storeToEntity(model, {});
  newInitiativeTemplate = computeProps(
    model,
    newInitiativeTemplate,
    requestOptions
  );
  // and return it
  return newInitiativeTemplate as IHubInitiativeTemplate;
}

/**
 * Convert an IHubInitiativeTemplateEditor back to an IHubInitiativeTemplate
 * @param editor
 * @param portal
 * @returns
 */
export function editorToInitiativeTemplate(
  editor: IHubInitiativeTemplateEditor,
  portal: IPortal
): IHubInitiativeTemplate {
  // clone into HubInitiativeTemplate
  const initiativeTemplate = cloneObject(editor) as IHubInitiativeTemplate;
  // ensure there's an org url key
  initiativeTemplate.orgUrlKey = editor.orgUrlKey
    ? editor.orgUrlKey
    : portal.urlKey;
  // return initiatve template
  return initiativeTemplate;
}

/**
 * @private
 * Update a Hub Initiative Template
 * @param initiativeTemplate
 * @param requestOptions
 */
export async function updateInitiativeTemplate(
  initiativeTemplate: IHubInitiativeTemplate,
  requestOptions: IUserRequestOptions
): Promise<IHubInitiativeTemplate> {
  // verify that the slug is unique, excluding the current initiative template
  initiativeTemplate.slug = await getUniqueSlug(
    { slug: initiativeTemplate.slug, existingId: initiativeTemplate.id },
    requestOptions
  );
  // set discussable keyword
  initiativeTemplate.typeKeywords = setDiscussableKeyword(
    initiativeTemplate.typeKeywords,
    initiativeTemplate.isDiscussable
  );
  // get the backing item & data
  const model = await getModel(initiativeTemplate.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubInitiativeTemplate>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(initiativeTemplate, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into an initiative template and return that
  const updatedInitiativeTemplate = mapper.storeToEntity(
    updatedModel,
    initiativeTemplate
  );
  initiativeTemplate = computeProps(
    model,
    updatedInitiativeTemplate,
    requestOptions
  );
  // the casting is needed because modelToObject returns a `Partial<T>`
  // whereas this function returns a `T`
  return updatedInitiativeTemplate as IHubInitiativeTemplate;
}

/**
 * @private
 * Remove a Hub Initiative Template
 * @param id
 * @param requestOptions
 */
export async function deleteInitiativeTemplate(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}
