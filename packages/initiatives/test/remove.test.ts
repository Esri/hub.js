/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { removeInitiative } from "../src/remove";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { cloneObject } from "@esri/hub-common";
import * as DetachSiteAPi from "../src/detach-site";
import * as portal from "@esri/arcgis-rest-portal";
import * as GroupAPI from "../src/groups";
import * as InitiativeFetchAPI from "../src/get";
import { InitiativeInstance } from "./mocks/initiative-instance";
import { IInitiativeModel } from "@esri/hub-common";

let portalSelfSpy: any;
let getInitiativeSpy: any;
let unprotectItemSpy: any;
let removeItemSpy: any;
let getItemSpy: any;
let removeGroupSpy: any;
let detachSpy: any;

describe("remove Initiative", () => {
  beforeEach(() => {
    portalSelfSpy = spyOn(portal, "getSelf").and.callFake(() => {
      return Promise.resolve({
        id: "FAKEPORTALID",
        properties: {
          openData: {
            settings: {
              groupId: "bc3-ORG-OPENDATA-GROUP-ID"
            }
          }
        }
      });
    });
    getInitiativeSpy = spyOn(InitiativeFetchAPI, "getInitiative").and.callFake(
      (id: string, ro: any): Promise<IInitiativeModel> => {
        const clone = cloneObject(InitiativeInstance);
        clone.item.id = id;
        return Promise.resolve(clone as IInitiativeModel);
      }
    );
    unprotectItemSpy = spyOn(portal, "unprotectItem").and.callFake(
      (ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    getItemSpy = spyOn(portal, "getItem").and.callFake(
      (siteId: string, ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    removeItemSpy = spyOn(portal, "removeItem").and.callFake(
      (ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    removeGroupSpy = spyOn(GroupAPI, "removeInitiativeGroup").and.callFake(
      (id: string, ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    detachSpy = spyOn(DetachSiteAPi, "detachSiteFromInitiative").and.callFake(
      (opts: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );
  });
  it("should orchestrate the removal of the initiative", done => {
    return removeInitiative("bc3", MOCK_REQUEST_OPTIONS)
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(0);
        expect(removeGroupSpy.calls.count()).toEqual(3);
        expect(detachSpy.calls.count()).toEqual(1);
        expect(removeItemSpy.calls.count()).toEqual(1);
        done();
      })
      .catch(ex => {
        fail();
      });
  });

  it("should unprotect item before removal", done => {
    getInitiativeSpy.and.callFake(
      (id: string, ro: any): Promise<IInitiativeModel> => {
        const clone = cloneObject(InitiativeInstance);
        clone.item.id = id;
        clone.item.protected = true;
        return Promise.resolve(clone as IInitiativeModel);
      }
    );

    return removeInitiative("bc3", MOCK_REQUEST_OPTIONS)
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(1);
        expect(removeGroupSpy.calls.count()).toEqual(3);
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(detachSpy.calls.count()).toEqual(1);
        expect(removeItemSpy.calls.count()).toEqual(1);
        done();
      })
      .catch(ex => {
        fail();
      });
  });

  it("should handle no site id and no OD group", done => {
    getInitiativeSpy.and.callFake(
      (id: string, ro: any): Promise<IInitiativeModel> => {
        const clone = cloneObject(InitiativeInstance);
        clone.item.id = id;
        clone.item.protected = true;
        delete clone.item.properties.siteId;
        delete clone.item.properties.contentGroupId;
        return Promise.resolve(clone as IInitiativeModel);
      }
    );

    return removeInitiative("bc3", MOCK_REQUEST_OPTIONS)
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(1);
        expect(removeGroupSpy.calls.count()).toEqual(2);
        expect(getItemSpy.calls.count()).toEqual(0);
        expect(detachSpy.calls.count()).toEqual(0);
        expect(removeItemSpy.calls.count()).toEqual(1);
        done();
      })
      .catch(ex => {
        fail();
      });
  });

  it("should handle nonexistent site", done => {
    getInitiativeSpy.and.callFake(
      (id: string, ro: any): Promise<IInitiativeModel> => {
        const clone = cloneObject(InitiativeInstance);
        clone.item.id = id;
        clone.item.protected = true;
        return Promise.resolve(clone as IInitiativeModel);
      }
    );
    getItemSpy.and.callFake(
      (siteId: string, ro: any): Promise<any> => {
        return Promise.reject();
      }
    );
    return removeInitiative("bc3", MOCK_REQUEST_OPTIONS)
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(1);
        expect(removeGroupSpy.calls.count()).toEqual(3);
        expect(getItemSpy.calls.count()).toEqual(1);
        expect(detachSpy.calls.count()).toEqual(0);
        expect(removeItemSpy.calls.count()).toEqual(1);
        done();
      })
      .catch(ex => {
        fail();
      });
  });

  it("should handle group delete fail", done => {
    removeGroupSpy.and.callFake(
      (id: string, ro: any): Promise<any> => {
        return Promise.reject();
      }
    );

    return removeInitiative("bc3", MOCK_REQUEST_OPTIONS)
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(0);
        expect(removeGroupSpy.calls.count()).toEqual(3);
        expect(detachSpy.calls.count()).toEqual(1);
        expect(removeItemSpy.calls.count()).toEqual(1);
        done();
      })
      .catch(ex => {
        fail();
      });
  });
});
