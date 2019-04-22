import { createAnnotationService, ICreateAnnoOptions } from "../src/create";
import { annotationServiceDefinition } from "../src/layer-definition";
import {
  annoSearchResponse,
  emptyAnnoSearchResponse
} from "./mocks/ago_search";
import { portalResponse } from "./mocks/portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as items from "@esri/arcgis-rest-portal";
import * as sharing from "@esri/arcgis-rest-portal";
import * as request from "@esri/arcgis-rest-request";
import * as portal from "@esri/arcgis-rest-portal";
import * as featureServiceAdmin from "@esri/arcgis-rest-service-admin";
import { IExtent } from "@esri/arcgis-rest-types";
import {
  ISearchOptions,
  IUpdateItemOptions,
  IUserItemOptions
} from "@esri/arcgis-rest-portal";
import { ISetAccessOptions } from "@esri/arcgis-rest-portal";
import {
  ICreateServiceOptions,
  IAddToServiceDefinitionOptions
} from "@esri/arcgis-rest-service-admin";

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

const clonedServiceDefinition = JSON.parse(
  JSON.stringify(annotationServiceDefinition)
);

clonedServiceDefinition.extent = portalResponse.defaultExtent as IExtent;

describe("createAnnotationService", () => {
  it("should create a new annotation service if one doesnt already exist", done => {
    const searchParamsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyAnnoSearchResponse);
      })
    );

    const portalParamsSpy = spyOn(portal, "getPortal").and.returnValue(
      new Promise(resolve => {
        resolve(portalResponse);
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

    // MOCK_REQUEST_OPTIONS from "../../initiatives/test/mocks/fake-session" didnt work;
    const options = {
      orgId: "h7c",
      authentication
    } as ICreateAnnoOptions;

    createAnnotationService(options)
      .then(() => {
        expect(searchParamsSpy.calls.count()).toEqual(1);
        expect(portalParamsSpy.calls.count()).toEqual(1);
        expect(createParamsSpy.calls.count()).toEqual(1);
        expect(shareParamsSpy.calls.count()).toEqual(1);
        expect(updateParamsSpy.calls.count()).toEqual(1);
        expect(addToParamsSpy.calls.count()).toEqual(1);
        expect(protectParamsSpy.calls.count()).toEqual(1);

        const searchOpts = searchParamsSpy.calls.argsFor(
          0
        )[0] as ISearchOptions;
        expect(searchOpts.q).toEqual(
          "typekeywords:hubAnnotationLayer AND orgid:h7c"
        );

        const createOpts = createParamsSpy.calls.argsFor(
          0
        )[0] as ICreateServiceOptions;
        expect(createOpts.item.name).toEqual("hub_annotations");
        expect(createOpts.item.capabilities).toEqual(
          annotationServiceDefinition.capabilities
        );
        expect(createOpts.item.maxRecordCount).toEqual(2000);
        expect(createOpts.item.hasStaticData).toEqual(false);
        expect(
          createOpts.item.editorTrackingInfo.allowAnonymousToUpdate
        ).toEqual(false);
        expect(
          createOpts.item.editorTrackingInfo.allowAnonymousToDelete
        ).toEqual(false);
        expect(createOpts.item.xssPreventionInfo.xssPreventionEnabled).toEqual(
          true
        );
        expect(createOpts.authentication.token).toEqual("fake-token");

        expect(addToParamsSpy.calls.argsFor(0)[0]).toEqual(
          "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/hub_annotations/FeatureServer"
        );
        const addToOpts = addToParamsSpy.calls.argsFor(
          0
        )[1] as IAddToServiceDefinitionOptions;
        expect(addToOpts.layers).toEqual([clonedServiceDefinition]);
        expect(addToOpts.authentication.token).toEqual("fake-token");

        const updateOpts = updateParamsSpy.calls.argsFor(
          0
        )[0] as IUpdateItemOptions;
        expect(updateOpts.item.id).toEqual("41a");
        expect(updateOpts.item.title).toEqual("Hub Annotations");
        expect(
          updateOpts.item.typeKeywords.includes("hubAnnotationLayer")
        ).toEqual(true);
        expect(updateOpts.item.snippet).toEqual(
          `Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.`
        );
        expect(updateOpts.authentication.token).toEqual("fake-token");

        const protectOpts = protectParamsSpy.calls.argsFor(
          0
        )[0] as IUserItemOptions;
        expect(protectOpts.id).toEqual("41a");
        expect(protectOpts.authentication.token).toEqual("fake-token");

        const shareOpts = shareParamsSpy.calls.argsFor(
          0
        )[0] as ISetAccessOptions;
        expect(shareOpts.id).toEqual("41a");
        expect(shareOpts.access).toEqual("public");
        expect(shareOpts.authentication.token).toEqual("fake-token");

        done();
      })
      .catch(() => fail());
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
    } as ICreateAnnoOptions;

    createAnnotationService(options)
      .then(() => {
        expect(searchParamsSpy.calls.count()).toEqual(1);
        const opts = searchParamsSpy.calls.argsFor(0)[0] as ISearchOptions;
        expect(opts.q).toEqual("typekeywords:hubAnnotationLayer AND orgid:h7c");
        done();
      })
      .catch(() => fail());
  });

  it("should fail gracefully if an error is encountered creating the feature service", done => {
    const searchParamsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyAnnoSearchResponse);
      })
    );

    spyOn(portal, "getPortal").and.returnValue(
      new Promise(resolve => {
        resolve({ portalResponse });
      })
    );

    spyOn(featureServiceAdmin, "createFeatureService").and.returnValue(
      new Promise(resolve => {
        resolve({ success: false });
      })
    );

    const options = {
      orgId: "h7c",
      authentication
    } as ICreateAnnoOptions;

    createAnnotationService(options).catch(err => {
      expect(searchParamsSpy.calls.count()).toEqual(1);
      const opts = searchParamsSpy.calls.argsFor(0)[0] as ISearchOptions;
      expect(opts.q).toEqual("typekeywords:hubAnnotationLayer AND orgid:h7c");
      expect(err.message).toEqual(
        "Failure to create service. One common cause is the presence of an existing service that shares the same name."
      );
      done();
    });
  });
});
