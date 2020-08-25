import { IHubRequestOptions } from "@esri/hub-common";
import { getItemResources } from "@esri/arcgis-rest-portal";

/**
 * Gets the name of the resource for the current draft
 * @param siteOrPageId
 * @param hubRequestOptions
 */
export function _getDraftResourceName(
  siteOrPageId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<string> {
  const draftResourceRegex = /^draft-\d+.json$/;

  return getItemResources(siteOrPageId, {
    portal: hubRequestOptions.portal,
    authentication: hubRequestOptions.authentication
  }).then(response => {
    // search through the resources to find the draft
    const draftResourceNames = response.resources
      .map(({ resource: name }: { resource: string }) => name)
      .filter((name: string) => name.search(draftResourceRegex) !== -1);

    let draftResourceName = "";
    if (draftResourceNames.length) {
      draftResourceName = draftResourceNames[0];
    }
    return draftResourceName;
  });
}
