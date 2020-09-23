import { IUser, IItem, IGroup } from "@esri/arcgis-rest-types";
import { canEditEvent, IEventModel } from "../../src/access/can-edit-event";
import * as baseUtils from "../../src/access/has-base-priv";
import { IModel } from "../../src/types";

describe("canEditEvent", function() {
  const getModel = (collaborationGroupId: any): IEventModel => {
    const item = {
      properties: {
        collaborationGroupId
      }
    } as IItem;
    const initiative = { item } as IModel;
    return { initiative } as IEventModel;
  };
  const getUser = (props: any = {}) => props as IUser;
  const getGroup = (props: any = {}) => props as IGroup;

  let hasBasePrivSpy: jasmine.Spy;

  beforeEach(() => {
    hasBasePrivSpy = spyOn(baseUtils, "hasBasePriv").and.returnValue(true);
  });

  afterEach(() => {
    hasBasePrivSpy.calls.reset();
  });

  it(`returns true when user has base priv and is member of event's related initiative collab group`, function() {
    const groupId = "foo";
    const model = getModel(groupId);
    const group = getGroup({ id: groupId });
    const user = getUser({ groups: [group] });
    const res = canEditEvent(model, user);
    expect(res).toBe(true);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it(`returns false when user has base priv and is not member of event's related initiative collab group`, function() {
    const groupId = "foo";
    const model = getModel(groupId);
    const user = getUser({});
    const res = canEditEvent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });

  it(`returns false when user lacks base priv`, function() {
    hasBasePrivSpy.and.returnValue(false);
    const groupId = "foo";
    const model = getModel(groupId);
    const group = getGroup({ id: groupId });
    const user = getUser({ groups: [group] });
    const res = canEditEvent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy.calls.count()).toBe(1);
    expect(hasBasePrivSpy.calls.argsFor(0)).toEqual([user]);
  });
});
