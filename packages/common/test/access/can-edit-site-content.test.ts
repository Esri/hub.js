import { IUser, IItem } from "@esri/arcgis-rest-types";
import * as baseUtils from "../../src/access/has-base-priv";
import * as itemUtils from "../../src/access/can-edit-item";
import {
  canEditSiteContent,
  REQUIRED_PRIVS
} from "../../src/access/can-edit-site-content";

describe("canEditSiteContent", function() {
  const getModel = (props: any) => props as IItem;
  const getUser = (props: any = {}) => props as IUser;
  let hasBasePrivSpy: jasmine.Spy;
  let canEditItemSpy: jasmine.Spy;

  beforeEach(() => {
    hasBasePrivSpy = spyOn(baseUtils, "hasBasePriv").and.returnValue(true);
    canEditItemSpy = spyOn(itemUtils, "canEditItem");
  });

  afterEach(() => {
    hasBasePrivSpy.calls.reset();
    canEditItemSpy.calls.reset();
  });

  it("calls thru to canEditItem if user has base priv and context is not hub home", function() {
    const model = getModel({ properties: { isDefaultHubHome: false } });
    const user = getUser();
    canEditSiteContent(model, user);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(1);
    expect(canEditItemSpy.calls.argsFor(0)).toEqual([model, user]);
  });

  it("calls checks for additional privs if user has base priv and context is hub home", function() {
    const orgId = "foo";
    const model = getModel({ orgId, properties: { isDefaultHubHome: true } });
    let user = getUser({ orgId, privileges: REQUIRED_PRIVS });
    let res = canEditSiteContent(model, user);
    expect(res).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(0);

    user = getUser({ orgId, privileges: null });
    res = canEditSiteContent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(2);
    expect(hasBasePrivSpy.calls.argsFor(1)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(0);

    user = getUser({ privileges: null });
    res = canEditSiteContent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(3);
    expect(hasBasePrivSpy.calls.argsFor(2)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(0);
  });

  it("returns false if user lacks base priv", function() {
    hasBasePrivSpy.and.returnValue(false);
    const model = getModel({});
    const user = getUser();
    const res = canEditSiteContent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(0);
  });
});
