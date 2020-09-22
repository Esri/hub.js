import * as baseUtils from "../../src/access/has-base-priv";
import * as itemUtils from "../../src/access/can-edit-item";
import { canEditDataset } from "../../src/access/can-edit-dataset";
import { IItem, IUser } from "@esri/arcgis-rest-types";

describe("canEditDataset", function() {
  let hasBasePrivSpy: jasmine.Spy;
  let canEditItemSpy: jasmine.Spy;
  const model = {} as IItem;
  const user = {} as IUser;

  beforeEach(() => {
    hasBasePrivSpy = spyOn(baseUtils, "hasBasePriv");
    canEditItemSpy = spyOn(itemUtils, "canEditItem");
  });

  afterEach(() => {
    hasBasePrivSpy.calls.reset();
    canEditItemSpy.calls.reset();
  });

  it("calls canEditItem if user has base priv", function() {
    hasBasePrivSpy.and.returnValue(true);
    canEditDataset(model, user);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(1);
    expect(canEditItemSpy.calls.argsFor(0)).toEqual([model, user]);
  });

  it("will not call canEditItem if user lacks base priv", function() {
    hasBasePrivSpy.and.returnValue(false);
    canEditDataset(model, user);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
    expect(canEditItemSpy.calls.count()).toBe(0);
  });
});
