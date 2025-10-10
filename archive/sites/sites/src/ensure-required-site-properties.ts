import { cloneObject, getProp, deepSet, IModel } from "@esri/hub-common";
import { _getPortalDomainTypeKeyword } from "./_get-portal-domain-type-keyword";
import { _ensureTypeAndTags } from "./_ensure-type-and-tags";
import { SITE_UI_VERSION } from "./site-ui-version";

/**
 * Enture that the site model has all the required properties
 * and force them to be bumped to all the current values.
 * Returns a clone of the model
 * @param {Object} model Site Model
 * @param {Object} currentUser Current User
 * @param {Boolean} isPortal Is this running in ArcGIS Enterprise
 */
export function ensureRequiredSiteProperties(
  model: IModel,
  username: string,
  isPortal = false
) {
  model = cloneObject(model);
  model.item.owner = username;
  model.item.access = "private";

  // ensure typekeywords array
  if (!Array.isArray(model.item.typeKeywords)) {
    model.item.typeKeywords = [];
  }

  model.data.values.updatedAt = new Date().toISOString();
  model.data.values.updatedBy = username;

  if (isPortal) {
    model.item.typeKeywords.push(
      _getPortalDomainTypeKeyword(model.data.values.subdomain)
    );
  }

  // Handle item url - if it's set...
  if (!model.item.url) {
    const hostname =
      getProp(model, "data.values.customHostname") ||
      getProp(model, "data.values.defaultHostname");
    // unless a custom hostname was passed in AND the site item's url is falsey
    // (which currently should be impossible) we want the protocol of the item url
    // to be https.
    let protocol = "https";
    if (model.data.values.customHostname) {
      protocol = "http";
    }
    model.item.url = `${protocol}://${hostname}`;
  }
  // Ensure pages is an array...
  if (!Array.isArray(getProp(model, "data.values.pages"))) {
    deepSet(model, "data.values.pages", []);
  }
  deepSet(model, "data.values.uiVersion", SITE_UI_VERSION);
  // ensure the type and tags...
  model = _ensureTypeAndTags(model, isPortal);
  // ensure the capabilities...
  const defaultCaps = [
    "api_explorer",
    "pages",
    "my_data",
    "social_logins",
    "json_chart_card",
    "document_iframes",
    "items_view",
    "app_page",
    "underlinedLinks",
    "globalNav",
  ];
  const caps = (model.data.values.capabilities || []).reduce(
    (acc: string, capability: string) =>
      acc.includes(capability) ? acc : [...acc, capability],
    defaultCaps
  );
  if (!isPortal && !caps.includes("socialSharing")) {
    caps.push("socialSharing");
  }
  deepSet(model, "data.values.capabilities", caps);
  if (!getProp(model, "data.telemetry")) {
    deepSet(model, "data.telemetry", {});
  }
  // return the clone
  return model;
}
