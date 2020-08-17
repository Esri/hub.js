import { IHubRequestOptions } from "@esri/hub-common";
import { getInitiative } from "./get";
import { convertInitiativeToTemplate } from "./convert-initiative-to-template";
import { getDefaultInitiativeTemplate } from "./get-default-initiative-template";

/**
 * Given the id of an initiative, fetch it, and convert to a template
 * If the fetch fails, it will return the default initiative template
 * @param {string} id Initiative Item Id
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _fetchAndConvertInitiativeToTemplate(
  id: string,
  hubRequestOptions: IHubRequestOptions
) {
  return getInitiative(id, hubRequestOptions)
    .then(model => {
      return convertInitiativeToTemplate(model, hubRequestOptions);
    })
    .catch(_ => {
      return getDefaultInitiativeTemplate(hubRequestOptions);
    });
}
