/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { searchInitiatives } from '@esri/hub-initiatives';
import { UserSession } from "@esri/arcgis-rest-auth";
/**
 * @returns not much
 */
var Hub = /** @class */ (function () {
    function Hub(options) {
        if (options) {
            this.session = new UserSession(options);
        }
    }
    /**
     * Search for initiatives
     *
     * @param {(string | ISearchRequestOptions)} options
     * @returns Promise that resolves with the search results
     * @memberof Hub
     */
    Hub.prototype.searchInitiatives = function (options) {
        var opts = this.constructSearchRequestOptions(options);
        if (this.session) {
            opts.authentication = this.session;
        }
        return searchInitiatives(opts);
    };
    Hub.prototype.constructSearchRequestOptions = function (options) {
        // default search is all initiatives
        var opts = {
            searchForm: {
                q: 'type: Hub Initiative'
            }
        };
        // if we just got a string, attach it in as the q
        if (typeof options === 'string') {
            opts.searchForm.q = options + " AND type: Hub Initiative";
        }
        else if (options.searchForm) {
            opts.searchForm = options.searchForm;
        }
        return opts;
    };
    return Hub;
}());
export { Hub };
//# sourceMappingURL=hub.js.map