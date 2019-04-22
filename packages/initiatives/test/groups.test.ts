/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as PortalApi from "@esri/arcgis-rest-portal";
import {
  IGroup,
  ISearchOptions,
  ISearchResult,
  ICreateGroupOptions,
  IUserGroupOptions
} from "@esri/arcgis-rest-portal";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  checkGroupExists,
  isSharedEditingGroup,
  createInitiativeGroup,
  getUniqueGroupName,
  removeInitiativeGroup
} from "../src/groups";

const fakeGroup = {
  title: "This is the fake group",
  isOpenData: false,
  capabilities: ["updateitemcontrol"],
  owner: "jeffvader",
  id: "bc432",
  protected: false,
  tags: ["wat"],
  created: 12345,
  modified: 23421,
  isInvitationOnly: false,
  isFav: false,
  isViewOnly: false,
  autoJoin: true,
  access: "public"
} as IGroup;

describe("Initiative Groups ::", () => {
  let createGroupSpy: any;
  let protectGroupSpy: any;
  beforeEach(() => {
    createGroupSpy = spyOn(PortalApi, "createGroup").and.callFake(
      (opts: ICreateGroupOptions) => {
        return Promise.resolve({ success: true, group: { id: "3ef" } });
      }
    );
    protectGroupSpy = spyOn(PortalApi, "protectGroup").and.callFake(
      (opts: IUserGroupOptions) => {
        return Promise.resolve({ success: true, id: "3ef" });
      }
    );
  });
  describe("createInitiativeGroup ::", () => {
    it("should create and protect a generic group", done => {
      // const createGroupSpy = spyOn(PortalApi, "createGroup").and.callFake(
      //   (opts: ICreateGroupOptions) => {
      //     return Promise.resolve({ success: true, group: { id: "3ef" } });
      //   }
      // );
      // const protectGroupSpy = spyOn(PortalApi, "protectGroup").and.callFake(
      //   (opts: IUserGroupOptions) => {
      //     return Promise.resolve({ success: true });
      //   }
      // );

      return createInitiativeGroup(
        "generic group",
        "generic description",
        {},
        MOCK_REQUEST_OPTIONS
      ).then(res => {
        expect(createGroupSpy.calls.count()).toEqual(
          1,
          "should make one call to createGroup"
        );
        const createArgs = createGroupSpy.calls.argsFor(0); // as ICreateGroupOptions;
        const grp = createArgs[0].group;
        expect(grp.isOpenData).not.toBeDefined(
          "isOpenData should not be defined"
        );
        expect(grp.public).not.toBeDefined("public prop should not be present");
        expect(grp.tags).not.toBeDefined("public prop should not be present");
        expect(protectGroupSpy.calls.count()).toEqual(
          1,
          "should make one call to protectGroup"
        );
        done();
      });
    });
    it("should create and protect an Open Data group", done => {
      return createInitiativeGroup(
        "od group",
        "od description",
        { isOpenData: true },
        MOCK_REQUEST_OPTIONS
      ).then(res => {
        expect(createGroupSpy.calls.count()).toEqual(
          1,
          "should make one call to createGroup"
        );
        const createArgs = createGroupSpy.calls.argsFor(0); // as ICreateGroupOptions;
        const grp = createArgs[0].group;
        expect(grp.tags.indexOf("Hub Initiative Group")).toBeGreaterThan(
          -1,
          "HIG tag should be present"
        );
        expect(grp.tags.indexOf("Open Data")).toBeGreaterThan(
          -1,
          "OD tag should be present"
        );
        expect(grp.isOpenData).toBeTruthy("isOpenData should be true");
        expect(protectGroupSpy.calls.count()).toEqual(
          1,
          "should make one call to protectGroup"
        );
        done();
      });
    });
    it("should create and protect a collaboration group", done => {
      // const createGroupSpy = spyOn(PortalApi, "createGroup").and.callFake(
      //   (opts: ICreateGroupOptions) => {
      //     return Promise.resolve({ success: true, group: { id: "3ef" } });
      //   }
      // );
      // const protectGroupSpy = spyOn(PortalApi, "protectGroup").and.callFake(
      //   (opts: IUserGroupOptions) => {
      //     return Promise.resolve({ success: true, id: "3ef" });
      //   }
      // );
      return createInitiativeGroup(
        "generic group",
        "generic description",
        { isSharedEditing: true },
        MOCK_REQUEST_OPTIONS
      ).then(res => {
        expect(createGroupSpy.calls.count()).toEqual(
          1,
          "should make one call to createGroup"
        );
        const createArgs = createGroupSpy.calls.argsFor(0); // as ICreateGroupOptions;
        const grp = createArgs[0].group;
        expect(grp.tags.indexOf("Hub Initiative Group")).toBeGreaterThan(
          -1,
          "HIG tag should be present"
        );
        expect(
          grp.tags.indexOf("initiativeCollaborationGroup")
        ).toBeGreaterThan(
          -1,
          "initiativeCollaborationGroup tag should be present"
        );
        expect(grp._edit_privacy).toEqual("on", "edit_privacy should be on");
        expect(grp._edit_contributors).toEqual(
          "on",
          "_edit_contributors should be on"
        );
        expect(grp.isOpenData).not.toBeDefined(
          "isOpenData should not be defined"
        );
        expect(protectGroupSpy.calls.count()).toEqual(
          1,
          "should make one call to protectGroup"
        );
        done();
      });
    });
  });

  describe("removeInitiativeGroup", () => {
    let removeGroupSpy: any;
    let unprotectGroupSpy: any;
    beforeEach(() => {
      removeGroupSpy = spyOn(PortalApi, "removeGroup").and.callFake(
        (opts: ICreateGroupOptions) => {
          return Promise.resolve({ success: true, group: { id: "3ef" } });
        }
      );
    });
    it("unprotects and removes the group", done => {
      unprotectGroupSpy = spyOn(PortalApi, "unprotectGroup").and.callFake(
        (opts: IUserGroupOptions) => {
          return Promise.resolve({ success: true, id: "3ef" });
        }
      );
      return removeInitiativeGroup("BZ7426", MOCK_REQUEST_OPTIONS).then(
        result => {
          expect(result.success).toBeTruthy();
          expect(unprotectGroupSpy.calls.count()).toEqual(1);
          expect(removeGroupSpy.calls.count()).toEqual(1);
          done();
        }
      );
    });
    it("returns success if group does not exist", done => {
      unprotectGroupSpy = spyOn(PortalApi, "unprotectGroup").and.callFake(
        (opts: IUserGroupOptions) => {
          return Promise.reject({ code: 400, messageCode: "COM_0003" });
        }
      );
      return removeInitiativeGroup("BZ7426", MOCK_REQUEST_OPTIONS).then(
        result => {
          expect(result.success).toBeTruthy();
          expect(unprotectGroupSpy.calls.count()).toEqual(1);
          expect(removeGroupSpy.calls.count()).toEqual(0);
          done();
        }
      );
    });
    it("throws on some other error", done => {
      unprotectGroupSpy = spyOn(PortalApi, "unprotectGroup").and.callFake(
        (opts: IUserGroupOptions) => {
          return Promise.reject({ code: 502, messageCode: "WAT" });
        }
      );
      return removeInitiativeGroup("BZ7426", MOCK_REQUEST_OPTIONS).catch(ex => {
        expect(ex.messageCode).toEqual("WAT");
        done();
      });
    });
  });

  describe("checkGroupExists ::", () => {
    it("returns true and the group if it exists", done => {
      const searchSpy = spyOn(PortalApi, "searchGroups").and.callFake(
        (opts: ISearchOptions) => {
          const res = {
            results: [fakeGroup],
            query: opts.q,
            total: 1,
            start: 1,
            num: 1,
            nextStart: -1
          } as ISearchResult<IGroup>;
          return Promise.resolve(res);
        }
      );
      return checkGroupExists(
        "Some Fake Group",
        "BZ7426",
        MOCK_REQUEST_OPTIONS
      ).then((res: any) => {
        expect(res.exists).toBeTruthy("exists should be true");
        expect(res.group).toBeDefined("should return a group");
        expect(res.group.title).toBe(
          fakeGroup.title,
          "should return the group"
        );
        expect(searchSpy.calls.count()).toEqual(
          1,
          "should make one call to searchGroups"
        );
        done();
      });
    });
    it("returns false if group does not exist", done => {
      const searchSpy = spyOn(PortalApi, "searchGroups").and.callFake(
        (opts: ISearchOptions) => {
          const res = {
            results: [],
            query: opts.q,
            total: 0,
            start: 0,
            num: 0,
            nextStart: -1
          } as ISearchResult<IGroup>;
          return Promise.resolve(res);
        }
      );
      return checkGroupExists(
        "Some Fake Group",
        "BZ7426",
        MOCK_REQUEST_OPTIONS
      ).then((res: any) => {
        expect(res.exists).toBeFalsy("exists should be false");
        expect(res.group).not.toBeDefined("should not return a group");
        expect(searchSpy.calls.count()).toEqual(
          1,
          "should make one call to searchGroups"
        );
        done();
      });
    });
  });

  describe("getUniqueGroupName ::", () => {
    it("return original name of no group exists", done => {
      const searchSpy = spyOn(PortalApi, "searchGroups").and.callFake(
        (opts: ISearchOptions) => {
          const res = {
            results: [],
            query: opts.q,
            total: 0,
            start: 0,
            num: 0,
            nextStart: -1
          } as ISearchResult<IGroup>;
          return Promise.resolve(res);
        }
      );
      return getUniqueGroupName(
        "foo bar baz",
        "BZ7426",
        0,
        MOCK_REQUEST_OPTIONS
      ).then((res: string) => {
        expect(res).toBe("foo bar baz");
        expect(searchSpy.calls.count()).toEqual(
          1,
          "should make one call to searchGroups"
        );
        done();
      });
    });
    it("append a number to original name of group exists", done => {
      const searchSpy = spyOn(PortalApi, "searchGroups").and.callFake(
        (opts: ISearchOptions) => {
          const res = {
            results: [],
            query: opts.q,
            total: 0,
            start: 0,
            num: 0,
            nextStart: -1
          } as ISearchResult<IGroup>;
          // if this is the first call w/ a specific name
          // we want to fake the response to show the group
          // does exist
          if (opts.q === "foo bar baz AND orgid: BZ7426") {
            res.total = 1;
            res.results.push({} as IGroup);
          }
          return Promise.resolve(res);
        }
      );
      return getUniqueGroupName(
        "foo bar baz",
        "BZ7426",
        0,
        MOCK_REQUEST_OPTIONS
      ).then((res: string) => {
        expect(res).toBe("foo bar baz - 1");
        expect(searchSpy.calls.count()).toEqual(
          2,
          "should make two call to searchGroups"
        );
        done();
      });
    });
  });

  describe("helpers ::", () => {
    it("should check for sharedEditing correctly", () => {
      expect(
        isSharedEditingGroup({
          capabilities: ["foo", "updateitemcontrol", "lala"]
        })
      ).toBeTruthy();
      expect(
        isSharedEditingGroup({ capabilities: ["updateitemcontrol"] })
      ).toBeTruthy();
      expect(isSharedEditingGroup({ capabilities: [] })).toBeFalsy();
      expect(
        isSharedEditingGroup({ capabilities: ["foo", "baz"] })
      ).toBeFalsy();
    });
  });
});
