import {
  IModel,
  IHubRequestOptions,
  cloneObject,
  propifyString,
  createId,
  normalizeSolutionTemplateItem,
  IModelTemplate,
  getProp,
  replaceItemId,
  getItemAssets,
} from "@esri/hub-common";
import { getSiteItemType } from "./get-site-item-type";
import { IItem } from "@esri/arcgis-rest-types";
import { SITE_SCHEMA_VERSION } from "./site-schema-version";
import { convertLayoutToTemplate } from "./layout";
import { getSiteDependencies } from "./get-site-dependencies";
import { DRAFT_RESOURCE_REGEX } from "./drafts/_draft-resource-regex";

/**
 * Convert an existing site into the Solution template format
 * @param {Object} model Site Model
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function convertSiteToTemplate(
  model: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  // clone it...
  const tmpl = cloneObject(model) as unknown as IModelTemplate;

  // Ensure some properties are set correctly
  tmpl.type = getSiteItemType(hubRequestOptions.isPortal);
  tmpl.key = `${propifyString(model.item.title)}_${createId("i")}`;
  tmpl.itemId = model.item.id;

  // now pass the item off to be normalized
  tmpl.item = normalizeSolutionTemplateItem(tmpl.item as IItem);

  // remove the url as it will be set when it's created
  delete tmpl.item.url;

  // Note: We do not template in the various team groups
  // When a site is created from a template, those properties
  // will be injected as needed
  tmpl.item.properties = {
    schemaVersion: SITE_SCHEMA_VERSION,
    children: [],
  };
  // inject interpolation propertues where we need them
  tmpl.item.title = "{{solution.title}}";
  tmpl.data.values.subdomain = "{{solution.subdomain}}";
  tmpl.data.values.defaultHostname = "{{solution.defaultHostname}}";
  tmpl.data.values.title = "{{solution.title}}";
  tmpl.data.values.subdomain = "{{solution.subdomain}}";
  tmpl.data.values.defaultHostname = "{{solution.defaultHostname}}";
  delete tmpl.data.catalog;
  // teams are set explicitly vs being interpolated
  delete tmpl.data.values.collaborationGroupId;

  // some props need to be reset to empty strings
  ["updatedAt", "updatedBy", "clientId", "siteId"].forEach((p) => {
    tmpl.data.values[p] = "";
  });
  // others we should just delete
  [
    "customHostname",
    "externalUrl",
    "contentGroupId",
    "followersGroupId",
    "groups",
  ].forEach((p) => {
    delete tmpl.data.values[p];
  });

  // update the default extent...
  if (getProp(tmpl, "data.values.defaultExtent")) {
    tmpl.data.values.defaultExtent = "{{organization.defaultExtent}}";
  }

  if (getProp(tmpl, "data.values.map.basemaps.primary.extent")) {
    tmpl.data.values.map.basemaps.primary.extent =
      "{{organization.defaultExtent}}";
  }

  // convert the layout...
  const layoutConversion = convertLayoutToTemplate(tmpl.data.values.layout);
  tmpl.data.values.layout = layoutConversion.layout;

  // convert any internal references in /data to the item's id into `{{appId}}`
  tmpl.data = replaceItemId(tmpl.data, tmpl.itemId);

  tmpl.dependencies = getSiteDependencies(model);
  return getItemAssets(model.item, hubRequestOptions).then((assets) => {
    // Because we don't want to include the draft resource when clone a site
    // we are filtering out assets that are not 'draft-{timestamp}.json'
    tmpl.assets = assets.filter(
      (asset) => asset.name.search(DRAFT_RESOURCE_REGEX) === -1
    );
    return tmpl;
  });
}
