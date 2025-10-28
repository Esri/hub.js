import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import type { IUser, IItem } from "@esri/arcgis-rest-portal";
import * as baseUtils from "../../src/access/has-base-priv";
import * as itemUtils from "../../src/access/can-edit-item";
import { canEditSite } from "../../src/access/can-edit-site";

describe("canEditSite", () => {
  const getModel = (props: any): IItem => props as IItem;
  const getUser = (props: any = {}): IUser => props as IUser;
  let hasBasePrivSpy: any;
  let canEditItemSpy: any;

  beforeEach(() => {
    hasBasePrivSpy = vi
      .spyOn(baseUtils, "hasBasePriv")
      .mockReturnValue(true as any);
    canEditItemSpy = vi
      .spyOn(itemUtils, "canEditItem")
      .mockReturnValue(false as any);
  });

  afterEach(() => {
    hasBasePrivSpy.mockReset();
    canEditItemSpy.mockReset();
    vi.restoreAllMocks();
  });

  it("calls thru to canEditItem if user has base priv and context is not hub home", () => {
    const model = getModel({ properties: { isDefaultHubHome: false } });
    const user = getUser();
    canEditSite(model, user);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(1);
    expect(canEditItemSpy).toHaveBeenCalledWith(model, user);
  });

  it("returns false if context is hub home", () => {
    const model = getModel({ properties: { isDefaultHubHome: true } });
    const user = getUser();
    const res = canEditSite(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(0);
    expect(canEditItemSpy).toHaveBeenCalledTimes(0);
  });

  it("returns false if user lacks base priv", () => {
    hasBasePrivSpy.mockReturnValue(false as any);
    const model = getModel({});
    const user = getUser();
    const res = canEditSite(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(0);
  });
});
