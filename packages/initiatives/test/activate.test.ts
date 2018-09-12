/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { cloneObject, createId } from "@esri/hub-common";
import { activateInitiative } from "../src/activate";
import * as RequestAPI from "@esri/arcgis-rest-request";
import * as SharingAPI from "@esri/arcgis-rest-sharing";
import * as InitiativeFetchAPI from "../src/fetch";
import * as AddInitiativeAPI from "../src/add";
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
  describe("activateInitiative() ::", () => {
    it("should accept an object as the template", done => {
      const portalSelfSpy = spyOn(RequestAPI, "getSelf").and.callFake(() => {
        return Promise.resolve({
          id: "FAKEPORTALID"
        });
      });

      const progressCallbackSpy = spyOn(
        CBWrapper,
        "updateProgress"
      ).and.callFake((options: any): any => {
        return;
      });

      const groupNamesSpy = spyOn(
        InitiativeGroupsAPI,
        "getUniqueGroupName"
      ).and.callFake(
        (name: string, id: string, step: number, ro: any): string => {
          return name;
        }
      );

      const createGroupSpy = spyOn(
        InitiativeGroupsAPI,
        "createInitiativeGroup"
      ).and.callFake((name: string, desc: string, opts: any, ro: any): Promise<
        string
      > => {
        if (opts.isSharedEditing) {
          return Promise.resolve("d33-collab-group");
        } else {
          return Promise.resolve("b33-opendata-group");
        }
      });

      const addInitiativeSpy = spyOn(
        AddInitiativeAPI,
        "addInitiative"
      ).and.callFake((model: any, ro: any): Promise<any> => {
        const res = cloneObject(model);
        res.item.id = "3ef-NEW-INITIATIVE";
        return Promise.resolve(res);
      });

      const copyResourcesSpy = spyOn(
        UtilAPI,
        "copyImageResources"
      ).and.callFake(
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

      const shareInitiativeSpy = spyOn(
        SharingAPI,
        "shareItemWithGroup"
      ).and.callFake((opts: any): Promise<any> => {
        return Promise.resolve({ success: true });
      });
      // This function is reall just orchestrating calls to finer-grained functions
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
        expect(portalSelfSpy.calls.count()).toEqual(
          1,
          "should make one call to fetch the portal"
        );
        expect(groupNamesSpy.calls.count()).toEqual(
          2,
          "should make 2 calls to check group names"
        );
        expect(createGroupSpy.calls.count()).toEqual(
          2,
          "should make 2 calls to create groups"
        );
        expect(addInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to create initiative item"
        );
        expect(copyResourcesSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to copy resources"
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
        expect(progressCallbackSpy.calls.count()).toEqual(
          6,
          "should make 6 calls to callback"
        );

        done();
      });
    });
    it("should fetch an initiative if an id is passed", done => {
      const portalSelfSpy = spyOn(RequestAPI, "getSelf").and.callFake(() => {
        return Promise.resolve({
          id: "FAKEPORTALID"
        });
      });

      const fetchInitiativeSpy = spyOn(
        InitiativeFetchAPI,
        "fetchInitiative"
      ).and.callFake((id: string, ro: any): Promise<any> => {
        return Promise.resolve(InitiativeTemplate);
      });

      const progressCallbackSpy = spyOn(
        CBWrapper,
        "updateProgress"
      ).and.callFake((options: any): any => {
        return;
      });

      const groupNamesSpy = spyOn(
        InitiativeGroupsAPI,
        "getUniqueGroupName"
      ).and.callFake(
        (name: string, id: string, step: number, ro: any): string => {
          return name;
        }
      );

      const createGroupSpy = spyOn(
        InitiativeGroupsAPI,
        "createInitiativeGroup"
      ).and.callFake((name: string, desc: string, opts: any, ro: any): Promise<
        string
      > => {
        if (opts.isSharedEditing) {
          return Promise.resolve("d33-collab-group");
        } else {
          return Promise.resolve("b33-opendata-group");
        }
      });

      const addInitiativeSpy = spyOn(
        AddInitiativeAPI,
        "addInitiative"
      ).and.callFake((model: any, ro: any): Promise<any> => {
        const res = cloneObject(model);
        res.item.id = "3ef-NEW-INITIATIVE";
        return Promise.resolve(res);
      });

      const copyResourcesSpy = spyOn(
        UtilAPI,
        "copyImageResources"
      ).and.callFake(
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

      const shareInitiativeSpy = spyOn(
        SharingAPI,
        "shareItemWithGroup"
      ).and.callFake((opts: any): Promise<any> => {
        return Promise.resolve({ success: true });
      });
      // This function is reall just orchestrating calls to finer-grained functions
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
        expect(portalSelfSpy.calls.count()).toEqual(
          1,
          "should make one call to fetch the portal"
        );
        expect(fetchInitiativeSpy.calls.count()).toEqual(
          1,
          "should make one call to fetch the template"
        );
        expect(groupNamesSpy.calls.count()).toEqual(
          2,
          "should make 2 calls to check group names"
        );
        expect(createGroupSpy.calls.count()).toEqual(
          2,
          "should make 2 calls to create groups"
        );
        expect(addInitiativeSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to create initiative item"
        );
        expect(copyResourcesSpy.calls.count()).toEqual(
          1,
          "should make 1 calls to copy resources"
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
        expect(progressCallbackSpy.calls.count()).toEqual(
          6,
          "should make 6 calls to callback"
        );

        done();
      });
    });
  });
});
