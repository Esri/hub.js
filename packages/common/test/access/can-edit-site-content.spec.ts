import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import type { IUser, IItem } from "@esri/arcgis-rest-portal";
import * as baseUtils from "../../src/access/has-base-priv";
import * as itemUtils from "../../src/access/can-edit-item";
import {
  canEditSiteContent,
  REQUIRED_PRIVS,
} from "../../src/access/can-edit-site-content";

describe("canEditSiteContent", () => {
  const getModel = (props: any): IItem => props as IItem;
  const getUser = (props: any = {}): IUser => props as IUser;
  let hasBasePrivSpy: any;
  let canEditItemSpy: any;

  beforeEach(() => {
    hasBasePrivSpy = vi
      .spyOn(baseUtils, "hasBasePriv")
      .mockReturnValue(true as unknown as boolean);
    canEditItemSpy = vi
      .spyOn(itemUtils, "canEditItem")
      .mockReturnValue(false as boolean);
  });

  afterEach(() => {
    hasBasePrivSpy.mockReset();
    canEditItemSpy.mockReset();
    vi.restoreAllMocks();
  });

  it("calls thru to canEditItem if user has base priv and context is not hub home", () => {
    const model = getModel({ properties: { isDefaultHubHome: false } });
    const user = getUser();
    canEditSiteContent(model, user);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(1);
    expect(canEditItemSpy).toHaveBeenCalledWith(model, user);
  });

  it("calls checks for additional privs if user has base priv and context is hub home", () => {
    const orgId = "foo";
    const model = getModel({ orgId, properties: { isDefaultHubHome: true } });
    let user = getUser({ orgId, privileges: REQUIRED_PRIVS });
    let res = canEditSiteContent(model, user);
    expect(res).toBe(true);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(0);

    user = getUser({ orgId, privileges: null });
    res = canEditSiteContent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(2);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(0);

    user = getUser({ privileges: null });
    res = canEditSiteContent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(3);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(0);
  });

  it("returns false if user lacks base priv", () => {
    hasBasePrivSpy.mockReturnValue(false as unknown as boolean);
    const model = getModel({});
    const user = getUser();
    const res = canEditSiteContent(model, user);
    expect(res).toBe(false);
    expect(hasBasePrivSpy).toHaveBeenCalledTimes(1);
    expect(hasBasePrivSpy).toHaveBeenCalledWith(user);
    expect(canEditItemSpy).toHaveBeenCalledTimes(0);
  });
});
