import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubTemplate, IHubTemplateEditor } from "../core/types/IHubTemplate";
import { getUniqueSlug } from "../items/slugs";
import { setDiscussableKeyword } from "../discussions";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IModel } from "../types";
import { cloneObject } from "../util";
import { getModel, updateModel } from "../models";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import {
  IPortal,
  IUserItemOptions,
  removeItem,
} from "@esri/arcgis-rest-portal";

/**
 * @private
 * Creates a Hub Template's backing Solution item and returns
 * the created entity
 *
 * NOTE: We have no immediate plans to allow template creation
 * from the context of the Hub application, but scaffolding
 * this util for potential future implementation. For now,
 * we will throw an error
 * @param partialTemplate
 * @param requestOptions
 */
export function createTemplate(
  partialTemplate: Partial<IHubTemplate>,
  requestOptions: IUserRequestOptions
): Promise<IHubTemplate> {
  throw new Error(
    "Template creation is not currently supported from the context of Hub"
  );
}

/**
 * @private
 * Updates a Hub Template's backing item and returns
 * the updated entity
 * @param template
 * @param requestOptions
 */
export async function updateTemplate(
  template: IHubTemplate,
  requestOptions: IUserRequestOptions
): Promise<IHubTemplate> {
  // 1. Verify the slug is unique, excluding the current template
  template.slug = await getUniqueSlug(
    { slug: template.slug, existingId: template.id },
    requestOptions
  );

  // 2. Update relevant typeKeywords
  template.typeKeywords = setDiscussableKeyword(
    template.typeKeywords,
    template.isDiscussable
  );

  // 3. Fetch the backing model (item + data)
  const model = await getModel(template.id, requestOptions);

  // 4. Create a property mapper between the template
  // object and item model
  const mapper = new PropertyMapper<Partial<IHubTemplate>, IModel>(
    getPropertyMap()
  );

  // 5. Create item model from updated template object, using
  // the existing model as a starting point
  const modelToUpdate = mapper.entityToStore(template, model);

  // 6. Update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);

  // 7. Map the item back into an IHubTemplate
  const updatedTemplate = mapper.storeToEntity(updatedModel, template);

  // 8. Compute + set various properties on the IHubTemplate
  // that cannot be directly mapped from the item
  template = computeProps(model, updatedTemplate, requestOptions);

  return updatedTemplate as IHubTemplate;
}

/**
 * Convert an IHubTemplateEditor back into a IHubTemplate
 * @param editor
 * @param portal
 */
export function editorToTemplate(
  editor: IHubTemplateEditor,
  portal: IPortal
): IHubTemplate {
  // 1. cast editor to IHubTemplate
  const template = cloneObject(editor) as IHubTemplate;

  // 2. ensure there's an org url key
  template.orgUrlKey = editor.orgUrlKey ? editor.orgUrlKey : portal.urlKey;

  return template;
}

/**
 * @private
 * Remove a Hub Template's backing item
 * @param id
 * @param requestOptions
 */
export async function deleteTemplate(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);

  return;
}
