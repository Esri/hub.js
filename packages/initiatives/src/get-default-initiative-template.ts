import {
  getCulture,
  IHubRequestOptions,
  convertToWellKnownLocale,
  fetchHubTranslation,
  cloneObject,
  getProp
} from "@esri/hub-common";
import { DEFAULT_INITIATIVE_TEMPLATE } from "./default-initiative-template";

/**
 * Get the translated default initiative template
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getDefaultInitiativeTemplate(
  hubRequestOptions: IHubRequestOptions
) {
  const culture = getCulture(hubRequestOptions);
  const locale = convertToWellKnownLocale(culture);
  return fetchHubTranslation(locale, hubRequestOptions.portalSelf).then(
    translation => {
      // now we can get the embedded initiative template
      const tmpl = cloneObject(DEFAULT_INITIATIVE_TEMPLATE);
      // pluck values off the translation, and inject into the tmpl
      tmpl.item.description = getProp(
        translation,
        "addons.services.templates.customInitiative.item.description"
      );
      tmpl.item.snippet = getProp(
        translation,
        "addons.services.templates.customInitiative.item.snippet"
      );
      tmpl.item.culture = locale;
      // TODO: HANDLE RESOURCES!
      return tmpl;
    }
  );
}
