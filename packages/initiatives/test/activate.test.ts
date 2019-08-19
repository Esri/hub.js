/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { cloneObject, createId } from "@esri/hub-common";
import { activateInitiative } from "../src/activate";
import * as portal from "@esri/arcgis-rest-portal";
import * as InitiativeFetchAPI from "../src/get";
import * as AddInitiativeAPI from "../src/add";
import * as ActivateInitiativeAPI from "../src/activate";
import * as InitiativeGroupsAPI from "../src/groups";
import * as UtilAPI from "../src/util";
import { InitiativeTemplate } from "./mocks/initiative-template";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";

const CBWrapper = {
  updateProgress(options: any): any {
    return;
  }
};

describe("Initiative Activation :: ", () => {
  let progressCallbackSpy: any;
  let createGroupsSpy: any;
  let addInitiativeSpy: any;
  let shareInitiativeSpy: any;
  let copyResourcesSpy: any;
  let copyEmbeddedResourcesSpy: any;

  beforeEach(function() {
    progressCallbackSpy = spyOn(CBWrapper, "updateProgress").and.callFake(
      (options: any): any => {
        return;
      }
    );

    createGroupsSpy = spyOn(
      InitiativeGroupsAPI,
      "createInitiativeGroups"
    ).and.callFake(
      (
        collaborationGroupName: string,
        dataGroupName: string,
        ro: any
      ): Promise<any> => {
        return Promise.resolve({
          collabGroupId: "3ef",
          dataGroupId: "2ef"
        });
      }
    );

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
        "Test Initiative Collaboration Group",
        "Test Initiative Open Data Group",
        CBWrapper.updateProgress,
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(response.item.id).toBe("3ef-NEW-INITIATIVE");
        // validate the call counts
        expect(createGroupsSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to create initiative groups"
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
          "should make 0 calls to copy embedded resources"
        );
        expect(shareInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to share initiative"
        );
        expect(progressCallbackSpy.calls.count()).toEqual(
          6,
          "should make 6 calls to callback"
        );
        // check the content of the first callback
        expect(progressCallbackSpy.calls.argsFor(0)[0].steps).toEqual(
          ActivateInitiativeAPI.steps
        );
        expect(response.item.properties.groupId).toEqual(
          "3ef",
          "has collab group"
        );
        expect(response.data.values.collaborationGroupId).toEqual(
          "3ef",
          "has collab group"
        );
        expect(response.item.properties.openDataGroupId).toEqual(
          "2ef",
          "has data group"
        );
        expect(response.data.values.openDataGroupId).toEqual(
          "2ef",
          "has data group"
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
        "Test Initiative Collaboration Group",
        "Test Initiative Open Data Group",
        CBWrapper.updateProgress,
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(response.item.id).toBe("3ef-NEW-INITIATIVE");
        // validate the call counts
        expect(getInitiativeSpy.calls.count()).toEqual(
          1,
          "should make one call to fetch the template"
        );
        expect(createGroupsSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to create initiative groups"
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
        expect(progressCallbackSpy.calls.count()).toEqual(
          6,
          "should make 6 calls to callback"
        );
        // check the content of the first callback
        expect(progressCallbackSpy.calls.argsFor(0)[0].steps).toEqual(
          ActivateInitiativeAPI.steps
        );

        done();
      });
    });

    it("should create an initiative without a data or collab group", done => {
      createGroupsSpy.and.callFake(
        (
          collaborationGroupName: string,
          dataGroupName: string,
          ro: any
        ): Promise<any> => {
          return Promise.resolve({});
        }
      );
      return activateInitiative(
        InitiativeTemplate,
        "Test Initiative",
        "Test Initiative Collaboration Group",
        "Test Initiative Open Data Group",
        CBWrapper.updateProgress,
        MOCK_REQUEST_OPTIONS
      ).then(response => {
        expect(shareInitiativeSpy.calls.count()).toEqual(
          0,
          "should make 0 calls to share initiative"
        );
        expect(response.item.properties.groupId).toBeUndefined();
        expect(response.data.values.collaborationGroupId).toBeUndefined();
        expect(response.item.properties.openDataGroupId).toBeUndefined();
        expect(response.data.values.openDataGroupId).toBeUndefined();
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
        "Test Initiative Collaboration Group",
        "Test Initiative Open Data Group",
        CBWrapper.updateProgress,
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
