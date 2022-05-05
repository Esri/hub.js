import Route from '@ember/routing/route';
import { fetchContent } from '@esri/hub-common';

export default class ContentRoute extends Route {
  async model () {
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-Portal.html
    const id = 'e691172598f04ea8881cd2a4adaa45ba';
    // using portal in order to force lazy loading code to parse metadata xml
    const isPortal = true;
    return await fetchContent(id, { isPortal });
  }
}
