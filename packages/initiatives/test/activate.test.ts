/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { cloneObject } from "@esri/hub-common";
import { activateInitiative } from "../src/activate";
import * as portal from "@esri/arcgis-rest-portal";
import * as InitiativeFetchAPI from "../src/get";
import * as AddInitiativeAPI from "../src/add";
import * as UtilAPI from "../src/util";
import { InitiativeTemplate } from "./mocks/initiative-template";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";

describe("Initiative Activation :: ", () => {
  let addInitiativeSpy: any;
  let shareInitiativeSpy: any;
  let copyResourcesSpy: any;
  let copyEmbeddedResourcesSpy: any;

  beforeEach(function() {
    addInitiativeSpy = spyOn(AddInitiativeAPI, "addInitiative").and.callFake(
      (model: any, ro: any): Promise<any> => {
        const res = cloneObject(model);
        res.item.id = "3ef-NEW-INITIATIVE";
        return Promise.resolve(res);
      }
    );

    shareInitiativeSpy = spyOn(portal, "shareItemWithGroup").and.callFake(
      (opts: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    copyResourcesSpy = spyOn(UtilAPI, "copyImageResources").and.callFake(
      (
        id: string,
        i: string,
        o: string,
        a: string[],
        ro: any
      ): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    copyEmbeddedResourcesSpy = spyOn(
      UtilAPI,
      "copyEmbeddedImageResources"
    ).and.callFake(
      (id: string, owner: string, assets: any[], ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );
  });

  describe("activateInitiative() ::", () => {
    it("should accept an object as the template", done => {
      // This function is really just orchestrating calls to finer-grained functions
      // the validation of the output object structure etc is covered in other tests
      // the validation of API calls is covered in other tests
      return activateInitiative(
        InitiativeTemplate,
        "Test Initiative",
        {
          contentGroupId: "3ef",
          collaborationGroupId: "2ef",
          followersGroupId: "1ef"
        },
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(response.item.id).toBe("3ef-NEW-INITIATIVE");
        // validate the call counts
        expect(addInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to create initiative item"
        );
        expect(copyResourcesSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to copy resources"
        );
        expect(copyEmbeddedResourcesSpy.calls.count()).toEqual(
          0,
          "should make 0 calls to copy embedded resources"
        );
        expect(shareInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to share initiative"
        );
        expect(response.item.properties.contentGroupId).toEqual(
          "3ef",
          "has content group"
        );
        expect(response.item.properties.collaborationGroupId).toEqual(
          "2ef",
          "has core team"
        );
        expect(response.item.properties.followersGroupId).toEqual(
          "1ef",
          "has followers group"
        );
        done();
      });
    });

    it("should fetch an initiative if an id is passed", done => {
      const getInitiativeSpy = spyOn(
        InitiativeFetchAPI,
        "getInitiative"
      ).and.callFake(
        (id: string, ro: any): Promise<any> => {
          return Promise.resolve(InitiativeTemplate);
        }
      );
      // This function is really just orchestrating calls to finer-grained functions
      // the validation of the output object structure etc is covered in other tests
      // the validation of API calls is covered in other tests
      return activateInitiative(
        InitiativeTemplate.item.id,
        "Test Initiative",
        {
          contentGroupId: "3ef",
          collaborationGroupId: "2ef",
          followersGroupId: "1ef"
        },
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(response.item.id).toBe("3ef-NEW-INITIATIVE");
        // validate the call counts
        expect(getInitiativeSpy.calls.count()).toEqual(
          1,
          "should make one call to fetch the template"
        );
        expect(addInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to create initiative item"
        );
        expect(copyResourcesSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to copy resources"
        );
        expect(copyEmbeddedResourcesSpy.calls.count()).toEqual(
          0,
          "should make 0 call to copy embedded resources"
        );
        expect(shareInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to share initiative"
        );
        expect(response.item.properties.contentGroupId).toEqual(
          "3ef",
          "has content group"
        );
        expect(response.data.values.contentGroupId).toEqual(
          "3ef",
          "has content group"
        ); // TODO remove
        expect(response.item.properties.collaborationGroupId).toEqual(
          "2ef",
          "has core team"
        );
        expect(response.data.values.collaborationGroupId).toEqual(
          "2ef",
          "has core team"
        ); // TODO remove
        expect(response.item.properties.followersGroupId).toEqual(
          "1ef",
          "has followers group"
        );
        expect(response.data.values.followersGroupId).toEqual(
          "1ef",
          "has followers group"
        ); // TODO remove
        done();
      });
    });

    it("should create an initiative without a data or collab group", done => {
      return activateInitiative(
        InitiativeTemplate,
        "Test Initiative",
        {},
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(response.item.properties.collaborationGroupId).toBeUndefined();
        expect(response.item.properties.contentGroupId).toBeUndefined();
        done();
      });
    });

    it("should copy embedded image resources", done => {
      InitiativeTemplate.assets = [
        {
          name: "foo"
        }
      ];
      return activateInitiative(
        InitiativeTemplate,
        "Test Initiative",
        {},
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(response.item.id).toBe("3ef-NEW-INITIATIVE");
        // validate the call counts
        expect(copyResourcesSpy.calls.count()).toEqual(
          0,
          "should make 0 calls to copy resources"
        );
        expect(copyEmbeddedResourcesSpy.calls.count()).toEqual(
          1,
          "should make 1 call to copy resources"
        );
        delete InitiativeTemplate.assets;
        done();
      });
    });
  });
});
