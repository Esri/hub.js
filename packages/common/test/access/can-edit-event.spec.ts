import type { IUser, IItem, IGroup } from "@esri/arcgis-rest-portal";
import { canEditEvent, IEventModel } from "../../src/access/can-edit-event";
import * as baseUtils from "../../src/access/has-base-priv";
import { IModel } from "../../src/hub-types";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("canEditEvent", function () {
  const getModel = (collaborationGroupId: any): IEventModel => {
    const item = {
      properties: {
        collaborationGroupId,
      },
    } as IItem;
    const initiative = { item } as IModel;
    return { initiative } as IEventModel;
  };
  const getUser = (props: any = {}): IUser => props as IUser;
  const getGroup = (props: any = {}): IGroup => props as IGroup;

  let hasBasePrivSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    hasBasePrivSpy = vi.spyOn(baseUtils, "hasBasePriv").mockReturnValue(true);
  });

  afterEach(() => {
    // restore original implementation between tests
    hasBasePrivSpy.mockRestore();
  });

  it(`returns true when user has base priv and is member of event's related initiative collab group`, function () {
    const groupId = "foo";
    const model = getModel(groupId);
    const group = getGroup({ id: groupId });
    const user = getUser({ groups: [group] });
    const res = canEditEvent(model, user);
    expect(res).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy.mock.calls[0]).toEqual([user]);
  });

  it(`returns true when user has base priv and is member of event's related site collab group`, function () {
    const groupId = "foo";
    const model = {
      site: { properties: { collaborationGroupId: groupId } },
    } as IEventModel;
    const group = getGroup({ id: groupId });
    const user = getUser({ groups: [group] });
    const res = canEditEvent(model, user);
    expect(res).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy.mock.calls[0]).toEqual([user]);
  });

  it(`returns false when user has base priv and is not member of event's related initiative/site collab group`, function () {
    const groupId = "foo";
    const model = getModel(groupId);
    const user = getUser({});
    const res = canEditEvent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy.mock.calls[0]).toEqual([user]);
  });

  it("returns false if there is no collaborationGroupId", function () {
    const model = {} as IEventModel;
    const user = getUser({});
    const res = canEditEvent(model, user);
    expect(res).toBe(false);
  });

  it(`returns false when user lacks base priv`, function () {
    hasBasePrivSpy.mockReturnValue(false);
    const groupId = "foo";
    const model = getModel(groupId);
    const group = getGroup({ id: groupId });
    const user = getUser({ groups: [group] });
    const res = canEditEvent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy.mock.calls[0]).toEqual([user]);
  });
});
