import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { canEditItem } from "../../src/access/can-edit-item";
import type { IUser, IItem, IGroup } from "@esri/arcgis-rest-portal";
import * as baseUtils from "../../src/access/has-base-priv";

describe("canEditItem", () => {
  const getModel = (props: any): IItem => props as IItem;
  const getUser = (props: any = {}): IUser => props as IUser;
  const getGroup = (props: any): IGroup => props as IGroup;

  let hasBasePrivSpy: ReturnType<typeof vi.spyOn> & {
    mockReset: () => void;
    mockReturnValue: (v: boolean) => void;
  };

  beforeEach(() => {
    hasBasePrivSpy = vi.spyOn(baseUtils, "hasBasePriv").mockReturnValue(true);
  });

  afterEach(() => {
    hasBasePrivSpy.mockReset();
    vi.restoreAllMocks();
  });

  it("returns true if user has priv and itemControl", () => {
    const model = getModel({ itemControl: "admin" });
    const user = getUser();
    const result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
  });

  it("returns true if user has priv and is owner", () => {
    const username = "jdoe";
    const model = getModel({ owner: username });
    const user = getUser({ username });
    const result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
  });

  it("returns true if user has priv and is itemOrgAdmin", () => {
    const orgId = "foo";
    const model = getModel({ orgId });
    const user = getUser({ orgId, role: "org_admin", roleId: null });
    const result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
  });

  it("returns true if user has priv and belongs to any item update groups", () => {
    const groupId = "foo";
    const group = getGroup({
      id: groupId,
      capabilities: ["updateitemcontrol"],
    });
    const user = getUser({ groups: [group] });
    let model = getModel({ groupIds: [groupId] });
    let result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);

    model = getModel({ properties: { collaborationGroupId: groupId } });
    result = canEditItem(model, user);
    expect(result).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(2);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
  });

  it("returns false if user lacks basic priv", () => {
    hasBasePrivSpy.mockReturnValue(false);
    const model = getModel({ itemControl: "admin" });
    const user = getUser();
    const result = canEditItem(model, user);
    expect(result).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
  });
});
