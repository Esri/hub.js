/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { detachSiteFromInitiative } from "../src/detach-site";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { cloneObject } from "@esri/hub-common";
import * as portal from "@esri/arcgis-rest-portal";
import { SiteItem } from "./mocks/site-item";

describe("detaching a site from initiative", () => {
  let getItemSpy: any;
  let updateItemSpy: any;
  let sharingSpy: any;
  beforeEach(() => {
    // setup the spies
    getItemSpy = spyOn(portal, "getItem").and.callFake(
      (id: string, opts: any): Promise<any> => {
        const clone = cloneObject(SiteItem);
        clone.item.id = id;
        return Promise.resolve(clone.item);
      }
    );
    updateItemSpy = spyOn(portal, "updateItem").and.callFake(
      (opts: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );
    sharingSpy = spyOn(portal, "shareItemWithGroup").and.callFake(
      (opts: any): Promise<any> => {
        return Promise.resolve({ success: true });
      }
    );
  });

  it("should get the site, reset props, save it and share to now group", done => {
    return detachSiteFromInitiative(
      "FAKESITEID",
      "FAKEODGROUPID",
      MOCK_REQUEST_OPTIONS
    ).then(result => {
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateItemSpy.calls.count()).toBe(1);
      expect(sharingSpy.calls.count()).toBe(1);
      done();
    });
  });
  it("should get the site, reset props, save it if new group undefined", done => {
    return detachSiteFromInitiative(
      "FAKESITEID",
      undefined,
      MOCK_REQUEST_OPTIONS
    ).then(result => {
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateItemSpy.calls.count()).toBe(1);
      expect(sharingSpy.calls.count()).toBe(0);
      done();
    });
  });
});
