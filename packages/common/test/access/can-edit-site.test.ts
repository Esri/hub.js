import { IUser, IItem } from "@esri/arcgis-rest-types";
import * as baseUtils from "../../src/access/has-base-priv";
import * as itemUtils from "../../src/access/can-edit-item";
import { canEditSite } from "../../src/access/can-edit-site";

describe("canEditSite", function() {
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
    canEditSite(model, user);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(1);
    expect(canEditItemSpy.calls.argsFor(0)).toEqual([model, user]);
  });

  it("returns false if context is hub home", function() {
    const model = getModel({ properties: { isDefaultHubHome: true } });
    const user = getUser();
    const res = canEditSite(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(0);
    expect(canEditItemSpy.calls.count()).toBe(0);
  });

  it("returns false if user lacks base priv", function() {
    hasBasePrivSpy.and.returnValue(false);
    const model = getModel({});
    const user = getUser();
    const res = canEditSite(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(0);
  });
});
