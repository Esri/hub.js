import { IGroupTemplate } from "@esri/hub-types";
import { getProp } from "@esri/hub-common";

/**
 * Inject the translations into the Group object template
 * @param {object} template Json Template for the Group
 * @param {string} title Group Title
 * @param {object} translation Translation json
 * @private
 */
export function _translateTeamTemplate(
  template: IGroupTemplate,
  title: string,
  translation: Record<string, any>
) {
  // the team template has the i18n keys in a configuration hash
  // we iterate those properties...
  (["titleI18n", "descriptionI18n", "snippetI18n"] as const).forEach(key => {
    // get the actual i18n key from the template itself
    const i18nKey = template.config[key];
    // compute the target property name by removing the I18n
    const targetProp = key.replace("I18n", "");
    // get the translation out of the translation file we fetched
    const val = getProp(translation, `addons.services.teams.groups.${i18nKey}`);
    // interpolate the title name into the translation string
    template[targetProp] = val.replace(/{title}/g, title);
  });
  return template;
}
