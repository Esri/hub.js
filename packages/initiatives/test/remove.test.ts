/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { removeInitiative } from "../src/remove";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { cloneObject } from "@esri/hub-common";
import * as DetachSiteAPi from "../src/detach-site";
import * as ItemsAPI from "@esri/arcgis-rest-items";
import * as RequestAPI from "@esri/arcgis-rest-request";
import * as GroupAPI from "../src/groups";
import * as InitiativeFetchAPI from "../src/get";
import { InitiativeInstance } from "./mocks/initiative-instance";
import { IInitiativeModel } from "@esri/hub-common";

const CBWrapper = {
  updateProgress(options: any): any {
    return;
  }
};
let portalSelfSpy: any;
let unprotectItemSpy: any;
let removeItemSpy: any;
let progressCallbackSpy: any;
let removeGroupSpy: any;
let detachSpy: any;

describe("remove Initiative", () => {
  beforeEach(() => {
    portalSelfSpy = spyOn(RequestAPI, "getSelf").and.callFake(() => {
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
    unprotectItemSpy = spyOn(ItemsAPI, "unprotectItem").and.callFake(
      (ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    removeItemSpy = spyOn(ItemsAPI, "removeItem").and.callFake(
      (ro: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );

    progressCallbackSpy = spyOn(CBWrapper, "updateProgress").and.callFake(
      (options: any): any => {
        return;
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
  it("should orchestrate the removal of the intiative", done => {
    const getInitiativeSpy = spyOn(
      InitiativeFetchAPI,
      "getInitiative"
    ).and.callFake((id: string, ro: any): Promise<IInitiativeModel> => {
      const clone = cloneObject(InitiativeInstance);
      clone.item.id = id;
      return Promise.resolve(clone as IInitiativeModel);
    });

    return removeInitiative(
      "bc3",
      CBWrapper.updateProgress,
      MOCK_REQUEST_OPTIONS
    )
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(0);
        expect(removeGroupSpy.calls.count()).toEqual(2);
        expect(detachSpy.calls.count()).toEqual(1);
        expect(removeItemSpy.calls.count()).toEqual(1);
        expect(progressCallbackSpy.calls.count()).toEqual(5);
        done();
      })
      .catch(ex => {
        fail();
      });
  });

  it("should unprotect item before removal", done => {
    const getInitiativeSpy = spyOn(
      InitiativeFetchAPI,
      "getInitiative"
    ).and.callFake((id: string, ro: any): Promise<IInitiativeModel> => {
      const clone = cloneObject(InitiativeInstance);
      clone.item.id = id;
      clone.item.protected = true;
      return Promise.resolve(clone as IInitiativeModel);
    });

    return removeInitiative(
      "bc3",
      CBWrapper.updateProgress,
      MOCK_REQUEST_OPTIONS
    )
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(1);
        expect(removeGroupSpy.calls.count()).toEqual(2);
        expect(detachSpy.calls.count()).toEqual(1);
        expect(removeItemSpy.calls.count()).toEqual(1);
        expect(progressCallbackSpy.calls.count()).toEqual(5);
        done();
      })
      .catch(ex => {
        fail();
      });
  });

  it("should handle no site and no OD group", done => {
    const getInitiativeSpy = spyOn(
      InitiativeFetchAPI,
      "getInitiative"
    ).and.callFake((id: string, ro: any): Promise<IInitiativeModel> => {
      const clone = cloneObject(InitiativeInstance);
      clone.item.id = id;
      clone.item.protected = true;
      delete clone.item.properties.siteId;
      delete clone.item.properties.openDataGroupId;
      return Promise.resolve(clone as IInitiativeModel);
    });

    return removeInitiative(
      "bc3",
      CBWrapper.updateProgress,
      MOCK_REQUEST_OPTIONS
    )
      .then(response => {
        expect(portalSelfSpy.calls.count()).toEqual(1);
        expect(getInitiativeSpy.calls.count()).toEqual(1);
        expect(unprotectItemSpy.calls.count()).toEqual(1);
        expect(removeGroupSpy.calls.count()).toEqual(1);
        expect(detachSpy.calls.count()).toEqual(0);
        expect(removeItemSpy.calls.count()).toEqual(1);
        expect(progressCallbackSpy.calls.count()).toEqual(5);
        done();
      })
      .catch(ex => {
        fail();
      });
  });
});
