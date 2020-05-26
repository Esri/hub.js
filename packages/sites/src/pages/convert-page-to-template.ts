import {
  IModel,
  IHubRequestOptions,
  cloneObject,
  propifyString,
  createId,
  normalizeSolutionTemplateItem,
  replaceItemId,
  getItemAssets,
  IModelTemplate
} from "@esri/hub-common";
import { getPageItemType } from "./get-page-item-type";
import { convertLayoutToTemplate } from "../layout";
import { getDependencies } from "../get-dependencies";
import { IItem } from "@esri/arcgis-rest-types";

/**
 * Given a Page Model, return a template object
 * @param {Object} model The Page item model to convert into a template
 * @param {IHubRequestOptions} hubRequestOptions IRequestOptions object, with isPortal, and portalSelf
 */
export function convertPageToTemplate(
  model: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  const tmpl = (cloneObject(model) as unknown) as IModelTemplate;
  // set things we always want...
  tmpl.type = getPageItemType(hubRequestOptions.isPortal);
  tmpl.key = `${propifyString(model.item.title)}_${createId("i")}`;
  tmpl.itemId = model.item.id;
  // now pass the item off to be normalized
  tmpl.item = normalizeSolutionTemplateItem(tmpl.item as IItem);
  tmpl.data.values.sites = [];
  ["source", "updatedAt", "updatedBy", "folderId", "slug"].forEach(p => {
    delete tmpl.data.values[p];
  });

  // convert the layout...
  const layoutConversion = convertLayoutToTemplate(tmpl.data.values.layout);
  // the conversion can return an array of assets to convert, but for now, we are not using that...
  tmpl.data.values.layout = layoutConversion.layout;

  tmpl.dependencies = getDependencies(model);

  // convert any internal references in /data to the item's id into `{{appId}}`
  tmpl.data = replaceItemId(tmpl.data, tmpl.itemId);

  if (!tmpl.item.properties) {
    tmpl.item.properties = {};
  }
  return getItemAssets(model.item, hubRequestOptions).then(assets => {
    tmpl.assets = assets;
    return tmpl;
  });
}
