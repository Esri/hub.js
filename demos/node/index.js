// fetch and form data polyfills required for rest-js
require("cross-fetch/polyfill");
require("isomorphic-form-data");
const { fetchContent } = require('@esri/hub-common');

(async () => {
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-Portal.html
  const id = 'e691172598f04ea8881cd2a4adaa45ba';
  // using portal in order to force lazy loading code to parse metadata xml
  const isPortal = true;
  const content = await fetchContent(id, { isPortal });

  console.log(content.title);
})();
