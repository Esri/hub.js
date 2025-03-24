import type { IItem } from "../../rest/types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubEntityLinks } from "../../core/types";
import { computeItemLinks } from "../../core/_internal/computeItemLinks";

/**
 * Compute the links that get appended to a Hub Template
 * search result and entity
 *
 * @param item
 * @param requestOptions
 */
export function computeLinks(
  item: IItem,
  requestOptions: IRequestOptions
): IHubEntityLinks {
  const links = computeItemLinks(item, requestOptions);

  // If a solution template is deployed, we don't support
  // managing it in the workspace, so we kick users to AGO
  const isDeployed = item.typeKeywords?.includes("Deployed");
  const { self, siteRelative, workspaceRelative } = links;
  // templates have an advanced edit link
  const advancedEditRelative = `${(siteRelative as string)
    .split("/")
    .slice(0, -1)
    .join("/")}/edit/advanced`;
  return {
    ...links,
    // handle deployed templates
    workspaceRelative: isDeployed ? self : workspaceRelative,
    // add advanced edit relative link
    advancedEditRelative,
  };
}
