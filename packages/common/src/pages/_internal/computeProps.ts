import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IHubPage } from "../../core";
import { IModel } from "../../types";
import { PageDefaultCapabilities } from "./PageBusinessRules";
import { processEntityCapabilities } from "../../capabilities";

/**
 * Given a model and a page, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param page
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  page: Partial<IHubPage>,
  requestOptions: IRequestOptions
): IHubPage {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // thumbnail url
  page.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);

  // Handle Dates
  page.createdDate = new Date(model.item.created);
  page.createdDateSource = "item.created";
  page.updatedDate = new Date(model.item.modified);
  page.updatedDateSource = "item.modified";

  // // Handle capabilities
  page.capabilities = processEntityCapabilities(
    model.data.settings?.capabilities || {},
    PageDefaultCapabilities
  );

  // cast b/c this takes a partial but returns a full page
  return page as IHubPage;
}
