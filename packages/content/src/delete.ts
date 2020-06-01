import { IContentModel } from "./index";
import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Delete the content in Portal and also ping Hub API to remove from index.
 *
 * @param content - Content ID
 * @param requestOptions - Request options that may have authentication manager
 * @returns A Promise that will resolve with the entire Content object 
 * @export
 */
export function deleteContent(
  id: string,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  // TODO Implement methods
  if(hubRequestOptions.isPortal) {
    return _deleteContentFromPortal(content, hubRequestOptions);
  } else {
    // will remove from Portal and if successful remove from Hub index
    return _deleteContentFromHub(content, hubRequestOptions);
  }
}