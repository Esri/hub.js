import {
  createAnnotationService,
  ICreateAnnoRequestOptions
} from "../src/create";
import {
  annoSearchResponse,
  emptyAnnoSearchResponse
} from "./mocks/ago_search";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as items from "@esri/arcgis-rest-items";
import * as sharing from "@esri/arcgis-rest-sharing";
import * as featureServiceAdmin from "@esri/arcgis-rest-feature-service-admin";
import { ISearchRequestOptions } from "@esri/arcgis-rest-items";
// import { MOCK_REQUEST_OPTIONS } from "../../initiatives/test/mocks/fake-session";

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

// no clue why, but i see errors when i import the same thing from MOCK_REQUEST_OPTIONS
const authentication = new UserSession({
  username: "vader",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW
});

describe("createAnnotationService", () => {
  it("should create a new annotation service if one doesnt already exist", done => {
    const searchParamsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyAnnoSearchResponse);
      })
    );

    const createParamsSpy = spyOn(
      featureServiceAdmin,
      "createFeatureService"
    ).and.returnValue(
      new Promise(resolve => {
        resolve({
          encodedServiceURL:
            "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/hub_annotations/FeatureServer",
          itemId: "41a",
          name: "hub_annotations",
          serviceItemId: "41a",
          serviceurl:
            "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/hub_annotations/FeatureServer",
          size: -1,
          success: true,
          type: "Feature Service",
          isView: false
        });
      })
    );

    const protectParamsSpy = spyOn(items, "protectItem").and.returnValue(
      new Promise(resolve => {
        resolve({ success: true });
      })
    );

    const shareParamsSpy = spyOn(sharing, "setItemAccess").and.returnValue(
      new Promise(resolve => {
        resolve({
          notSharedWith: [],
          itemId: "41a"
        });
      })
    );

    const updateParamsSpy = spyOn(items, "updateItem").and.returnValue(
      new Promise(resolve => {
        resolve({
          success: true,
          id: "41a"
        });
      })
    );

    const addToParamsSpy = spyOn(
      featureServiceAdmin,
      "addToServiceDefinition"
    ).and.returnValue(
      new Promise(resolve => {
        resolve({
          success: true,
          layers: [{ name: "hub_annotations", id: 0 }]
        });
      })
    );

    const options = {
      orgId: "h7c",
      authentication
      // ...MOCK_REQUEST_OPTIONS
    } as ICreateAnnoRequestOptions;

    createAnnotationService(options).then(() => {
      expect(searchParamsSpy.calls.count()).toEqual(1);
      expect(shareParamsSpy.calls.count()).toEqual(1);
      expect(updateParamsSpy.calls.count()).toEqual(1);
      expect(addToParamsSpy.calls.count()).toEqual(1);
      expect(protectParamsSpy.calls.count()).toEqual(1);

      const opts = searchParamsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubAnnotationLayer AND orgid:h7c"
      );
      done();
    });
  });

  it("should not create a new annotation service if one already exists", done => {
    const searchParamsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(annoSearchResponse);
      })
    );

    const options = {
      orgId: "h7c",
      authentication
    } as ICreateAnnoRequestOptions;

    createAnnotationService(options).then(() => {
      expect(searchParamsSpy.calls.count()).toEqual(1);
      const opts = searchParamsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubAnnotationLayer AND orgid:h7c"
      );
      done();
    });
  });

  it("should fail gracefully if an error is encountered creating the feature service", done => {
    const searchParamsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyAnnoSearchResponse);
      })
    );

    const createParamsSpy = spyOn(
      featureServiceAdmin,
      "createFeatureService"
    ).and.returnValue(
      new Promise(resolve => {
        resolve({ success: false });
      })
    );

    const options = {
      orgId: "h7c",
      authentication
    } as ICreateAnnoRequestOptions;

    createAnnotationService(options).catch(err => {
      expect(searchParamsSpy.calls.count()).toEqual(1);
      expect(err.message).toEqual(
        "Failure to create service. One common cause is the presence of an existing hosted feature service that shares the same name."
      );
      done();
    });
  });
});
