import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getItemHomeUrl } from "../urls";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { isValidEntityType } from "./isValidEntityType";
import { HubEntity } from "./types";

/**
 * From within the context of a hub site, the following util
 * returns an entity's relative workspace URL
 *
 * @param type entity type
 * @param identifier entity id or slug
 */
export const getRelativeWorkspaceUrl = (
  type: string,
  identifier: string,
  typeKeywords?: string[],
  requestOptions?: IRequestOptions
): string => {
  let url = "/";
  const entityType = getTypeFromEntity({ type } as HubEntity);

  /**
   * Note: this logic will likely need to be enhanced to:
   * 1. accommodate enterprise
   * 2. handle entity variation
   */
  if (isValidEntityType(entityType)) {
    let typeSegment = entityType as string;
    if (typeSegment !== "content") {
      typeSegment = `${typeSegment}s`;
    }
    url = `/workspace/${typeSegment}/${identifier}`;

    // If a solution template is deployed, we don't support
    // managing it in the workspace, so we kick users to AGO
    if (entityType === "template" && typeKeywords?.includes("Deployed")) {
      url = getItemHomeUrl(identifier, requestOptions);
    }
  }

  return url;
};
