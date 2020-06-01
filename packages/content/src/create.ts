import { IContentModel } from "./index";
import { IHubRequestOptions } from "@esri/hub-common";
import { createItem, IItem } from "@esri/arcgis-rest-portal";

/**
 * ```js
 * createContent(content)
 *  .then(result => {
 *    // handle result including new item id
 *  })
 * ```
 * Create the content in Portal and also ping Hub API to update index.
 *
 *
 * @param content - Content Model
 * @param requestOptions - Tequest options that may have authentication manager
 * @returns A Promise that will resolve with the entire Content object including the new ID 
 * @export
 */
export function createContent(
  content: IContentModel,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  if(hubRequestOptions.isPortal) {
    return _createContentInPortal(content, hubRequestOptions);
  } else {
    return _createContentInHub(content, hubRequestOptions);
  }
}

/**
 * Create the content in Portal
 *
 * @param content - Content Model
 * @param requestOptions - Request options that may have authentication manager
 * @returns A Promise that will resolve with the entire Content object including the new ID 
 * @export
 */
async function _createContentInPortal(
  content: IContentModel,
  hubRequestOptions?: IHubRequestOptions
): Promise<IContentModel> {

  // TODO: make this functional
  let item = _convertContentToItem(content);
  const createResponse = await createItem({
    item: item,
  });
  // hold onto the Id so we can return a complete model
  content.id = createResponse.id;
  content.item.id = createResponse.id;
  return new Promise((resolve) => resolve(content));
}
function _convertContentToItem(content: IContentModel):IItem {
  // TODO Convert Content to Item using mdJSON translations
  let item:IItem; 
  return item;
}

/**
 * Create the content in Hub + Portal
 *
 * @param content - Content Model
 * @param requestOptions - Request options that may have authentication manager
 * @returns A Promise that will resolve with the entire Content object including the new ID 
 * @export
 */
async function _createContentInHub(
  content: IContentModel,
  hubRequestOptions?: IHubRequestOptions
): Promise<any> {

  // First we create the item in Portal, then also add to the Hub API index
  // in the future the Hub API can use Hub.js to do the Portal proxy
  const updatedContent = await _createContentInPortal(content);
  // Add API and methods to directly update Hub
  // hubModule.createContent(updatedContent);
  return new Promise((resolve) => resolve(content));
  
}