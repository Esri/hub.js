import {
  addSolutionResourceUrlToAssets,
  interpolate,
  getProp,
  deepSet,
  slugify,
  IModelTemplate,
  IHubRequestOptions,
  IModel
} from "@esri/hub-common";

/**
 * Given a template, settings and transformation hashes, construct the new Page model.
 * Altough this is async, it does not persist the page
 * @param {Object} template Json Template of the Page
 * @param {Object} settings Hash of values to use in the interpolation
 * @param {Object} transforms Hash of transrormation functions available during interpolation
 * @param {IHubRequestOptions} requestOptions
 */
export function createPageModelFromTemplate(
  template: IModelTemplate,
  settings: any,
  transforms: any,
  hubRequestOptions: IHubRequestOptions
): Promise<IModel> {
  // add url to the assets, ref'ing the original location
  template.assets = addSolutionResourceUrlToAssets(template, hubRequestOptions);
  // request options is not currently used, but it *may* be needed, and this fn is part
  //  of an interface needed for Solution Generation and SOME item type will need
  // to make xhrs in this process
  const pageModel = interpolate(template, settings, transforms);
  if (!pageModel.item.properties) {
    pageModel.item.properties = {};
  }
  // Debatable if this should be in the template, but since it's
  // an important part of the relationship system we manually assign it
  const parentInitiativeId = getProp(settings, "initiative.id");

  if (parentInitiativeId) {
    deepSet(
      pageModel,
      "item.properties.parentInitiativeId",
      parentInitiativeId
    );
  }
  // put the slug into the hash so we can use it in following templates
  deepSet(pageModel, "data.values.slug", slugify(pageModel.item.title));
  // do any other work here...
  return Promise.resolve(pageModel as IModel);
}
