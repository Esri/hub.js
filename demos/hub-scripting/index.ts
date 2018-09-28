import { Hub } from "@esri/hub-scripting";

const hub = new Hub({
  username: "dcadmin",
  password: "dcadmin1",
  portal: "devext.arcgis.com"
});

hub.searchInitiatives("vision zero").then(response => {
  response.results.map(itm => {
    // tslint:disable-next-line
    console.log(`Title: ${itm.title}`);
  });
});
