import { searchItems } from '@esri/arcgis-rest-portal';
import { IAuthenticationManager } from '@esri/arcgis-rest-request';

/**
 * Check if a site/page exists with a specific name
*/
export function doesItemExistWithTitle (
  itemTitle: string,
  options: Record<string,string>,
  authMgr: IAuthenticationManager,
) {
  // if options have multiple properties, put them into one string separated with 'AND'
  let optionsQuery = Object.keys(options).map(key => {
    return `${key}:"${options[key]}"`;
  }).join(' AND ');
  let opts = {
    q: `title:"${itemTitle}" AND ${optionsQuery}`,
    authentication: authMgr
  };
  return searchItems(opts)
    .then(searchResponse => searchResponse.results.length > 0)
    .catch(e => {
      throw Error(`Error in doesItemExistWithTitle ${e}`);
    });
}
