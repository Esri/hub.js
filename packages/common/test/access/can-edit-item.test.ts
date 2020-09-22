import { canEditItem } from "../../src/access/can-edit-item";
import { IUser, IItem, IGroup } from "@esri/arcgis-rest-types";
import * as baseUtils from "../../src/access/has-base-priv";

describe("canEditItem", function() {
  const getModel = (props: any) => props as IItem;
  const getUser = (props: any = {}) => props as IUser;
  const getGroup = (props: any) => props as IGroup;

  let hasBasePrivSpy: jasmine.Spy;

  beforeEach(() => {
    hasBasePrivSpy = spyOn(baseUtils, "hasBasePriv").and.returnValue(true);
  });

  afterEach(() => {
    hasBasePrivSpy.calls.reset();
  });

  it("returns true if user has priv and itemControl", function() {
    const model = getModel({ itemControl: "admin" });
    const user = getUser();
    const result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it("returns true if user has priv and is owner", function() {
    const username = "jdoe";
    const model = getModel({ owner: username });
    const user = getUser({ username });
    const result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it("returns true if user has priv and is itemOrgAdmin", function() {
    let model = getModel({ isOrgItem: true });
    let user = getUser({ role: "org_admin", roleId: null });
    let result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);

    const orgId = "foo";
    model = getModel({ orgId });
    user = getUser({ orgId, role: "org_admin", roleId: null });
    result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(2);
    expect(hasBasePrivSpy.calls.argsFor(1)).toEqual([user]);
  });

  it("returns true if user has priv and belongs to any item update groups", function() {
    const groupId = "foo";
    const group = getGroup({
      id: groupId,
      capabilities: ["updateitemcontrol"]
    });
    const user = getUser({ groups: [group] });
    let model = getModel({ groupIds: [groupId] });
    let result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);

    model = getModel({ properties: { collaborationGroupId: groupId } });
    result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(2);
    expect(hasBasePrivSpy.calls.argsFor(1)).toEqual([user]);
  });

  it("returns false if user lacks basic priv", function() {
    hasBasePrivSpy.and.returnValue(false);
    const model = getModel({ itemControl: "admin" });
    const user = getUser();
    const result = canEditItem(model, user);
    expect(result).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it("returns false if no user", function() {
    const model = getModel({ itemControl: "admin" });
    const result = canEditItem(model);
    expect(result).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(0);
  });
});
