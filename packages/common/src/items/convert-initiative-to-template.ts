import {
  IInitiativeModel,
  IHubRequestOptions,
  IModelTemplate,
  IInitiativeItem,
  IItemTemplate
} from "../types";
import { cloneObject, createId, without } from "../util";
import { normalizeSolutionTemplateItem } from "./normalize-solution-template-item";
import { propifyString } from "../utils";
import { getProp } from "../objects";
import { getItemResources } from "@esri/arcgis-rest-portal";

/**
 * Convert an Initiative Model into a template
 * Includes a hash of resources
 * @param {object} model Initiative model
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function convertInitiativeToTemplate(
  model: IInitiativeModel,
  hubRequestOptions: IHubRequestOptions
): Promise<IModelTemplate> {
  // clone this so we don't mess things up...
  const templateItem = model.item;
  const template = (cloneObject(model) as any) as IModelTemplate;
  template.item = normalizeSolutionTemplateItem(templateItem);
  // clear url
  delete template.item.url;
  // clear the extent
  delete template.item.extent;
  // clear out item properties...
  delete template.item.properties.source;
  delete template.item.properties.collaborationGroupId;
  delete template.item.properties.contentGroupId;
  delete template.item.properties.followersGroupId;
  delete template.item.properties.groupId; // artifact of 2.0 initiatives
  // on the data side of things...
  delete template.data.values.collaborationGroupId;
  delete template.data.values.contentGroupId;
  delete template.data.values.followersGroupId;
  delete template.data.values.followerGroups;
  delete template.data.values.openDataGroupId;

  // Ensure some properties are set correctly
  template.type = "Hub Initiative Template";
  template.key = `${propifyString(model.item.title)}_${createId("i")}`;
  template.itemId = model.item.id;

  // remove the initiative keyword
  template.item.typeKeywords = without(
    template.item.typeKeywords,
    "hubInitiative"
  );
  // add the typeKeyword
  template.item.typeKeywords.push("hubInitiativeTemplate");

  // if we have steps, and not recommended, convert them
  // this may happen if the model is fetched via something other
  // than the getInitiative fn, which applies schema upgrades
  if (
    getProp(template, "data.steps") &&
    !getProp(template, "data.recommendedTemplates")
  ) {
    // collect up the ids from all the steps into `recommendedTemplates`
    template.data.recommendedTemplates = template.data.steps.reduce(
      (acc: string[], step: any) => {
        const stepTmpl = step.templateIds || [];
        return acc.concat(stepTmpl);
      },
      []
    );
  }
  // get the resources...
  return getItemResources(template.itemId, hubRequestOptions).then(response => {
    // TODO: compute url to resource
    template.resources = response.resources.map((e: any) => e.resource);
    return template;
  });
}
