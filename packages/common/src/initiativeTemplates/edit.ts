import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubInitiativeTemplate } from "../core/types/IHubInitiativeTemplate";

/**
 * @private
 * Create a new Hub Initiative Template item
 * @param partialInitiativeTemplate
 * @param requestOptions
 * @returns
 */
export async function createInitiativeTemplate(
  partialInitiativeTemplate: Partial<IHubInitiativeTemplate>,
  requestOptions: IUserRequestOptions
): Promise<IHubInitiativeTemplate> {
  // TODO
  return;
}

/**
 * @private
 * Update a Hub Initiative Template
 * @param initiativeTemplate
 * @param requestOptions
 */
export async function updateInitiativeTemplate(
  initiativeTemplate: IHubInitiativeTemplate,
  requestOptions: IUserRequestOptions
): Promise<IHubInitiativeTemplate> {
  // TODO
  return;
}

/**
 * @private
 * Remove a Hub Initiative Template
 * @param id
 * @param requestOptions
 */
export async function deleteInitiativeTemplate(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  // TODO
  return;
}
