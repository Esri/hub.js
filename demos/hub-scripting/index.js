import { Hub } from "@esri/hub-scripting";
var hub = new Hub({ username: 'dcadmin', password: 'dcadmin1', portal: 'devext.arcgis.com' });
hub.searchInitiatives('vision zero')
    .then(function (response) {
    response.results.map(function (itm) {
        // tslint:disable-next-line
        console.log("Title: " + itm.title);
    });
});
//# sourceMappingURL=index.js.map