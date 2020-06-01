import { IContentModel } from "./index";
import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Update the content in Portal and also ping Hub API to update index.
 *
 * @param content - Content Model
 * @param requestOptions - Request options that may have authentication manager
 * @returns A Promise that will resolve with the entire Content object 
 * @export
 */
export function updateContent(
  content: IContentModel,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  // TODO Implement methods
  if(hubRequestOptions.isPortal) {
    return _updateContentInPortal(content, hubRequestOptions);
  } else {
    // will update in Portal and if successful update in Hub index    
    return _updateContentInHub(content, hubRequestOptions);
  }
}