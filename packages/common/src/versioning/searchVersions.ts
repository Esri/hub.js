import { getItemResources } from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IVersionMetadata } from "./types";
import { versionMetadataFromResource } from "./_internal";

/**
 * Return an array containing the versions of the item
 * @param id
 * @param requestOptions
 * @returns
 */
export async function searchVersions(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<IVersionMetadata[]> {
  const resources = await getItemResources(id, {
    ...requestOptions,
    params: { sortField: "created", sortOrder: "desc" },
  });

  // the resources api does not support q - so we fetch all of them and do the filtering here

  return resources.resources
    .filter((resource: any) =>
      resource.resource.match(/^hubVersion_[a-zA-Z0-9_\s]*\/version.json/)
    )
    .map(versionMetadataFromResource);
}

// // site specific stuff

// // export async function getSiteByVersion (siteId: string, versionName: string, requestOptions: any) {
// //   // if version not supplied, return site item, if supplied get item and version and munge them
// //   const site: any = await getSiteById(siteId, requestOptions);
// //   if (versionName) {
// //     const versionResource = await getVersion(siteId, versionName, requestOptions);
// //     site.data.values.layout = applyVersion(versionResource, site);
// //   }
// //   return site;
// // }

// export async function publishSiteVersion (site: any, version: IVersion, requestOptions: IHubRequestOptions) {
//   // we expect the site to contain the changes that we want to apply to the version
//   // but we also need the versionResource so we can preserve the created and creator props

//   await updateVersion(site, version, requestOptions);

//   // add a prop to the site indicating the published version
//   let typeKeywords: string[] = getProp(site, 'item.typeKeywords') || [];
//   typeKeywords = typeKeywords.filter(keyword => !keyword.match(/^hubSiteLayoutVersionPublished:/));
//   typeKeywords.push(`hubSiteLayoutVersionPublished:${version.id}`);
//   site.item.typeKeywords = typeKeywords;

//   // save the site
//   // TODO: requestOptions takes allowList and updateVersions props...
//   return updateSite(site, requestOptions as any);
// }
