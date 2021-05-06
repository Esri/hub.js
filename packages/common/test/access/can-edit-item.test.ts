import { canEditItem } from "../../src/access/can-edit-item";
import { IUser, IItem } from "@esri/arcgis-rest-types";
import * as baseUtils from "../../src/access/has-base-priv";

describe("canEditItem", function() {
  let hasBasePrivSpy: jasmine.Spy;
  let user: IUser;
  let item: IItem;

  beforeEach(() => {
    user = { groups: [] };
    item = ({ itemControl: "admin" } as unknown) as IItem;
    hasBasePrivSpy = spyOn(baseUtils, "hasBasePriv").and.returnValue(true);
  });

  afterEach(() => {
    hasBasePrivSpy.calls.reset();
  });

  it("returns true if user has priv and itemControl=admin (owner or item org admin)", function() {
    const result = canEditItem(item, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it("returns true if user has priv and itemControl=update (edit group member)", function() {
    item.itemControl = "update";
    const result = canEditItem(item, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it("returns false if user has priv and itemControl is neither admin or update", function() {
    delete item.itemControl;
    const result = canEditItem(item, user);
    expect(result).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it("returns false if user lacks basic priv", function() {
    hasBasePrivSpy.and.returnValue(false);
    const result = canEditItem(item, user);
    expect(result).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });
});
