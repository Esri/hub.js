import { IModelTemplate, IHubRequestOptions, getProp } from "@esri/hub-common";
import { getDefaultInitiativeTemplate } from "./get-default-initiative-template";

// TODO: the initiative will be in the site hash OR we pass it in
/**
 * Given a Site Template, do what we can to return an initiative template
 * In Hub, we expect the system to populate tmpl.properties.initiativeTemplate
 * In other apps, this may not be present, so we use the default template
 * (fetched from the Hub app)
 * @param {object} siteTemplate Site Template
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getInitiativeTemplate(
  siteTemplate: IModelTemplate,
  hubRequestOptions: IHubRequestOptions
) {
  let tmplPromise;
  const template = getProp(siteTemplate, "properties.initiativeTemplate");
  if (template) {
    tmplPromise = Promise.resolve(template);
  } else {
    // return the default template
    tmplPromise = getDefaultInitiativeTemplate(hubRequestOptions);
  }
  return tmplPromise;
}
