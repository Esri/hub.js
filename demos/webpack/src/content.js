import { getContent } from '@esri/hub-content';

function component(html) {
  const element = document.createElement('div');

  element.innerHTML = html;

  return element;
}

(async () => {
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-Portal.html
  const id = 'e691172598f04ea8881cd2a4adaa45ba';
  // using portal in order to force lazy loading code to parse metadata xml
  const isPortal = true;
  const content = await getContent(id, { isPortal });

  document.body.appendChild(component(content.title));
})();
